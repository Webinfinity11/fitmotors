// მანქანის სამი მოდელი. სია ფიქსირებულია და ემთხვევა ბაზის car_model enum-ს.
export const CAR_MODELS = [
  { slug: "fit", name: "Honda FIT", short: "FIT" },
  { slug: "hrv", name: "Honda HR-V", short: "HR-V" },
  { slug: "vezel", name: "Honda VEZEL", short: "VEZEL" },
] as const;

export type CarModelSlug = (typeof CAR_MODELS)[number]["slug"];

export const CAR_MODEL_SLUGS = CAR_MODELS.map((m) => m.slug) as [CarModelSlug, ...CarModelSlug[]];

export function isCarModel(value: unknown): value is CarModelSlug {
  return typeof value === "string" && (CAR_MODEL_SLUGS as string[]).includes(value);
}

export function modelShortName(slug: string): string {
  return CAR_MODELS.find((m) => m.slug === slug)?.short ?? slug;
}

export function formatPrice(price: string | null): string | null {
  if (price === null) return null;
  const value = Number(price);
  return `${Number.isInteger(value) ? value : value.toFixed(2)} ₾`;
}
