import "server-only";
import { Resend } from "resend";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

interface OrderConfirmationInput {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  total: number;
  items: { productName: string; variantLabel: string | null; quantity: number; priceAtPurchase: number }[];
}

/**
 * Best-effort order confirmation email. Order creation must never fail or
 * roll back because email delivery failed, so every caller treats this as
 * fire-and-forget and only logs failures.
 */
export async function sendOrderConfirmationEmail(input: OrderConfirmationInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const resend = new Resend(apiKey);
    const itemsHtml = input.items
      .map(
        (item) =>
          `<tr><td style="padding:8px 0;">${item.productName}${item.variantLabel ? ` (${item.variantLabel})` : ""} &times; ${item.quantity}</td><td style="padding:8px 0;text-align:right;">${formatPrice(item.priceAtPurchase * item.quantity)}</td></tr>`
      )
      .join("");

    await resend.emails.send({
      from: `${siteConfig.name} <orders@${new URL(siteConfig.url).hostname}>`,
      to: input.customerEmail,
      subject: `Your VELORA order ${input.orderNumber} is confirmed`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h1 style="font-size:20px;">Thanks for your order, ${input.customerName}.</h1>
          <p>Order <strong>${input.orderNumber}</strong> is confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">${itemsHtml}</table>
          <p style="margin-top:16px;font-weight:bold;">Total: ${formatPrice(input.total)}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}
