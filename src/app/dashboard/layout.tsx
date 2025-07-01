"use client";
import { ClerkProvider, SignInButton } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import LoadingSpinner from "~/components/loading-spinner";
import { ConvexClientProvider } from "./_components/convex-client-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <AuthLoading>
          <div className="flex min-h-screen flex-col items-center justify-center gap-2">
            <LoadingSpinner />
            <h2 className="text-center font-bold text-muted-foreground text-sm">
              Authenticating...
            </h2>
          </div>
        </AuthLoading>
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
        <Authenticated>{children}</Authenticated>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
