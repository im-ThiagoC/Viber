//"use client";


// Node imports
// import { useState, Suspense } from "react";
// import Link from "next/link";

// Database dependencies
// import { Fragment } from "@/generated/prisma";

// UI components
// import { EyeIcon, CodeIcon, CrownIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";

// My components
import { Navbar } from "@/modules/home/ui/components/navbar";

// Interface for props
interface LayoutProps {
  children: React.ReactNode;
};

const Layout = ({children}: LayoutProps) => {

  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <Navbar />
      <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]"/>
      <div className="flex-1 flex-col px-4 pb-4">

        {children}
      </div>
    </main>
  );
};

export default Layout;