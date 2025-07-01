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
    <section className="relative mx-auto flex h-svh w-full justify-center overflow-hidden">
      <div className="container flex h-2/3 flex-col justify-center px-4 md:px-6">
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

          <Button asChild size="lg">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
      <Image
        alt="Steam Library Management Dashboard"
        className="absolute top-1/2 h-2/3 w-11/12 origin-top object-cover object-left lg:object-top"
        height="992"
        src="https://stoic-cod-60.convex.cloud/api/storage/eacfece4-762c-40f9-b2e8-147db0c19790"
        width="1280"
      />
    </section>
  );
}
