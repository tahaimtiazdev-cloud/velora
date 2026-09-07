import "server-only";
import { notFound, redirect } from "next/navigation";
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

/**
 * Authorization for every /admin page and admin Server Action. Role comes
 * only from the server-verified session — never from a client-supplied
 * value. A non-admin (including a signed-out visitor) gets a 404, not a
 * redirect to login, so the existence of the admin area isn't disclosed.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    notFound();
  }
  return session.user;
}
