import { type NextRequest, NextResponse } from "next/server";
import { getPartSuggestions } from "@/lib/catalog";
import { isCarModel, modelShortName } from "@/lib/models";

// მთავარი გვერდის ძიების შეთავაზებები. აბრუნებს მხოლოდ საიტზე გამოჩენილ ნაწილებს.
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().slice(0, 100) ?? "";
  const model = request.nextUrl.searchParams.get("model");
  if (q.length < 2) return NextResponse.json({ suggestions: [] });

  const rows = await getPartSuggestions(q, isCarModel(model) ? model : undefined);
  return NextResponse.json({
    suggestions: rows.map((part) => ({
      id: part.id,
      name: part.name,
      oemCode: part.oemCode,
      imageUrl: part.imageUrl,
      models: part.models.map(modelShortName),
    })),
  });
}
