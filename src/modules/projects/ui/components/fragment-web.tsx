import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Fragment } from "@/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";

interface FragmentWebProps {
  data: Fragment;
}

export function FragmentWeb({ data }: FragmentWebProps) {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const onRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    if (!data.sandboxUrl) return;
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh" side="bottom" alignment="start">
          <Button size={"sm"} variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon className="size-4" />
          </Button>
        </Hint>
        <Hint text="Click to copy" side="bottom" alignment="start">
        <Button 
          size={"sm"} 
          variant="outline" 
          className="flex-1 justify-start text-start font-normal" 
          disabled={!data.sandboxUrl || copied} 
          onClick={handleCopy}
        >
          <span className="truncate">{data.sandboxUrl}</span>
        </Button>
        </Hint>
        <Hint text="Open in new tab" side="bottom" alignment="start">
          <Button 
            size={"sm"} 
            disabled={!data.sandboxUrl} 
            variant={"outline"} 
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  );
};