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
          <div className="flex min-h-screen items-center justify-center">
            <LoadingSpinner />
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
