import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDb } from "@/db";
import { parts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { queryCategoryTree } from "@/lib/parts-query";
import { PartForm } from "../../../_components/part-form";

export default function EditPartPage({ params }: PageProps<"/admin/parts/[id]">) {
  return (
    <>
      <header className="admin-header">
        <h1>ნაწილის რედაქტირება</h1>
      </header>
      <Suspense fallback={<p className="admin-note">იტვირთება…</p>}>
        <EditPartForm params={params} />
      </Suspense>
    </>
  );
}

async function EditPartForm({ params }: Pick<PageProps<"/admin/parts/[id]">, "params">) {
  await requireAdmin();
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) notFound();

  const [[part], tree] = await Promise.all([
    getDb().select().from(parts).where(eq(parts.id, Number(id))),
    queryCategoryTree({ onlyVisible: false }),
  ]);
  if (!part) notFound();

  // ბაზაში ინახება ყველაზე ზუსტი დონე, ფორმას კი ცალ-ცალკე სჭირდება კატეგორია და ქვეკატეგორია.
  const parent = tree.find((category) => category.children.some((child) => child.id === part.categoryId));

  return (
    <PartForm
      categories={tree}
      part={{
        id: part.id,
        name: part.name,
        oemCode: part.oemCode,
        description: part.description,
        price: part.price,
        imageUrl: part.imageUrl,
        categoryId: parent?.id ?? part.categoryId,
        subcategoryId: parent ? part.categoryId : null,
        models: part.models,
        stock: part.stock,
        isPublished: part.isPublished,
      }}
    />
  );
}
