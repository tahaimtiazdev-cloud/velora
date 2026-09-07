import { NextResponse } from "next/server";
import { getCartView } from "@/lib/queries/cart";

/** Read-only endpoint returning the current cart's live state. Used by
 * client components (header badge, cart page) to refresh after a mutation
 * without depending on Next.js layout/router-cache revalidation timing. */
export async function GET() {
  try {
    const cart = await getCartView();
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Failed to load cart:", error);
    return NextResponse.json({ message: "Could not load cart." }, { status: 500 });
  }
}
