import { Gamepad } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function EmptyState() {
  return (
    <div className="flex h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Gamepad className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-medium text-lg">
        You don't have any games here yet.
      </h3>
      <Button className="mt-6" variant="outline">
        Add a game
      </Button>
    </div>
  );
}

