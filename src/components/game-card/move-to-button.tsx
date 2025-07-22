import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { STATUS_ICONS, STATUS_LABELS, STATUSES } from "~/lib/constants";
import type { GameStatus } from "~/lib/types";

// TODO: Make this an Edit button
export function MoveToButton({
  currentStatus,
  changeGameStatus,
}: {
  currentStatus: GameStatus;
  changeGameStatus: (status: GameStatus) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          Move to
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(STATUSES).map((status) => {
          if (status === currentStatus) {
            return null;
          }
          const Icon = STATUS_ICONS[status];
          return (
            <DropdownMenuItem
              key={status}
              onClick={() => changeGameStatus(status)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {STATUS_LABELS[status]}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
