//"use client";

// Node imports
import { useState, useMemo, useCallback, Fragment } from "react";

// Database dependencies
//import { Fragment } from "@/generated/prisma";

// UI components
import { ChevronRight, Code, CopyCheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";

// My components
import { Hint } from "@/components/hint";
import { TreeView } from "@/components/tree-view";
import { CodeView } from "@/components/code-view";
import { convertFilesToTreeItems } from "@/lib/utils";

type FileCollection = { [path: string] : string };

function getLanguageFromExtension(filePath: string) {
  const extension = filePath.split('.').pop()?.toLowerCase();
  return extension || "text";
};

interface FileBreadcrumbProps {
  filePath: string;
};

const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
  const pathSegments = filePath.split("/");
  const maxSegments = 4; // Maximum segments to display before collapsing
  
  const renderBreadcrumbItems = () => {
    if (pathSegments.length <= maxSegments) {
      // Show all segments if within limit
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        
        return (
          <Fragment key={index}>
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage className="font-medium">
              {segment}
              </BreadcrumbPage>
            ) : (
              <span className="text-muted-foreground">
                {segment}
              </span>
            )}
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      })
    } else {
      const firstSegment = pathSegments[0];
      const lastSegment = pathSegments[pathSegments.length - 1];

      return (
        <>
          <BreadcrumbItem>
            <span className="text-muted-foreground">
              {firstSegment}
            </span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">
              {lastSegment}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      );
    };
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {renderBreadcrumbItems()}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

interface FileExplorerProps {
  files: FileCollection;
};

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback((filePath: string) => {
    if(files[filePath]) {
      setSelectedFile(filePath);
    }
  }, [files]);

  const handleCopy = useCallback(() => {
    if(selectedFile && files[selectedFile]) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      toast.success("Copied to clipboard");
    }
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justifty-between items-center gap-x-2">
              <FileBreadcrumb filePath={selectedFile} />
              <Hint text="Copy to clipboard" side="bottom">
                <Button 
                  variant={"outline"} 
                  size={"icon"} 
                  className="ml-auto" 
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? <CopyCheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView 
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view it&apos;s contents.
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
