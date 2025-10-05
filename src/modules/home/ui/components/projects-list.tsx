//"use client";

// Node imports
// import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

// Database dependencies
// import { Fragment } from "@/generated/prisma";

// UI components
// import { EyeIcon, CodeIcon, CrownIcon } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// My components
// import { CodeView } from "@/components/code-view";

export const ProjectsList = () => {
  const trpc = useTRPC();
  const { data: projects } = useQuery(
    trpc.projects.getMany.queryOptions()
  );

  return (
    <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-x-4">
      <h2 className="text-2xl font-semibold">
        Previous Vibes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects?.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-sm text-muted-foreground">
              You have no projects yet. Create one!
            </p>
          </div>
        )}
        {projects?.map((project) => (
          <Button
            key={project.id}
            variant={"outline"}
            className="font-normal h-auto justify-start w-full text-start p-4"
            asChild
          >
            <Link
              href={`/projects/${project.id}`}
            >
              <div className="flex items-center gap-x-4">
                <Image
                  src="/logo-ai.svg"
                  alt="Vibe Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <div className="flex flex-col">
                  <h3 className="truncate font-medium">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(project.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}