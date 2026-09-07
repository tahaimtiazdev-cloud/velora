"use client";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProductAction } from "@/lib/actions/admin/products";

export function ProductRowActions({ productId }: { productId: string }) {
  return <DeleteButton action={() => deleteProductAction(productId)} />;
}
