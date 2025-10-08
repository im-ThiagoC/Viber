// Header
// This is the Main Page of the application, this app will be a Lovable Clone, 
// it makes use of AI to build Websites, it will have a simple UI,
// Next.js 15, React, Inngest, Prisma

"use client";

import Image from "next/image";

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";

// Imports

const Page = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo-ai.svg"
            alt="Vibe Logo"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Welcome to Viber
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Create apps and Websites by chatting with AI.
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>
      <ProjectsList />
    </div>
  );
};
 
export default Page;