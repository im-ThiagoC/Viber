//"use client";

// Node imports
// import { useState, Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { RateLimiterPrisma } from "rate-limiter-flexible";

import { prisma } from "@/lib/db";

const FREE_TIER_LIMIT					= 2;									// 2 projects per month for free users
const PRO_POINTS 							= 100;								// 100 projects per month for pro users
const CLAUDE_PRO_POINTS 			= 30;									// 30 projects per month for claude pro users
const EXTENDED_PREMIUM_POINTS = 100;								// 100 projects per month for extended pro users
const DURATION 								= 30 * 24 * 60 * 60;	// 30 days in seconds
const GENERATION_COST 				= 1;									// 1 credit per generation

export async function getUsageTracker () {
	const { has } = await auth();
	
	const hasProAccess 							= has({ plan: "pro" 								});
	const hasClaudeProAccess 				= has({ plan: "claude_pro" 					});
	const hasExtendedPremiumAccess 	= has({ plan: "extended_claude_pro" });

	const points = 	hasExtendedPremiumAccess 	? EXTENDED_PREMIUM_POINTS : 
									hasClaudeProAccess 				? CLAUDE_PRO_POINTS 			: 
									hasProAccess 							? PRO_POINTS 							: 
									FREE_TIER_LIMIT;

  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points	: points,
    duration: DURATION,
  });

	return usageTracker;
};

export async function consumeCredits() {
	const { userId } = await auth();

	if (!userId) {
		throw new Error("User not authenticated");
	}
	
	const usageTracker = await getUsageTracker();
	const result = await usageTracker.consume(userId, GENERATION_COST);
	return result;
};

export async function getUsageStatus () {
	const { userId } = await auth();

	if (!userId) {
		throw new Error("User not authenticated");
	}

	const usageTracker = await getUsageTracker();
	const result = await usageTracker.get(userId);

	return result;
};