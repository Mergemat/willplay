import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "~/components/ui/button";

export function MoveToButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">Move to</Button>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}
