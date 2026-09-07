import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-ink">Create Account</h1>
        <p className="mt-2 text-sm text-muted">
          Save your details for faster checkout and track your orders.
        </p>

        <div className="mt-8">
          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="focus-ring font-medium text-ink underline">
            Sign in
          </Link>
        </p>
      </div>
    </Container>
  );
}
