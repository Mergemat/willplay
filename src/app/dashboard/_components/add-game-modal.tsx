"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/../convex/_generated/api";
import type { Doc } from "~/../convex/_generated/dataModel";
import { GameSearchInput } from "~/components/game-search-input";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { GameStatus, Priority } from "~/lib/types";

const formSchema = z.object({
  game: z.object({
    id: z.string().optional(),
    steamId: z.number().optional(),
    name: z.string(),
    description: z.string(),
    image: z.string(),
  }),
  status: z.custom<GameStatus>(),
  priority: z.custom<Priority>(),
});

export function AddGameModal() {
  const searchParams = useSearchParams();
  const activeList = useMemo(
    () => (searchParams.get("status") as GameStatus) || "wishlist",
    [searchParams]
  );

  const [isOpen, setIsOpen] = useState(false);
  const addGameToList = useMutation(api.gamelist.addGameToList);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: "medium",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const selectedGame = form.watch("game");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedGame) {
      toast.error("Please select a game first.");
      return;
    }

    try {
      await addGameToList({
        gameId: selectedGame.id,
        status: values.status,
        priority: values.priority,
      });
      toast.success(`${selectedGame.name} has been added to your list.`);
      form.reset();
      setIsOpen(false);
    } catch (error) {
      const message =
        error instanceof ConvexError || error instanceof Error
          ? error.message
          : "Unknown error";
      toast.error(message);
    }
  };

  const handleGameSelect = (game: Doc<"games">) => {
    form.setValue("game", {
      id: game._id,
      steamId: game.steamId,
      name: game.name,
      description: game.description,
      image: game.image,
    });
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        setIsOpen(value);
        form.reset();
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button className="w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" />
          <span>Add Game</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a New Game</DialogTitle>
          <DialogDescription>
            Search for a game to add to your collection.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <GameSearchInput onGameSelect={handleGameSelect} />

            {selectedGame && (
              <>
                <SelectedGameView game={selectedGame} />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          defaultValue={activeList}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="wishlist">Wishlist</SelectItem>
                            <SelectItem value="playlist">Playlist</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
            <DialogFooter className="pt-4">
              <Button
                disabled={isSubmitting || !selectedGame || !isValid}
                type="submit"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Add to Collection
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function SelectedGameView({
  game,
}: {
  game: {
    name: string;
    description: string;
    image: string;
  };
}) {
  return (
    <div className="flex w-full items-center gap-4 rounded-lg border border-border border-dashed p-2">
      <Image
        alt={game.name}
        className="h-10 w-16 object-cover"
        height={100}
        src={game.image}
        width={100}
      />
      <h2 className="line-clamp-1 font-bold text-xl">{game.name}</h2>
    </div>
  );
}
