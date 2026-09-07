"use client";

import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProductAction } from "@/lib/actions/admin/products";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  return (
    <DeleteButton
      action={() => deleteProductAction(productId)}
      confirmLabel="Delete Product"
      onDeleted={() => router.push("/admin/products")}
    />
  );
}
