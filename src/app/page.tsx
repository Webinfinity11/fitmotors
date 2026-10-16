import Image from "next/image";
import { BackToTop } from "@/components/BackToTop";
import { Icon, IconSprite } from "@/components/Icons";
import { InquiryDialog } from "@/components/InquiryDialog";
import { Logo } from "@/components/Logo";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE } from "@/lib/site";

const SERVICES = [
  { icon: "search", title: "შერჩევა VIN-ით", text: "ნაწილების ზუსტი შერჩევა თქვენი ავტომობილის VIN კოდით.", inquiry: "vin" },
  { icon: "engine", title: "დიაგნოსტიკა", text: "დაგეხმარებით საჭირო დეტალების დადგენასა და ანალოგების შერჩევაში.", inquiry: "diagnostic" },
  { icon: "car", title: "ძარის დეტალები", text: "ორიგინალი და ხარისხიანი ანალოგები ძარის აღდგენისთვის.", inquiry: "body" },
  { icon: "suspension", title: "სავალი ნაწილი", text: "საკიდრის, სამუხრუჭე სისტემისა და საჭის დეტალები.", inquiry: "suspension" },
  { icon: "headset", title: "კონსულტაცია", text: "პროფესიონალური რჩევები Honda-ს სპეციალისტებისგან.", inquiry: "consultation" },
  { icon: "truck", title: "მიწოდება", text: "სწრაფი მიწოდება მთელ საქართველოში და მოსახერხებელი გატანა.", inquiry: "delivery" },
];

const TRUST = [
  { icon: "shield", title: "ორიგინალი", text: "და შემოწმებული ანალოგები სანდო მომწოდებლებისგან" },
  { icon: "users", title: "გამოცდილება", text: "Honda-ს მოდელებში 2011 წლიდან 2025 წლამდე" },
  { icon: "gear", title: "სრული მხარდაჭერა", text: "შერჩევიდან მიწოდებამდე" },
  { icon: "diamond", title: "პატიოსანი გადაწყვეტა", text: "და ინდივიდუალური მიდგომა ყველა კლიენტთან" },
];

const MODELS = [
  { key: "fit", name: "Honda FIT", img: "/images/fit.jpg", alt: "შავი Honda FIT", text: "საიმედო, ეკონომიური, იდეალური ქალაქისთვის." },
  { key: "hrv", name: "Honda HR-V", img: "/images/hrv.jpg", alt: "თეთრი Honda HR-V", text: "სტილური კროსოვერი აქტიური ცხოვრებისთვის." },
  { key: "vezel", name: "Honda VEZEL", img: "/images/vezel.jpg", alt: "თეთრი Honda VEZEL", text: "თანამედროვე კროსოვერი. კომფორტი ყველა დეტალში." },
];

const QUALITY = [
  { icon: "award", text: "Honda-ს ორიგინალი ნაწილები" },
  { icon: "gear", text: "ხარისხიანი ანალოგები" },
  { icon: "package", text: "მუდმივი მარაგი საწყობში" },
  { icon: "tools", text: "სერვისული მხარდაჭერა" },
  { icon: "file", text: "პროფესიონალური კონსულტაცია" },
];

