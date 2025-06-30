import { GamepadIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const metadata = {
  title: "WillPlay - Track Your Gaming Journey",
  description:
    "Keep track of games you want to play and have already played. Organize your gaming backlog efficiently.",
};

export default function Page() {
  return (
    <section className="mx-auto flex h-svh w-full max-w-4xl items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="font-extrabold text-5xl text-white tracking-tight sm:text-6xl xl:text-7xl/none">
              Stop Drowning in Your
              <br />
              <span className="text-primary">Steam Library</span>
            </h1>
            <p className="mx-auto text-lg text-muted-foreground leading-relaxed md:text-xl">
              Remember those games you bought on a summer sale?
              <br />
              Did you ever play them?
            </p>
          </div>

          <div className="relative mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-xl">
            <Image
              alt="Steam Library Management Dashboard"
              className="h-full w-full border border-purple-500/20 object-cover object-center"
              height="400"
              src="/placeholder.svg?height=400&width=600"
              width="600"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
