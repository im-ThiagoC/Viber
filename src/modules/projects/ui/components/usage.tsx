//"use client";

// Node imports
// import { useState, Suspense } from "react";
import Link from "next/link";
import { formatDuration, intervalToDuration } from "date-fns";

// Database dependencies
// import { Fragment } from "@/generated/prisma";

// UI components
import { CrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useMemo } from "react";

// My components
// import { CodeView } from "@/components/code-view";

interface UsageProps {
  points: number;
  msBeforeNext: number;
}

export const Usage = ({ points, msBeforeNext }: UsageProps) => {
  const { has } = useAuth();

  const hasFreeAccess = has?.({ plan: "free-user" });

  const resetTime = useMemo(() => {
    try {
      return formatDuration(
        intervalToDuration({
          start: new Date(),
          end: new Date(Date.now() + msBeforeNext) 
        }),
        { format: ["months", "days", "hours"] }
      )
    } catch (error) {
      console.error("Error parsing reset time:", error);
      return "Unknown";
    }
  }, [msBeforeNext]);

  const paidAccess = !hasFreeAccess;

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {points} {paidAccess ? "" : "free"} credits remaining
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in {" "}
            {resetTime ? (resetTime) : ("Unknown")}
          </p>
        </div>
        {!paidAccess && (        
          <Button
            asChild
            size={"sm"}
            variant={"tertiary"}
            className="ml-auto"
          >
            <Link href={"/pricing"}>
              <CrownIcon /> Upgrade
            </Link>
          </Button>
        )}
        {paidAccess && (        
          <CrownIcon className="ml-auto mr-3 text-purple-500" />
        )}
      </div>
    </div>
  )
}