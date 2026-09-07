"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { createCategoryAction, updateCategoryAction } from "@/lib/actions/admin/categories";
import type { CategoryInput } from "@/lib/validations/admin/category";

interface InitialCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export function CategoryForm({ initialCategory }: { initialCategory?: InitialCategory }) {
  const isEdit = Boolean(initialCategory);

  const [values, setValues] = useState({
    name: initialCategory?.name ?? "",
    slug: initialCategory?.slug ?? "",
    description: initialCategory?.description ?? "",
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

    const input: CategoryInput = {
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateCategoryAction(initialCategory!.id, input)
        : await createCategoryAction(input);
      if (result && !result.success) {
        setError(result.error ?? null);
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
      {error ? (
        <div role="alert" className="border border-sale/30 bg-sale-soft px-4 py-3 text-sm text-sale">
          {error}
        </div>
      ) : null}

      <Field label="Name" htmlFor="name" error={fieldErrors.name}>
        <input
          id="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className={inputClasses(Boolean(fieldErrors.name))}
        />
      </Field>

      <Field label="Slug" htmlFor="slug" error={fieldErrors.slug} hint="Lowercase letters, numbers, hyphens only.">
        <input
          id="slug"
          value={values.slug}
          onChange={(e) => update("slug", e.target.value)}
          className={inputClasses(Boolean(fieldErrors.slug))}
        />
      </Field>

      <Field label="Description (optional)" htmlFor="description" error={fieldErrors.description}>
        <textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className={inputClasses(Boolean(fieldErrors.description))}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
      </Button>
    </form>
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
  hint,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-sale">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
