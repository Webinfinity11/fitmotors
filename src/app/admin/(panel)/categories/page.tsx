import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { queryCategoryTree } from "@/lib/parts-query";
import { createCategory, deleteCategory, updateCategory } from "../../actions";
import { ActionForm, ConfirmSubmit, SubmitButton } from "../../_components/action-form";

export default function CategoriesPage() {
  return (
    <>
      <header className="admin-header">
        <h1>კატეგორიები</h1>
      </header>
      <Suspense fallback={<p className="admin-note">იტვირთება…</p>}>
        <CategoryManager />
      </Suspense>
    </>
  );
}

async function CategoryManager() {
  await requireAdmin();
  const tree = await queryCategoryTree({ onlyPublished: false });

  return (
    <>
      <section className="admin-card">
        <h2>ახალი კატეგორია</h2>
        <AddForm placeholder="მაგ.: ძარა" />
      </section>

      {tree.length === 0 && <p className="admin-note">კატეგორიები ჯერ არ არის.</p>}

      {tree.map((category) => (
        <section key={category.id} className="admin-card admin-category">
          <CategoryRow id={category.id} name={category.name} sortOrder={category.sortOrder} count={category.count} />
          <div className="admin-subcategories">
            {category.children.map((child) => (
              <CategoryRow key={child.id} id={child.id} name={child.name} sortOrder={child.sortOrder} count={child.count} />
            ))}
            <AddForm parentId={category.id} placeholder={`ახალი ქვეკატეგორია: ${category.name}`} />
          </div>
        </section>
      ))}
    </>
  );
}

function AddForm({ parentId, placeholder }: { parentId?: number; placeholder: string }) {
  return (
    <ActionForm action={createCategory} className="admin-inline-form" resetOnSuccess>
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <input name="name" required maxLength={120} placeholder={placeholder} aria-label="დასახელება" />
      <SubmitButton className="admin-btn admin-btn--ghost">დამატება</SubmitButton>
    </ActionForm>
  );
}

function CategoryRow({ id, name, sortOrder, count }: { id: number; name: string; sortOrder: number; count: number }) {
  return (
    <div className="admin-category-row">
      {/* key ახლდება შენახვის შემდეგ, რომ ველებში ბაზის მნიშვნელობა ჩანდეს */}
      <ActionForm key={`${name}:${sortOrder}`} action={updateCategory} className="admin-inline-form">
        <input type="hidden" name="id" value={id} />
        <input name="name" required maxLength={120} defaultValue={name} aria-label="დასახელება" />
        <input
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={sortOrder}
          aria-label="რიგითობა"
          title="რიგითობა: ნაკლები რიცხვი პირველი ჩანს"
          className="admin-sort"
        />
        <SubmitButton className="admin-btn admin-btn--ghost">შენახვა</SubmitButton>
      </ActionForm>
      <span className="admin-count">{count} ნაწილი</span>
      <ActionForm action={deleteCategory}>
        <input type="hidden" name="id" value={id} />
        <ConfirmSubmit>წაშლა</ConfirmSubmit>
      </ActionForm>
    </div>
  );
}
