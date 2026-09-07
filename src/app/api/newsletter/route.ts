import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();

  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    await db.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  } catch (error) {
    console.error("Failed to save newsletter subscriber:", error);
    return NextResponse.json(
      { message: "We couldn't save that right now. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
