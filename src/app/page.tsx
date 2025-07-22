import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { shimmer, toBase64 } from "~/lib/utils";

export const metadata: Metadata = {
  title: "WillPlay - Organize Your Game Collection",
  description:
    "Stop drowning in your Steam library. Organize your game collection, track what to play next, and never forget games you bought on sale.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WillPlay - Organize Your Game Collection",
    description:
      "Stop drowning in your Steam library. Organize your game collection, track what to play next, and never forget games you bought on sale.",
    url: "https://willplay.me",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <section className="relative mx-auto flex h-svh w-full justify-center overflow-hidden">
      <div className="container z-10 flex h-2/3 flex-col justify-center px-4 md:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="font-extrabold text-4xl text-white tracking-tight sm:text-6xl xl:text-7xl/none">
              Stop Drowning in Your
              <br />
              <span className="text-primary">Steam Library</span>
            </h1>
            <p className="mx-auto text-base text-muted-foreground leading-normal md:text-xl">
              Remember those games you bought on a summer sale?
              <br />
              Did you ever play them?
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
      <Image
        alt="Steam Library Management Dashboard"
        className="absolute top-3/5 h-2/3 w-11/12 origin-top rounded-xl border border-muted border-r-0 object-cover object-left px-4 md:h-1/2 md:border-r md:object-top"
        height={992}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1280, 992))}`}
        priority
        src="https://stoic-cod-60.convex.cloud/api/storage/52da9a2b-e4fa-46a6-92d9-1c114064b4a1"
        width={1280}
      />
      <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-b from-transparent to-background" />
      <div className="absolute bottom-0 left-0 h-96 w-full bg-gradient-to-r from-transparent to-background md:hidden" />
    </section>
  );
}
