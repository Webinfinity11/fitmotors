import type { Metadata } from "next";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getCatalogCategories, getCatalogParts, getCatalogPriceRange } from "@/lib/catalog";
import { CAR_MODELS, formatPrice, modelShortName } from "@/lib/models";
import { PAGE_SIZE, type PartFilters, type PartRow, parseFilters } from "@/lib/parts-query";
import { CategoryNav } from "./category-nav";

export const metadata: Metadata = {
  title: "ნაწილები - FIT MOTORS",
  description: "ავტონაწილების კატალოგი Honda FIT, HR-V და VEZEL-ისთვის.",
};

const WHATSAPP_URL = "https://wa.me/995568380380";

export default function PartsPage({ searchParams }: PageProps<"/parts">) {
  return (
    <>
      <header className="parts-heading">
        <h1>ნაწილები</h1>
        <p>ავტონაწილები Honda FIT, HR-V და VEZEL-ისთვის</p>
      </header>
      <Suspense fallback={<p className="parts-loading">იტვირთება…</p>}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function catalogHref(filters: PartFilters, patch: Partial<PartFilters>): string {
  const next = { ...filters, page: 1, ...patch };
  const params = new URLSearchParams();
  if (next.model) params.set("model", next.model);
  if (next.categoryId) params.set("category", String(next.categoryId));
  if (next.q) params.set("q", next.q);
  if (next.minPrice) params.set("minPrice", next.minPrice);
  if (next.maxPrice) params.set("maxPrice", next.maxPrice);
  if (next.page > 1) params.set("page", String(next.page));
  const query = params.toString();
  return query ? `/parts?${query}` : "/parts";
}

async function Catalog({ searchParams }: Pick<PageProps<"/parts">, "searchParams">) {
  const filters = parseFilters(await searchParams);
  const [{ rows, total }, tree, priceRange] = await Promise.all([
    getCatalogParts(filters),
    getCatalogCategories(filters.model),
    getCatalogPriceRange(filters.model),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const visibleTree = tree.filter((category) => category.count > 0);
  const hasPriceFilter = Boolean(filters.minPrice || filters.maxPrice);
  const showSidebar = visibleTree.length > 0 || priceRange?.max !== null || hasPriceFilter;

  return (
    <>
      <div className="parts-toolbar">
        <nav className="parts-models" aria-label="მოდელი">
          <Link
            href={catalogHref(filters, { model: undefined })}
            aria-current={filters.model ? undefined : "true"}
          >
            ყველა
          </Link>
          {CAR_MODELS.map((model) => (
            <Link
              key={model.slug}
              href={catalogHref(filters, { model: model.slug })}
              aria-current={filters.model === model.slug ? "true" : undefined}
            >
              {model.short}
            </Link>
          ))}
        </nav>
        <Form action="/parts" className="parts-search" role="search">
          {filters.model && <input type="hidden" name="model" value={filters.model} />}
          {filters.categoryId && <input type="hidden" name="category" value={filters.categoryId} />}
          {filters.minPrice && <input type="hidden" name="minPrice" value={filters.minPrice} />}
          {filters.maxPrice && <input type="hidden" name="maxPrice" value={filters.maxPrice} />}
          <input name="q" type="search" placeholder="ძიება სახელით ან კოდით" aria-label="ძიება" defaultValue={filters.q} />
          <button type="submit" className="btn">
            ძიება
          </button>
        </Form>
      </div>

      <div className="parts-layout">
        {showSidebar && (
          <aside className="parts-sidebar">
            {visibleTree.length > 0 && (
              <section className="parts-categories">
                <h2>კატეგორიები</h2>
                <CategoryNav
                  allHref={catalogHref(filters, { categoryId: undefined })}
                  activeId={filters.categoryId}
                  categories={visibleTree.map((category) => ({
                    id: category.id,
                    name: category.name,
                    count: category.count,
                    href: catalogHref(filters, { categoryId: category.id }),
                    children: category.children
                      .filter((child) => child.count > 0)
                      .map((child) => ({
                        id: child.id,
                        name: child.name,
                        count: child.count,
                        href: catalogHref(filters, { categoryId: child.id }),
                      })),
                  }))}
                />
              </section>
            )}

            <section className="parts-price">
              <h2>ფასი (₾)</h2>
              {/* key ასუფთავებს ველებს, როცა ფილტრი URL-იდან იცვლება */}
              <Form key={`${filters.minPrice}:${filters.maxPrice}`} action="/parts">
                {filters.model && <input type="hidden" name="model" value={filters.model} />}
                {filters.categoryId && <input type="hidden" name="category" value={filters.categoryId} />}
                {filters.q && <input type="hidden" name="q" value={filters.q} />}
                <div className="parts-price-fields">
                  <label>
                    <span>დან</span>
                    <input
                      name="minPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      placeholder={priceRange?.min ? String(Number(priceRange.min)) : "0"}
                      defaultValue={filters.minPrice}
                    />
                  </label>
                  <label>
                    <span>მდე</span>
                    <input
                      name="maxPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      placeholder={priceRange?.max ? String(Number(priceRange.max)) : ""}
                      defaultValue={filters.maxPrice}
                    />
                  </label>
                </div>
                <button type="submit" className="btn">
                  გაფილტვრა
                </button>
                {hasPriceFilter && (
                  <Link className="parts-price-clear" href={catalogHref(filters, { minPrice: undefined, maxPrice: undefined })}>
                    ფასის ფილტრის მოხსნა
                  </Link>
                )}
              </Form>
            </section>
          </aside>
        )}

        <div className="parts-results">
          {rows.length === 0 ? (
            <div className="parts-empty">
              <p>{filters.q || filters.model || filters.categoryId || hasPriceFilter ? "ამ ფილტრით ნაწილი ვერ მოიძებნა." : "კატალოგი მალე შეივსება."}</p>
              <p>
                გჭირდებათ კონკრეტული ნაწილი?{" "}
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  მოგვწერეთ WhatsApp-ზე
                </a>
              </p>
            </div>
          ) : (
            <div className="parts-grid">
              {rows.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav className="parts-pagination" aria-label="გვერდები">
              {filters.page > 1 && <Link href={catalogHref(filters, { page: filters.page - 1 })}>← წინა</Link>}
              <span>
                {filters.page} / {pages}
              </span>
              {filters.page < pages && <Link href={catalogHref(filters, { page: filters.page + 1 })}>შემდეგი →</Link>}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

function PartCard({ part }: { part: PartRow }) {
  const price = formatPrice(part.price);
  return (
    <article className="part-card">
      <Link href={`/parts/${part.id}`} className="part-card-link">
        <div className="part-card-image">
          {part.imageUrl ? (
            <Image src={part.imageUrl} alt={part.name} fill sizes="(max-width: 600px) 100vw, (max-width: 1100px) 33vw, 280px" />
          ) : (
            <span>ფოტო არ არის</span>
          )}
        </div>
        <div className="part-card-body">
          <p className="part-card-category">
            {part.parentCategoryName ? `${part.parentCategoryName} / ${part.categoryName}` : part.categoryName}
          </p>
          <h3>{part.name}</h3>
          <p className="part-card-code">{part.oemCode ?? " "}</p>
          <p className="part-card-models">{part.models.map(modelShortName).join(" · ")}</p>
          <div className="part-card-footer">
            <strong className={price ? undefined : "part-card-price-none"}>{price ?? "ფასი შეთანხმებით"}</strong>
            <span className="part-card-more" aria-hidden="true">
              ნახვა →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
