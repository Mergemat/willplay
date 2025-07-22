import { Share } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function ShareButton({ userId }: { userId?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => {
            // add to clipboard
            toast.promise(
              navigator.clipboard.writeText(`https://willplay.me/${userId}`),
              {
                loading: "Copying link...",
                success: "Link copied to clipboard!",
                error: "Failed to copy link to clipboard.",
              }
            );
          }}
          size="icon"
          variant="secondary"
        >
          <Share className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share</p>
      </TooltipContent>
    </Tooltip>
  );
}
