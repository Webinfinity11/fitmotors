import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Honda Parts — ავტონაწილები და სერვისი Honda FIT, HR-V და VEZEL-ისთვის",
  description:
    "ავტონაწილები და სერვისი Honda FIT, HR-V და VEZEL-ისთვის, 2011–2025 წლების მოდელები. VIN-ით შერჩევა, ძარისა და სავალი ნაწილის დეტალები, კონსულტაცია.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23ec0016'/%3E%3Ctext x='32' y='48' font-family='Arial' font-weight='900' font-size='46' text-anchor='middle' fill='white'%3EH%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#ec0016",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ka">
      <head>
        <link rel="preload" href="/fonts/FiraGO-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/FiraGO-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
