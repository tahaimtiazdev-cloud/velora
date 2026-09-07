"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { mergeGuestCartIntoUserCart } from "@/lib/cart/merge";

export interface AuthActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

function safeCallbackUrl(callbackUrl: string | undefined): string {
  // Only ever redirect to a relative, in-app path — never trust a client-
  // supplied absolute URL (open-redirect protection).
  return callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
    ? callbackUrl
    : "/account";
}

function flattenFieldErrors(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function loginAction(input: {
  email: string;
  password: string;
  callbackUrl?: string;
}): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid email or password." };
    }
    throw error;
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    await mergeGuestCartIntoUserCart(user.id);
  }

  redirect(safeCallbackUrl(input.callbackUrl));
}

export async function registerAction(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  callbackUrl?: string;
}): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return {
      success: false,
      fieldErrors: { email: "An account with this email already exists." },
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: "CUSTOMER",
      },
    });
  } catch (error) {
    console.error("User registration failed:", error);
    return { success: false, error: "We couldn't create your account. Please try again." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    // The account was created successfully; sign-in failing right after is
    // unexpected but shouldn't block registration from having succeeded.
    console.error("Auto sign-in after registration failed:", error);
    redirect("/login");
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    await mergeGuestCartIntoUserCart(user.id);
  }

  redirect(safeCallbackUrl(input.callbackUrl));
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/");
}
