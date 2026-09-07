import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";

const CART_COOKIE = "velora_cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Reads the guest cart token from the request cookie, if any. Safe to call
 * from a Server Component render (read-only, no cookie mutation).
 */
export async function getCartToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

/**
 * Reads the guest cart token, generating and setting a new one if absent.
 * Must be called from a Server Action or Route Handler (cookie writes are
 * not allowed during a plain Server Component render).
 */
export async function ensureCartToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) return existing;

  const token = randomBytes(32).toString("hex");
  store.set(CART_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
  return token;
}

export async function clearCartToken(): Promise<void> {
  const store = await cookies();
  store.delete(CART_COOKIE);
}
