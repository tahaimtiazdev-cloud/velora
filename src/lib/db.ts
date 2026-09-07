import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma issues prepared statements by default, which conflict with
 * Neon's transaction-mode pooler (PgBouncer) unless this flag is set —
 * without it, queries against the pooled connection string hang
 * indefinitely rather than erroring. Applied here in code so it's correct
 * regardless of how DATABASE_URL was sourced (integration-injected on
 * Vercel vs. hand-edited locally).
 */
function withPgBouncerFlag(connectionString: string): string {
  if (connectionString.includes("pgbouncer=")) return connectionString;
  const separator = connectionString.includes("?") ? "&" : "?";
  return `${connectionString}${separator}pgbouncer=true`;
}

function createClient() {
  const adapter = new PrismaPg({
    connectionString: withPgBouncerFlag(process.env.DATABASE_URL!),
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
