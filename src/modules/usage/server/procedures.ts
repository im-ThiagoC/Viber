//"use client";

// Node imports
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

// My components
import { getUsageStatus } from "@/lib/usage";

export const usageRouter = createTRPCRouter({
  status: protectedProcedure.query(async () => {
    try {
      const result = await getUsageStatus();

      return result;

    } catch {
      return null;
    }
  })
})