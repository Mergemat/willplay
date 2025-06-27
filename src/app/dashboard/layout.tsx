"use client";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { toast } from "sonner";
import LoadingSpinner from "~/components/loading-spinner";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      </AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  );
}
function SignIn() {
  const handleSubmit = async () => {
    await authClient.signIn.social(
      {
        provider: "discord",
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
  };

  return (
    <>
      <Button onClick={handleSubmit}>Sign In</Button>
    </>
  );
}
