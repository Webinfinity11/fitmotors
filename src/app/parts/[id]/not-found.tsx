import Link from "next/link";

export default function PartNotFound() {
  return (
    <div className="parts-empty part-not-found">
      <h1>ნაწილი ვერ მოიძებნა</h1>
      <p>შესაძლოა ეს ნაწილი კატალოგიდან მოხსნილია.</p>
      <p>
        <Link href="/parts">ყველა ნაწილის ნახვა</Link>
      </p>
    </div>
  );
}
