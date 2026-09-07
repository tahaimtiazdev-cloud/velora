import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: { template: "%s — Admin — VELORA", default: "Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <Container className="py-10 sm:py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
