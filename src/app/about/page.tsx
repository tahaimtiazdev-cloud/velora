import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GarmentIllustration } from "@/components/ui/GarmentIllustration";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind VELORA, plus how to reach us and what to expect on shipping and returns.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Section tone="paper" className="py-10 sm:py-14">
        <Container>
          <SectionHeading eyebrow="Our Story" title="Designed for the way you live" />
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative flex aspect-[4/3] items-center justify-center bg-ink text-paper">
              <GarmentIllustration variant="knit" className="h-2/3 w-2/3 text-paper/70" strokeWidth={1.3} />
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted">
              <p>
                VELORA started as a rejection of the seasonal churn — twelve drops a year,
                most of it landfill within eighteen months. Instead we work in small,
                considered collections built to be worn for years, not seasons.
              </p>
              <p>
                Every piece goes through the same question before it ships: would we
                still want to wear this in five years? If the answer isn&apos;t yes, it
                doesn&apos;t make the collection. That means fewer releases, more time
                spent on fabric and construction, and honest pricing that reflects what
                the piece actually costs to make well.
              </p>
              <p>
                We&apos;re a small team, and this store is where we sell directly —
                no wholesale markup, no middlemen, just the clothes and the people who
                make and wear them.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="contact" tone="ink" className="py-10 sm:py-14">
        <Container>
          <SectionHeading tone="paper" eyebrow="Get in Touch" title="Contact" />
          <div className="mt-6 max-w-xl space-y-2 text-sm leading-relaxed text-paper/70">
            <p>
              For order questions, sizing help, or anything else, email us and we&apos;ll
              get back to you within one business day.
            </p>
            <p>
              <a href={`mailto:${siteConfig.email}`} className="focus-ring text-paper underline underline-offset-4">
                {siteConfig.email}
              </a>
            </p>
          </div>
        </Container>
      </Section>

      <Section id="shipping" tone="paper" className="py-10 sm:py-14">
        <Container>
          <SectionHeading eyebrow="The Details" title="Shipping & Returns" />
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="font-serif text-lg text-ink">Shipping</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Orders are processed within 1–2 business days and typically arrive within
                5–7 business days. You&apos;ll receive a confirmation email once your order
                ships.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-ink">Returns</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Unworn items in original condition can be returned within 30 days of
                delivery. Contact us at the email above and we&apos;ll walk you through
                the process.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
