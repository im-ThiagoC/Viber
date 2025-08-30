// Header
// This is the Main Page of the application, this app will be a Lovable Clone, 
// it makes use of AI to build Websites, it will have a simple UI,
// Next.js 15, React, Inngest, Prisma

// Use Client Component
//'use client';

// Imports
import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { Suspense } from "react";

const Page = async () => {
  // const trpc = useTRPC();

  // const { data } = useQuery(trpc.createAI.queryOptions({ text: "Thiago!" }));
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({ text: "Thiago PREFETCH" }));
  const data = await caller.createAI({ text: "Thiago!" });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
}
 
export default Page;