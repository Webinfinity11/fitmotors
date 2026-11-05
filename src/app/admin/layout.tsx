import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "ადმინ პანელი - FIT MOTORS",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
