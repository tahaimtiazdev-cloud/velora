import "server-only";
import { auth } from "@/auth";
import { ensureCartToken, getCartToken } from "@/lib/cart/session";
import type { Prisma } from "@/generated/prisma/client";

export type CartOwner = { type: "user"; userId: string } | { type: "guest"; token: string };

/** Resolves the current cart owner without creating anything — signed-in
 * user takes priority over any guest cookie. Returns null if there's no
 * session and no guest cart cookie yet (i.e. nothing to look up). */
export async function getCartOwner(): Promise<CartOwner | null> {
  const session = await auth();
  if (session?.user?.id) {
    return { type: "user", userId: session.user.id };
  }
  const token = await getCartToken();
  if (token) {
    return { type: "guest", token };
  }
  return null;
}

/** Same as getCartOwner, but creates a guest cookie if the visitor has
 * neither a session nor a cart cookie yet. Only call from a context that
 * can set cookies (Server Actions, Route Handlers) — not a render. */
export async function ensureCartOwner(): Promise<CartOwner> {
  const session = await auth();
  if (session?.user?.id) {
    return { type: "user", userId: session.user.id };
  }
  const token = await ensureCartToken();
  return { type: "guest", token };
}

export function cartWhereForOwner(owner: CartOwner): Prisma.CartWhereUniqueInput {
  return owner.type === "user" ? { userId: owner.userId } : { sessionToken: owner.token };
}

export function cartCreateDataForOwner(owner: CartOwner): Prisma.CartCreateInput {
  return owner.type === "user"
    ? { user: { connect: { id: owner.userId } } }
    : { sessionToken: owner.token };
}

/** Whether a loaded Cart row actually belongs to the given owner — used
 * to authorize update/remove mutations rather than trusting a client-
 * supplied cart or cart-item id alone. */
export function cartBelongsToOwner(
  cart: { userId: string | null; sessionToken: string | null },
  owner: CartOwner
): boolean {
  return owner.type === "user" ? cart.userId === owner.userId : cart.sessionToken === owner.token;
}
