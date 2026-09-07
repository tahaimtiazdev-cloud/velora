/** Accepts a number, a numeric string, or a Prisma Decimal (anything stringifiable). */
export function formatPrice(value: number | string | { toString(): string }): string {
  const amount = typeof value === "number" ? value : Number(value.toString());
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
