import { readFileSync } from "node:fs";
import path from "node:path";

// ჰედერი და ფუტერი ერთ ადგილას, body.html-ში ინახება. შიდა გვერდები მათ იქიდან იღებენ.
const body = readFileSync(path.join(process.cwd(), "src/content/body.html"), "utf8");
const mainStart = body.indexOf('<main id="main">');
const mainEnd = body.indexOf("</main>");

// #about ტიპის ბმულები შიდა გვერდიდან მთავარზე უნდა მიდიოდეს. #main და SVG-ის <use> რჩება უცვლელი.
function linkSectionsToHome(html: string): string {
  return html.replace(/(<a\b[^>]*\shref=")#(?!main")/g, "$1/#");
}

export const chromeBefore = linkSectionsToHome(body.slice(0, mainStart))
  .replace('<a aria-current="location" class="active" href="/#home">', '<a href="/#home">')
  .replace('<a href="/parts">ნაწილები</a>', '<a aria-current="page" class="active" href="/parts">ნაწილები</a>');

export const chromeAfter = linkSectionsToHome(body.slice(mainEnd + "</main>".length));
