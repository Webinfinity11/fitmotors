import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { CAR_MODELS, formatPrice, modelShortName } from "@/lib/models";
import { PAGE_SIZE, parseFilters, queryCategoryTree, queryParts } from "@/lib/parts-query";
import { deletePart, setPartPublished, setPartStock } from "../../actions";
import { ActionForm, ConfirmSubmit, SubmitButton } from "../../_components/action-form";

export default function AdminPartsPage({ searchParams }: PageProps<"/admin/parts">) {
  return (
    <>
      <header className="admin-header">
        <h1>ნაწილები</h1>
        <Link className="admin-btn" href="/admin/parts/new">
          + ახალი ნაწილი
        </Link>
      </header>
      <Suspense fallback={<p className="admin-note">იტვირთება…</p>}>
        <PartsList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function PartsList({ searchParams }: Pick<PageProps<"/admin/parts">, "searchParams">) {
  await requireAdmin();
  const filters = parseFilters(await searchParams);
  const [{ rows, total }, tree] = await Promise.all([
    queryParts(filters, { onlyVisible: false }),
    queryCategoryTree({ onlyVisible: false }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.model) params.set("model", filters.model);
    if (filters.categoryId) params.set("category", String(filters.categoryId));
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `/admin/parts?${query}` : "/admin/parts";
  };

  return (
    <>
      <form className="admin-filters" action="/admin/parts">
        <input name="q" type="search" placeholder="ძიება სახელით ან კოდით" aria-label="ძიება" defaultValue={filters.q} />
        <select name="model" aria-label="მოდელი" defaultValue={filters.model ?? ""}>
          <option value="">ყველა მოდელი</option>
          {CAR_MODELS.map((model) => (
            <option key={model.slug} value={model.slug}>
              {model.name}
            </option>
          ))}
        </select>
        <select name="category" aria-label="კატეგორია" defaultValue={filters.categoryId ?? ""}>
          <option value="">ყველა კატეგორია</option>
          {tree.map((category) => [
            <option key={category.id} value={category.id}>
              {category.name}
            </option>,
            ...category.children.map((child) => (
              <option key={child.id} value={child.id}>
                {`- ${child.name}`}
              </option>
            )),
          ])}
        </select>
        <button type="submit" className="admin-btn admin-btn--ghost">
          ფილტრი
        </button>
      </form>

      {rows.length === 0 ? (
        <div className="admin-card admin-empty">
          <p>ნაწილი ვერ მოიძებნა.</p>
          {tree.length === 0 && (
            <p className="admin-note">
              დაიწყეთ <Link href="/admin/categories">კატეგორიების დამატებით</Link>.
            </p>
          )}
        </div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ნაწილი</th>
                <th>კატეგორია</th>
                <th>მოდელები</th>
                <th>ფასი</th>
                <th>მარაგი</th>
                <th>სტატუსი</th>
                <th aria-label="მოქმედებები" />
              </tr>
            </thead>
            <tbody>
              {rows.map((part) => (
                <tr key={part.id}>
                  <td>
                    <div className="admin-part-cell">
                      {part.imageUrl ? (
                        <Image src={part.imageUrl} alt="" width={48} height={48} className="admin-thumb" />
                      ) : (
                        <span className="admin-thumb admin-thumb--empty" />
                      )}
                      <div>
                        <Link href={`/admin/parts/${part.id}`} className="admin-part-name">
                          {part.name}
                        </Link>
                        {part.oemCode && <small>{part.oemCode}</small>}
                      </div>
                    </div>
                  </td>
                  <td>
                    {part.parentCategoryName ? (
                      <>
                        {part.parentCategoryName}
                        <small>{part.categoryName}</small>
                      </>
                    ) : (
                      part.categoryName
                    )}
                  </td>
                  <td>
                    <div className="admin-chips">
                      {part.models.map((slug) => (
                        <span key={slug} className="admin-chip">
                          {modelShortName(slug)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="admin-nowrap">{formatPrice(part.price) ?? "-"}</td>
                  <td>
                    <ActionForm action={setPartStock} className="admin-stock-form">
                      <input type="hidden" name="id" value={part.id} />
                      <input
                        key={part.stock}
                        name="stock"
                        type="number"
                        required
                        min={0}
                        max={999999}
                        step={1}
                        inputMode="numeric"
                        aria-label={`${part.name}: მარაგი`}
                        defaultValue={part.stock}
                        className="admin-stock-input"
                      />
                      <SubmitButton className="admin-btn admin-btn--ghost">შენახვა</SubmitButton>
                    </ActionForm>
                  </td>
                  <td>
                    {!part.isPublished ? (
                      <span className="admin-status">დამალულია</span>
                    ) : part.stock === 0 ? (
                      <span className="admin-status admin-status--out">მარაგი ამოიწურა</span>
                    ) : (
                      <span className="admin-status admin-status--on">საიტზეა</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <Link className="admin-btn admin-btn--ghost" href={`/admin/parts/${part.id}`}>
                        რედაქტირება
                      </Link>
                      <ActionForm action={setPartPublished}>
                        <input type="hidden" name="id" value={part.id} />
                        <input type="hidden" name="publish" value={part.isPublished ? "0" : "1"} />
                        <SubmitButton className="admin-btn admin-btn--ghost">
                          {part.isPublished ? "დამალვა" : "გამოჩენა"}
                        </SubmitButton>
                      </ActionForm>
                      <ActionForm action={deletePart}>
                        <input type="hidden" name="id" value={part.id} />
                        <ConfirmSubmit>წაშლა</ConfirmSubmit>
                      </ActionForm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav className="admin-pagination" aria-label="გვერდები">
          {filters.page > 1 && <Link href={pageHref(filters.page - 1)}>← წინა</Link>}
          <span>
            {filters.page} / {pages} · სულ {total}
          </span>
          {filters.page < pages && <Link href={pageHref(filters.page + 1)}>შემდეგი →</Link>}
        </nav>
      )}
    </>
  );
}
