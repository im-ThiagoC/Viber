"use client";

// Node imports
import { useState, Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

// Database dependencies
import { Fragment } from "@/generated/prisma";

// UI components
import { EyeIcon, CodeIcon, CrownIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

// My components
import { CodeView } from "@/components/code-view";
import { FileExplorer } from "@/components/file-explorer";
import { ProjectHeader } from "../components/project-header";
import { MessagesContainer } from "../components/messages-container";
import { FragmentWeb } from "../components/fragment-web";
import { UserControl } from "@/components/user-control";
import { ErrorBoundary } from "react-error-boundary";


interface ProjectViewProps {
	projectId: string;
	activeFragment?: Fragment | null;
	setActiveFragment?: (fragment: Fragment | null) => void;
};

export const ProjectView = ({ projectId }: ProjectViewProps) => {
	const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
	const [tabState, setTabState] = useState<"preview" | "code">("preview");

	const { has } = useAuth();

  const hasFreeAccess = has?.({ plan: "free-user" });

  const paidAccess = !hasFreeAccess;

	return (
		<div className="h-screen">
			<ResizablePanelGroup direction="horizontal">
				
				<ResizablePanel 
					defaultSize={35} 
					minSize={20} 
					className="flex flex-col min-h-0"
				>
					<ErrorBoundary fallback={<p>There was an error loading the project header.</p>}>
						<Suspense fallback={<p>Loading project...</p>}>
							<ProjectHeader projectId={projectId} />
						</Suspense>
					</ErrorBoundary>
					<ErrorBoundary fallback={<p>There was an error loading messages.</p>}>
						<Suspense fallback={<p>Loading messages...</p>}>
							<MessagesContainer 
								projectId={projectId}
								activeFragment={activeFragment}
								setActiveFragment={setActiveFragment}
							/>
						</Suspense>
					</ErrorBoundary>
				</ResizablePanel>
				<ResizableHandle className="hover:bg-primary transition-colors" />
				<ResizablePanel
					defaultSize={65}
					minSize={50}
				>
					<Tabs
						className="h-full gap-y-0"
						defaultValue="preview"
						value={tabState}
						onValueChange={(value) => setTabState(value as "preview" | "code")}
					>
						<div className="w-full flex items-center p-2 border-b gap-x-2">
							<TabsList className="h-8 p-0 border rounded-md">
								<TabsTrigger value="preview" className="rounded-md">
									<EyeIcon /> <span> Demo </span>
								</TabsTrigger>
								<TabsTrigger value="code" className="rounded-md">
									<CodeIcon /> <span> Code </span>
								</TabsTrigger>
								
							</TabsList>
							<div className="ml-auto flex items-center gap-x-2">
								{paidAccess && (
									<div className="flex items-center gap-x-2 text-sm font-medium">
										<CrownIcon className="ml-auto text-purple-500" />
										<p> You have premium access! </p>
									</div>
								)}
								{!paidAccess && (
								<Button asChild size={"sm"} variant="tertiary" >
									<Link href={`/pricing`}>
										<CrownIcon /> Upgrade to Pro
									</Link>
								</Button>
								)}
								<UserControl />
							</div>
						</div>
						<TabsContent value="preview">
							{!!activeFragment && <FragmentWeb data={activeFragment} />}
						</TabsContent>
						<TabsContent value="code" className="min-h-0">
							{!!activeFragment?.files && (
								<FileExplorer 
									files={activeFragment.files as { [path: string]: string }}
								/>
							)}
						</TabsContent>
					</Tabs>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};