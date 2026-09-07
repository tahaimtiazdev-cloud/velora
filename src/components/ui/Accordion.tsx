"use client";

import { useId, useState, type ReactNode } from "react";

interface AccordionItem {
  title: string;
  content: ReactNode;
}

export function Accordion({ items, defaultOpenIndex }: { items: AccordionItem[]; defaultOpenIndex?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex ?? null);
  const baseId = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.title}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="focus-ring flex w-full items-center justify-between py-4 text-left text-sm font-medium text-ink"
              >
                {item.title}
                <span aria-hidden="true" className="ml-4 text-lg text-muted">
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="pb-4 text-sm leading-relaxed text-muted"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
