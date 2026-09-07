import "server-only";
import { db } from "@/lib/db";

export async function getUserProfile(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
}
