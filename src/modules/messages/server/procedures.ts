import { z } from "zod";

import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const messagesRouter = createTRPCRouter({
  // Define your procedures here
  create: protectedProcedure
    .input(
      z.object({
        value: z.string()
          .min(1, "Message cannot be empty")
          .max(10000, { message: "Message is too long..."}),

        projectId: z.string().min(1, { message: "Project ID is required"})
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId
        }
      })

      if(!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project does not exist"
        })
      }

      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong: " + error.message,
          });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You have exceeded your usage limits. Please upgrade your plan.",
          })
        }
      }

      const newMessage = await prisma.message.create({
        data: {
          projectId: existingProject.id,
          content: input.value,
          role: "USER",
          type: "RESULT",
        }
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: existingProject.id,
        }
      })

      return newMessage;
    }),
    
  getMany: protectedProcedure
      .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required"})
      }),
    )
    .query(async ({ input, ctx }) => {
      // Logic to get messages
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: {
            userId: ctx.auth.userId,
          }
        },
        include: { 
          fragment: true 
        },
        orderBy: { 
          updatedAt: 'asc' 
        },
        take: 20,
      })

      return messages;
    }),

});