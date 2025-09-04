// Header
// This is the Main Page of the application, this app will be a Lovable Clone, 
// it makes use of AI to build Websites, it will have a simple UI,
// Next.js 15, React, Inngest, Prisma

// Use Client Component
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

// Imports

const Page = () => {
  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions())
  const newMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      // Handle success
      toast.success("Message created successfully!");
    }
  }));

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button 
        disabled={newMessage.isPending} 
        onClick={() => newMessage.mutate({ value: value })}
      >
        Invoke Background Job
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
}
 
export default Page;