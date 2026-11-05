import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCatalogPart } from "@/lib/catalog";
import { CAR_MODELS, formatPrice } from "@/lib/models";

const WHATSAPP_URL = "https://wa.me/995568380380";

async function loadPart(params: Promise<{ id: string }>) {
  const { id } = await params;
  return /^\d{1,9}$/.test(id) ? getCatalogPart(Number(id)) : null;
}

export async function generateMetadata({ params }: PageProps<"/parts/[id]">): Promise<Metadata> {
  const part = await loadPart(params);
  if (!part) return { title: "ნაწილი ვერ მოიძებნა - FIT MOTORS", robots: { index: false } };

  const models = CAR_MODELS.filter((model) => part.models.includes(model.slug)).map((model) => model.name);
  return {
    title: `${part.name} - FIT MOTORS`,
    description: part.description?.slice(0, 160) ?? `${part.name} - ${models.join(", ")}`,
  };
}

export default function PartPage({ params }: PageProps<"/parts/[id]">) {
  return (
    <Suspense fallback={<p className="parts-loading">იტვირთება…</p>}>
      <PartDetails params={params} />
    </Suspense>
  );
}

async function PartDetails({ params }: Pick<PageProps<"/parts/[id]">, "params">) {
  const part = await loadPart(params);
  if (!part) notFound();

  const price = formatPrice(part.price);
  const models = CAR_MODELS.filter((model) => part.models.includes(model.slug));
  const inquiry = [
    `გამარჯობა! მაინტერესებს ნაწილი: ${part.name}`,
    part.oemCode ? `კოდი: ${part.oemCode}` : null,
    `მოდელი: ${models.map((model) => model.name).join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <article className="part-page">
      <nav aria-label="ნავიგაციის ბილიკი" className="part-breadcrumb">
        <Link href="/parts">ნაწილები</Link>
        {part.parentCategoryId && part.parentCategoryName && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/parts?category=${part.parentCategoryId}`}>{part.parentCategoryName}</Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <Link href={`/parts?category=${part.categoryId}`}>{part.categoryName}</Link>
      </nav>

      <div className="part-page-grid">
        <div className="part-page-image">
          {part.imageUrl ? (
            <Image src={part.imageUrl} alt={part.name} fill preload sizes="(max-width: 900px) 92vw, 600px" />
          ) : (
            <span>ფოტო არ არის</span>
          )}
        </div>

        <div className="part-page-info">
          <h1>{part.name}</h1>
          {part.oemCode && (
            <p className="part-page-code">
              კოდი: <span>{part.oemCode}</span>
            </p>
          )}

          <div className="part-page-models">
            <span>ვარგისია:</span>
            {models.map((model) => (
              <Link key={model.slug} href={`/parts?model=${model.slug}`}>
                {model.name}
              </Link>
            ))}
          </div>

          <p className={price ? "part-page-price" : "part-page-price part-page-price--none"}>
            {price ?? "ფასი შეთანხმებით"}
          </p>

          <div className="part-page-actions">
            <a
              className="btn"
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(inquiry)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              მოთხოვნა WhatsApp-ზე
            </a>
            <a className="btn btn--outline" href="tel:+995568380380">
              დარეკვა
            </a>
          </div>

          {part.description && (
            <section className="part-page-description">
              <h2>აღწერა</h2>
              <p>{part.description}</p>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