const SOCIALS = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "whatsapp", label: "WhatsApp" },
] as const;

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        შინაარსზე გადასვლა
      </a>
      <IconSprite />
      <SiteHeader />

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-inner">
            <div className="hero-art">
              <Image src="/images/hero.jpg" alt="წითელი Honda FIT" width={1280} height={960} priority sizes="(max-width: 900px) 100vw, 65vw" />
            </div>
            <div className="container">
              <div className="hero-copy">
                <p className="eyebrow">საიმედოობა მოძრაობაში</p>
                <h1 id="hero-title">
                  <span className="line">ნაწილები და სერვისი</span>
                  <span className="line">
                    Honda <em>FIT, HR-V</em>
                  </span>
                  <span className="line">
                    და <em>VEZEL</em>
                  </span>
                </h1>
                <p className="hero-years">2011 – 2025 წლის მოდელები</p>
                <p className="hero-description">
                  ორიგინალი ნაწილები და ხარისხიანი ანალოგები. პროფესიონალური შერჩევა, კონსულტაცია და სერვისული მხარდაჭერა.
                </p>
                <div className="hero-actions">
                  <button className="btn" type="button" data-inquiry="consultation">
                    კონსულტაციის მიღება <Icon name="arrow" />
                  </button>
                  <a href="#services" className="btn btn--outline">
                    დაწვრილებით
                  </a>
                </div>
                <div className="hero-benefits">
                  <div className="hero-benefit">
                    <Icon name="shield" />
                    <span>საიმედო გადაწყვეტა</span>
                  </div>
                  <div className="hero-benefit">
                    <Icon name="users" />
                    <span>გამოცდილი სპეციალისტები</span>
                  </div>
                  <div className="hero-benefit">
                    <Icon name="gear" />
                    <span>მხარდაჭერა 2011–2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="services" id="services" aria-labelledby="services-title">
          <div className="container container--wide">
            <div className="section-heading--center">
              <h2 id="services-title">ჩვენი სერვისები</h2>
              <p className="section-lead">სრული სპექტრი თქვენი Honda-სთვის</p>
            </div>
            <div className="service-grid">
              {SERVICES.map((s) => (
                <article className="service-card" key={s.inquiry}>
                  <Icon name={s.icon} className="icon service-icon" />
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <button className="round-link" type="button" data-inquiry={s.inquiry} aria-label={s.title}>
                    <Icon name="arrow" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about" id="about" aria-labelledby="about-title">
          <Image className="workshop-photo" src="/images/workshop.jpg" alt="ხელოსანი Honda-ს ძრავს ემსახურება" width={1280} height={736} sizes="75vw" />
          <div className="container">
            <p className="eyebrow eyebrow--line">რატომ ჩვენ</p>
            <h2 id="about-title">
              უფრო მეტი, ვიდრე უბრალოდ ნაწილები.{" "}
              <br />
              ჩვენ ვზრუნავთ თქვენს Honda-ზე.
            </h2>
            <div className="trust-grid">
              {TRUST.map((t) => (
                <div className="trust-item" key={t.title}>
                  <Icon name={t.icon} />
                  <p>
                    <strong>{t.title}</strong>
                    <br />
                    {t.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="models" id="models" aria-labelledby="models-title">
          <div className="container">
            <div className="section-heading--row">
              <h2 id="models-title">ჩვენი მოდელები</h2>
              <p>ნაწილები და სერვისი 2011 – 2025 წლის მოდელებისთვის</p>
            </div>
            <div className="model-grid">
              {MODELS.map((m) => (
                <article className="model-card" key={m.key}>
                  <div className="model-scene">
                    <Image className="model-photo" src={m.img} alt={m.alt} width={900} height={676} sizes="(max-width: 600px) 100vw, 33vw" />
                    <div className="model-info">
                      <h3>{m.name}</h3>
                      <p className="model-years">2011 – 2025</p>
                      <p className="model-description">{m.text}</p>
                    </div>
                  </div>
                  <div className="model-action">
                    <button type="button" data-inquiry={m.key}>
                      ნაწილები და სერვისი <Icon name="arrow" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="advantages" id="advantages" aria-labelledby="quality-title">
          <div className="container quality-inner">
            <div className="quality-intro">
              <h2 id="quality-title">ორიგინალი და ხარისხიანი ნაწილები</h2>
              <p>
                გთავაზობთ Honda-ს ორიგინალ ნაწილებსა და შემოწმებულ ანალოგებს FIT, HR-V და VEZEL მოდელებისთვის. გარანტიას ვაძლევთ ხარისხს, სწორ შერჩევასა და
                პროფესიონალურ მხარდაჭერას ყველა ეტაპზე.
              </p>
            </div>
            <div className="quality-grid">
              {QUALITY.map((q) => (
                <div className="quality-item" key={q.text}>
                  <Icon name={q.icon} />
                  <p>{q.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-band" aria-labelledby="contact-band-title">
          <div className="container contact-inner">
            <div className="contact-copy">
              <h2 id="contact-band-title">გჭირდებათ დახმარება შერჩევაში?</h2>
              <p>ჩვენი სპეციალისტები დაგეხმარებიან თქვენი Honda-სთვის საჭირო ნაწილების შერჩევაში.</p>
            </div>
            <div className="contact-actions">
              <button type="button" className="btn" data-inquiry="consultation">
                <Icon name="phone" />
                კონსულტაციის მიღება
                <Icon name="arrow" />
              </button>
              <a className="contact-phone" href={`tel:${SITE.phone}`}>
                {SITE.phoneLabel}
              </a>
              <p>{SITE.hours}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contacts">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#home" aria-label="Honda Parts — გვერდის დასაწყისი">
              <Logo />
            </a>
            <p className="copyright">© 2026 Honda Parts. ყველა უფლება დაცულია.</p>
            <p className="photo-credits">
              ფოტოები: Wikimedia Commons — Tokumeigakarinoaoshima, Alexander Migl, Dinkun Chen (CC BY-SA 4.0), TTTNIS (CC0)
            </p>
          </div>
          <div className="footer-col">
            <h3>ნავიგაცია</h3>
            <nav className="footer-links" aria-label="ქვედა ნავიგაცია">
              <a href="#home">მთავარი</a>
              <a href="#about">ჩვენ შესახებ</a>
              <a href="#services">სერვისები</a>
              <a href="#models">მოდელები</a>
              <a href="#contacts">კონტაქტი</a>
            </nav>
          </div>
          <div className="footer-col social-col">
            <h3>სოციალური ქსელები</h3>
            <div className="socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.key}
                  className="social-link"
                  href={SITE.socials[s.key] || "#contacts"}
                  target={SITE.socials[s.key] ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                >
                  <Icon name={s.key} />
                </a>
              ))}
            </div>
          </div>
          <div className="footer-col footer-contacts">
            <h3>კონტაქტი</h3>
            <div className="footer-contact-list">
              <a href={`tel:${SITE.phone}`}>
                <Icon name="phone" />
                <span>{SITE.phoneLabel}</span>
              </a>
              <a href={`mailto:${SITE.email}`}>
                <Icon name="mail" />
                <span>{SITE.email}</span>
              </a>
              <p>
                <Icon name="pin" />
                <span>{SITE.address}</span>
              </p>
              <p>
                <Icon name="clock" />
                <span>{SITE.hours}</span>
              </p>
            </div>
          </div>
          <div className="footer-badge">
            <span className="footer-honda">
              <b>HONDA</b>
              <small>The Power of Dreams</small>
            </span>
            <p className="footer-tagline">ერთად მოძრაობაში</p>
          </div>
        </div>
      </footer>

      <BackToTop />
      <InquiryDialog />
    </>
  );
}
