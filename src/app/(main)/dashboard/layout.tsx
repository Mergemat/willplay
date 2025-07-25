"use client";
import { RedirectToSignIn, UserButton } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import Link from "next/link";
import LoadingSpinner from "~/components/loading-spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthLoading>
        <div className="flex min-h-screen flex-col items-center justify-center gap-2">
          <LoadingSpinner />
          <h2 className="text-center font-bold text-muted-foreground text-sm">
            Authenticating...
          </h2>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="flex min-h-screen flex-col items-center justify-center gap-2">
          <RedirectToSignIn />
        </div>
      </Unauthenticated>
      <Authenticated>
        <nav className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-background p-4 2xl:px-8">
          <Link className="font-bold text-3xl" href="/dashboard">
            WillPlay
          </Link>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </nav>
        {children}
      </Authenticated>
    </>
  );
}
