export type GarmentVariant =
  | "jacket"
  | "dress"
  | "trousers"
  | "bag"
  | "top"
  | "shoe"
  | "accessory"
  | "knit";

const paths: Record<GarmentVariant, string> = {
  // Bomber / outerwear jacket
  jacket:
    "M100 26c10 0 18 6 24 14l30 10-8 24-16-6v96c0 6-4 10-10 10H80c-6 0-10-4-10-10V68l-16 6-8-24 30-10c6-8 14-14 24-14Zm-10 8c-6 4-10 10-12 16m32-16c6 4 10 10 12 16M100 60v100",
  // A-line dress
  dress:
    "M78 40c6-8 14-12 22-12s16 4 22 12l8 20-14 8 4 118H80l4-118-14-8 8-20Zm14-6c2 6 8 10 8 10m8-10c-2 6-8 10-8 10",
  // Straight-leg trousers
  trousers:
    "M62 34h76l4 40-10 118H98l-6-92-6 92H52l4-118 6-40Zm0 0-2 20h80l-2-20",
  // Structured tote bag
  bag:
    "M56 84h88l10 106H46L56 84Zm18 0V64a26 26 0 0 1 52 0v20M46 108h108",
  // Crew neck top
  top:
    "M76 34 60 44l-18 30 18 14 12-14v104h56V74l12 14 18-14-18-30-16-10c-4 8-14 12-24 12s-20-4-24-12Z",
  // Low-top sneaker, side profile
  shoe:
    "M30 168h140c6 0 10-6 6-12l-10-16c-14 2-26-2-36-10-10-8-22-12-36-10l-42 8c-8 2-14 8-16 16l-6 10c-2 6 2 14 0 14Zm14-40 8-24m30 24 4-26m26 26 2-22",
  // Sunglasses
  accessory:
    "M40 108a24 24 0 1 0 48 0 24 24 0 0 0-48 0Zm72 0a24 24 0 1 0 48 0 24 24 0 0 0-48 0ZM88 100h24M40 100l-16-6m144 6 16-6",
  // Folded knit sweater
  knit:
    "M50 60c8-14 22-24 40-26l10 14 10-14c18 2 32 12 40 26l-16 20-10-8v82c0 6-4 10-10 10H86c-6 0-10-4-10-10V72l-10 8-16-20Zm40-22v20m20-20v20",
};

const viewBoxes: Record<GarmentVariant, string> = {
  jacket: "0 0 200 260",
  dress: "0 0 200 260",
  trousers: "0 0 200 260",
  bag: "0 0 200 260",
  top: "0 0 200 260",
  shoe: "0 0 200 200",
  accessory: "0 0 200 140",
  knit: "0 0 200 260",
};

export function GarmentIllustration({
  variant,
  className = "",
  strokeWidth = 2.2,
}: {
  variant: GarmentVariant;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox={viewBoxes[variant]}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d={paths[variant]}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
