import { z } from "zod";

import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { generateSlug } from "random-word-slugs"

export const projectsRouter = createTRPCRouter({
  // Define your procedures here
  create: baseProcedure
    .input(
      z.object({
        value: z.string()
          .min(1,     {	message: "Project name cannot be empty" })
          .max(10000, {	message: "Project name is too long"   	})
      })
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create ({
        data: {
          name: generateSlug(2, {
            format: "kebab"
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
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

  getMany: baseProcedure
    .query(async () => {
      // Logic to get projects
      const projects = await prisma.project.findMany({
        orderBy: { updatedAt: 'desc' },
      })


      return projects;
    }),

});