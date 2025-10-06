"use client";

import { useCurrentTheme } from "@/hooks/use-current-theme";
import { dark } from "@clerk/themes";
// Node imports
import { UserButton } from "@clerk/nextjs";
// import Link from "next/link";

// Database dependencies
// import { Fragment } from "@/generated/prisma";

// UI components
// import { EyeIcon, CodeIcon, CrownIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";

// My components
// import { CodeView } from "@/components/code-view";

interface UserControlProps {
  showName?: boolean;
}

export const UserControl = ({ showName }: UserControlProps) => {
  const currentTheme = useCurrentTheme();

  return (
    <div>
      <UserButton 
        showName={showName}
        appearance={{
          elements: {
            userButtonBox: "rounded-md!",
            userButtonAvatarBox: "rounded-md! size-8!",
            userButtonTrigger: "rounded-md!"
          },
          baseTheme: currentTheme === "dark" ? dark : undefined,
        }}
      />
    </div>
  )
}