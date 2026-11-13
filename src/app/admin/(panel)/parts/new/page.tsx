import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { queryCategoryTree } from "@/lib/parts-query";
import { PartForm } from "../../../_components/part-form";

export default function NewPartPage() {
  return (
    <>
      <header className="admin-header">
        <h1>ახალი ნაწილი</h1>
      </header>
      <Suspense fallback={<p className="admin-note">იტვირთება…</p>}>
        <NewPartForm />
      </Suspense>
    </>
  );
}

async function NewPartForm() {
  await requireAdmin();
  const tree = await queryCategoryTree({ onlyVisible: false });
  return <PartForm categories={tree} />;
}
