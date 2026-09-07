export const CART_UPDATED_EVENT = "velora:cart-updated";

/** Notifies any mounted cart-aware components (header badge, cart page) to
 * refetch fresh cart data. Used after every successful cart mutation. */
export function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}
