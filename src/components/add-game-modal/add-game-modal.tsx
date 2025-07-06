"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/../convex/_generated/api";
import type { Doc, Id } from "~/../convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "~/components/ui/revola";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  PRIORITIES,
  PRIORITY_ICONS,
  PRIORITY_LABELS,
  STATUS_ICONS,
  STATUS_LABELS,
  STATUSES,
} from "~/lib/constants";
import type { GameStatus, Priority } from "~/lib/types";
import { shimmer, toBase64 } from "~/lib/utils";
import { GameInput } from "./game-search-input";

const formSchema = z.object({
  game: z.object({
    id: z.string().optional(),
    steamId: z.number(),
    name: z.string(),
    description: z.string(),
    image: z.string(),
    genre: z.string(),
  }),
  status: z.custom<GameStatus>(),
  priority: z.custom<Priority>(),
});

export function AddGameModal() {
  const [isOpen, setIsOpen] = useState(false);
  const addGameToList = useMutation(api.gamelist.addGameToList);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: STATUSES.WISHLIST,
      priority: "medium",
    },
  });

  const { isSubmitting } = form.formState;

  const selectedGame = form.watch("game");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedGame) {
      toast.error("Please select a game first.");
      return;
    }

    try {
      await addGameToList({
        game: {
          id: selectedGame.id as Id<"games">,
          steamId: selectedGame.steamId,
          name: selectedGame.name,
          description: selectedGame.description,
          image: selectedGame.image,
          genre: selectedGame.genre,
        },
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

  const handleGameSelect = (game: Partial<Doc<"games">>) => {
    form.setValue("game", {
      id: game._id,
      steamId: game.steamId ?? 0,
      name: game.name ?? "",
      description: game.description ?? "",
      image: game.image ?? "",
      genre: game.genre ?? "",
    });
  };

  return (
    <ResponsiveDialog
      onOpenChange={(value) => {
        setIsOpen(value);
        form.reset();
      }}
      open={isOpen}
    >
      <ResponsiveDialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Game</span>
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="h-svh p-6 sm:h-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Add a New Game</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Search for a game to add to your collection.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <Form {...form}>
          <form
            className="grid gap-6 pt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <GameInput onGameSelect={handleGameSelect} />

            {selectedGame && (
              <div className="flex flex-col gap-6 rounded-lg border border-primary/20 border-dashed p-4">
                <SelectedGameView game={selectedGame} />
                <div className="-mt-2 flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[99999]">
                            {Object.values(STATUSES).map((status) => {
                              const Icon = STATUS_ICONS[status];
                              return (
                                <SelectItem key={status} value={status}>
                                  <Icon className="mr-2 h-4 w-4" />
                                  {STATUS_LABELS[status]}
                                </SelectItem>
                              );
                            })}
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
                          <SelectContent className="z-[99999]">
                            {Object.values(PRIORITIES).map((priority) => {
                              const Icon = PRIORITY_ICONS[priority];
                              return (
                                <SelectItem key={priority} value={priority}>
                                  <Icon className="mr-2 h-4 w-4" />
                                  {PRIORITY_LABELS[priority]}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            <ResponsiveDialogFooter className="sm:pt-6">
              <Button type="submit">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Add to Collection
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
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
    <div className="flex w-full items-center gap-4 rounded-lg">
      <Image
        alt={game.name}
        className="h-12 w-20 rounded-sm object-cover"
        height={100}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(100, 100))}`}
        src={game.image}
        width={100}
      />
      <h2 className="line-clamp-1 font-bold text-xl">{game.name}</h2>
    </div>
  );
}
