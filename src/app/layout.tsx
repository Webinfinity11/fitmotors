import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-georgian",
  subsets: ["georgian", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Honda Parts — ნაწილები და სერვისი Honda FIT, HR-V და VEZEL-ისთვის",
  description: "Honda FIT, HR-V და VEZEL-ის (2011–2025) ორიგინალი ნაწილები და სერვისი. შერჩევა VIN-ით, ძარის დეტალები, სავალი ნაწილი და კონსულტაცია.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ka" className={`${notoGeorgian.variable}`}>
      <body>{children}</body>
    </html>
  );
}
