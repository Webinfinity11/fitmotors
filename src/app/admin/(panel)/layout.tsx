import Link from "next/link";
import { logout } from "../actions";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-logo">
          <span>FIT</span> MOTORS
        </p>
        <nav aria-label="ადმინ ნავიგაცია" className="admin-nav">
          <Link href="/admin/parts">ნაწილები</Link>
          <Link href="/admin/parts/new">ახალი ნაწილი</Link>
          <Link href="/admin/categories">კატეგორიები</Link>
          <a href="/parts" target="_blank" rel="noreferrer">
            საიტზე ნახვა ↗
          </a>
        </nav>
        <form action={logout}>
          <button type="submit" className="admin-logout">
            გამოსვლა
          </button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
