"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { createCheckoutSession } from "@/lib/actions/checkout";
import type { CartView } from "@/lib/queries/cart";
import type { OrderTotals } from "@/lib/checkout/pricing";

interface Props {
  cart: CartView;
  totals: OrderTotals;
  initialName: string;
  initialEmail: string;
}

const initialValues = {
  customerName: "",
  customerEmail: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

export function CheckoutForm({ cart, totals, initialName, initialEmail }: Props) {
  const [values, setValues] = useState({
    ...initialValues,
    customerName: initialName,
    customerEmail: initialEmail,
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof typeof values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await createCheckoutSession(values);
      if (result && !result.success) {
        setError(result.error ?? null);
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {error ? (
          <div role="alert" className="border border-sale/30 bg-sale-soft px-4 py-3 text-sm text-sale">
            {error}
          </div>
        ) : null}

        <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Contact & Shipping</h2>

        <Field label="Full Name" htmlFor="customerName" error={fieldErrors.customerName}>
          <input
            id="customerName"
            name="customerName"
            type="text"
            autoComplete="name"
            required
            value={values.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            aria-invalid={Boolean(fieldErrors.customerName)}
            className={inputClasses(Boolean(fieldErrors.customerName))}
          />
        </Field>

        <Field label="Email" htmlFor="customerEmail" error={fieldErrors.customerEmail}>
          <input
            id="customerEmail"
            name="customerEmail"
            type="email"
            autoComplete="email"
            required
            value={values.customerEmail}
            onChange={(e) => update("customerEmail", e.target.value)}
            aria-invalid={Boolean(fieldErrors.customerEmail)}
            className={inputClasses(Boolean(fieldErrors.customerEmail))}
          />
        </Field>

        <Field label="Address" htmlFor="addressLine1" error={fieldErrors.addressLine1}>
          <input
            id="addressLine1"
            name="addressLine1"
            type="text"
            autoComplete="address-line1"
            required
            value={values.addressLine1}
            onChange={(e) => update("addressLine1", e.target.value)}
            aria-invalid={Boolean(fieldErrors.addressLine1)}
            className={inputClasses(Boolean(fieldErrors.addressLine1))}
          />
        </Field>

        <Field label="Apartment, suite, etc. (optional)" htmlFor="addressLine2">
          <input
            id="addressLine2"
            name="addressLine2"
            type="text"
            autoComplete="address-line2"
            value={values.addressLine2}
            onChange={(e) => update("addressLine2", e.target.value)}
            className={inputClasses(false)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="City" htmlFor="city" error={fieldErrors.city}>
            <input
              id="city"
              name="city"
              type="text"
              autoComplete="address-level2"
              required
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              aria-invalid={Boolean(fieldErrors.city)}
              className={inputClasses(Boolean(fieldErrors.city))}
            />
          </Field>
          <Field label="State / Province" htmlFor="state" error={fieldErrors.state}>
            <input
              id="state"
              name="state"
              type="text"
              autoComplete="address-level1"
              required
              value={values.state}
              onChange={(e) => update("state", e.target.value)}
              aria-invalid={Boolean(fieldErrors.state)}
              className={inputClasses(Boolean(fieldErrors.state))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Postal Code" htmlFor="postalCode" error={fieldErrors.postalCode}>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              autoComplete="postal-code"
              required
              value={values.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
              aria-invalid={Boolean(fieldErrors.postalCode)}
              className={inputClasses(Boolean(fieldErrors.postalCode))}
            />
          </Field>
          <Field label="Country" htmlFor="country" error={fieldErrors.country}>
            <input
              id="country"
              name="country"
              type="text"
              autoComplete="country-name"
              required
              value={values.country}
              onChange={(e) => update("country", e.target.value)}
              aria-invalid={Boolean(fieldErrors.country)}
              className={inputClasses(Boolean(fieldErrors.country))}
            />
          </Field>
        </div>

        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending ? "Redirecting to Payment…" : "Continue to Payment"}
        </Button>
        <p className="text-center text-xs text-muted">
          You&apos;ll enter card details on Stripe&apos;s secure checkout page. This store never sees
          or stores your card number.
        </p>
      </form>

      <div className="h-fit border border-line bg-surface p-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-ink">Order Summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span className="text-muted">
                {item.productName}
                {item.variantLabel ? ` — ${item.variantLabel}` : ""} &times; {item.quantity}
              </span>
              <span className="shrink-0 text-ink">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="text-ink">{formatPrice(totals.subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="text-ink">{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Estimated Tax</dt>
            <dd className="text-ink">{formatPrice(totals.tax)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm font-medium text-ink">Total</span>
          <span className="text-lg text-ink">{formatPrice(totals.total)}</span>
        </div>
      </div>
    </div>
  );
}

function inputClasses(hasError: boolean) {
  return `focus-ring mt-1.5 w-full border bg-paper px-3.5 py-2.5 text-sm text-ink ${
    hasError ? "border-sale" : "border-line"
  }`;
}

function Field({
  label,
  htmlFor,
  children,
  error,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-xs font-medium text-sale">{error}</p> : null}
    </div>
  );
}
