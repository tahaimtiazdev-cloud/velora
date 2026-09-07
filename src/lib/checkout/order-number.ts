import { randomBytes } from "node:crypto";

/** Timestamp + random suffix keeps collisions practically impossible without
 * needing retry-on-conflict logic against the unique orderNumber column. */
export function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `VEL-${stamp}-${suffix}`;
}
