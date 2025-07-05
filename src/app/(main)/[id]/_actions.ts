"use server";

import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function getUserById(userId: string) {
  const user = await clerkClient.users.getUser(userId);

  return user;
}
