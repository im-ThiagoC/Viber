import { z } from "zod";

import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { generateSlug } from "random-word-slugs"
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";
import { auth } from "@clerk/nextjs/server";

export const projectsRouter = createTRPCRouter({
  
  // Define your procedures here
  create: protectedProcedure
    .input(
      z.object({
        value: z.string()
          .min(1,     {	message: "Project name cannot be empty" })
          .max(10000, {	message: "Project name is too long"   	})
      })
    )
    .mutation(async ({ input, ctx }) => {

      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You have exceeded your usage limits. Please upgrade your plan.",
          })
        }
      }

      const { has } = await auth();

      const isFreeUser 						= has?.({ plan: "free_user" });
      const isPro 								= has?.({ plan: "pro" });
      const isClaudePro 					= has?.({ plan: "claude_pro" });
      const isExtendedClaudePro 	= has?.({ plan: "extended_claude_pro" });

      const hasClaudeAccess = isClaudePro || isExtendedClaudePro;
      const hasGPTAccess		= isFreeUser 	|| isPro; 

      if(!hasClaudeAccess && !hasGPTAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to any AI models. Please upgrade your plan.",
        })
      }

      const createdProject = await prisma.project.create ({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, {
            format: "kebab"
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
              ai: hasClaudeAccess ? "CLAUDE_SONNET_4_5" : "GPT_4_1",
            }
          }
        }
      })

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        }
      })

      return createdProject;
    }),

  getOne: protectedProcedure
    .input(z.object({
      id: z.string().min(1, { message: "Id is required" }),
    }))
    .query(async ({ input, ctx }) => {
      // Logic to get projects
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId
        },
      });

      if(!existingProject) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      return existingProject;
    }),

  getMany: protectedProcedure
    .query(async ({ ctx }) => {
      // Logic to get projects
      const projects = await prisma.project.findMany({
        where: {
          userId: ctx.auth.userId,
        },
        orderBy: { updatedAt: 'desc' },
      })


      return projects;
    }),

});