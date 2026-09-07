import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { NewsletterForm } from "@/components/home/NewsletterForm";

export function NewsletterSection() {
  return (
    <Section tone="ink" className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-lg">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-paper/50">
              Newsletter
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
              Join the list
            </h2>
            <p className="mt-3 text-base text-paper/60">
              New arrivals, restocks, and the occasional edit worth reading.
              We keep it infrequent.
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
