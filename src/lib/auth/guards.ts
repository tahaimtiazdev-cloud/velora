import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * The real (secure) authorization check for protected pages/Server
 * Actions — verifies the session server-side via the signed JWT cookie.
 * proxy.ts only does an optimistic redirect; this is what actually
 * guards the data.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}
