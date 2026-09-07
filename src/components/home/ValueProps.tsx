import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const values = [
  {
    title: "Thoughtful design",
    description: "Every piece is edited for fit and longevity, not just trend.",
  },
  {
    title: "Quality materials",
    description: "Natural fibers and finishes chosen to hold up over years, not seasons.",
  },
  {
    title: "Easy returns",
    description: "30 days to try it at home. Free returns on every order.",
  },
  {
    title: "Secure checkout",
    description: "Payments are processed securely — we never see or store your card details.",
  },
];

export function ValueProps() {
  return (
    <Section tone="surface" className="py-14 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {values.map((value) => (
            <div key={value.title} className="border-t border-ink/15 pt-5">
              <h3 className="text-sm font-medium text-ink">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{value.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
