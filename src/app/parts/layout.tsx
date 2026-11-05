import Script from "next/script";
import { chromeAfter, chromeBefore } from "@/lib/site-chrome";
import "./parts.css";

// ჰედერი და ფუტერი layout-შია, რომ კატალოგსა და ნაწილის გვერდს შორის გადასვლისას
// DOM არ შეიცვალოს: site.js მენიუს და სხვა ღილაკებს მხოლოდ ერთხელ, ჩატვირთვისას აბამს.
export default function PartsLayout({ children }: LayoutProps<"/parts">) {
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: chromeBefore }} />
      <main id="main" className="parts-page">
        <div className="container">{children}</div>
      </main>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: chromeAfter }} />
      <Script src="/site.js" strategy="afterInteractive" />
    </>
  );
}
