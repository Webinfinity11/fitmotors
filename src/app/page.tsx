import { readFileSync } from "node:fs";
import path from "node:path";
import Script from "next/script";

// დიზაინის HTML ერთი ერთში (Honda-Parts-GE.html). მარკაპი: src/content/body.html, ლოგიკა: public/site.js.
export default function Home() {
  const body = readFileSync(path.join(process.cwd(), "src/content/body.html"), "utf8");
  return (
    <>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: body }} />
      <Script src="/site.js" strategy="afterInteractive" />
    </>
  );
}
