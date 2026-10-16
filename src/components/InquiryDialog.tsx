"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { INQUIRY_CONTEXTS, MODEL_VALUES, SITE } from "@/lib/site";
import { Icon } from "./Icons";
import { Logo } from "./Logo";

const YEARS = Array.from({ length: 15 }, (_, i) => String(2025 - i));

// ერთი დიალოგი მთელი გვერდისთვის: ნებისმიერი [data-inquiry] ღილაკი ხსნის მას.
export function InquiryDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const vinRef = useRef<HTMLInputElement>(null);
  const resultTitleRef = useRef<HTMLHeadingElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const [key, setKey] = useState("consultation");
  const [model, setModel] = useState("");
  const [requestText, setRequestText] = useState("");
  const [toast, setToast] = useState("");

  const [title, description] = INQUIRY_CONTEXTS[key] ?? INQUIRY_CONTEXTS.consultation;
  const showVin = key === "vin" || Boolean(MODEL_VALUES[key]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement).closest<HTMLElement>("[data-inquiry]");
      if (!trigger) return;
      const k = trigger.dataset.inquiry ?? "consultation";
      lastTrigger.current = trigger;
      formRef.current?.reset();
      setKey(k);
      setModel(MODEL_VALUES[k] ?? "");
      setRequestText("");
      dialogRef.current?.showModal();
      document.body.classList.add("dialog-open");
      window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 30);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 4500);
    return () => window.clearTimeout(t);
  }, [toast]);

  function onClose() {
    document.body.classList.remove("dialog-open");
    lastTrigger.current?.focus({ preventScroll: true });
  }

  function onBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target !== dialogRef.current) return;
    const box = dialogRef.current.getBoundingClientRect();
    if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) {
      dialogRef.current.close();
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const phoneInput = phoneRef.current!;
    const vinInput = vinRef.current;
    const phone = phoneInput.value.trim();
    const digits = phone.replace(/\D/g, "").length;
    if (digits < 7 || digits > 15) {
      phoneInput.setCustomValidity("შეიყვანეთ ტელეფონის ნომერი: 7-დან 15 ციფრამდე.");
      phoneInput.reportValidity();
      return;
    }
    if (showVin && vinInput?.value && vinInput.value.length !== 17) {
      vinInput.setCustomValidity("VIN უნდა შედგებოდეს 17 სიმბოლოსგან. ძარის ნომერი შეგიძლიათ კომენტარში მიუთითოთ.");
      vinInput.reportValidity();
      return;
    }
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const lines = [
      "განაცხადი საიტიდან — Honda Parts",
      "",
      "თემა: " + title,
      "სახელი: " + String(values.get("name")).trim(),
      "ტელეფონი: " + phone,
      "მოდელი: " + (values.get("model") || "არ არის მითითებული"),
      "გამოშვების წელი: " + (values.get("year") || "არ არის მითითებული"),
    ];
    if (showVin && values.get("vin")) lines.push("VIN: " + values.get("vin"));
    const message = String(values.get("message") || "").trim();
    if (message) lines.push("", "კომენტარი: " + message);
    setRequestText(lines.join("\n"));
    window.setTimeout(() => resultTitleRef.current?.focus({ preventScroll: true }), 0);
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(requestText);
      setToast("განაცხადის ტექსტი დაკოპირდა.");
    } catch {
      setToast("ავტომატურად ვერ დაკოპირდა. მონიშნეთ და დააკოპირეთ ტექსტი ხელით.");
    }
  }

  const mailto =
    `mailto:${SITE.email}?subject=` +
    encodeURIComponent(`${title} — Honda Parts`) +
    "&body=" +
    encodeURIComponent(requestText);

  return (
    <>
      <dialog
        ref={dialogRef}
        className="inquiry-dialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onClose={onClose}
        onClick={onBackdropClick}
      >
        <div className="dialog-content">
          <div className="dialog-topline">
            <Logo />
            <button className="dialog-close" type="button" aria-label="ფორმის დახურვა" onClick={() => dialogRef.current?.close()}>
              <Icon name="close" />
            </button>
          </div>
          <h2 id="dialog-title">{title}</h2>
          <p className="dialog-description" id="dialog-description">
            {description}
          </p>

          <form ref={formRef} className="inquiry-form" onSubmit={onSubmit} hidden={Boolean(requestText)}>
            <div className="form-grid">
              <label className="form-field form-field--mobile-full">
                <span>თქვენი სახელი *</span>
                <input ref={nameRef} name="name" type="text" placeholder="როგორ მოგმართოთ" required autoComplete="name" maxLength={80} />
              </label>
              <label className="form-field form-field--mobile-full">
                <span>ტელეფონი *</span>
                <input
                  ref={phoneRef}
                  name="phone"
                  type="tel"
                  placeholder="+995 5__ __ __ __"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={30}
                  onInput={(e) => e.currentTarget.setCustomValidity("")}
                />
              </label>
              <label className="form-field">
                <span>Honda-ს მოდელი</span>
                <select name="model" value={model} onChange={(e) => setModel(e.target.value)}>
                  <option value="">აირჩიეთ მოდელი</option>
                  <option>Honda FIT</option>
                  <option>Honda HR-V</option>
                  <option>Honda VEZEL</option>
                  <option>სხვა Honda</option>
                </select>
              </label>
              <label className="form-field">
                <span>გამოშვების წელი</span>
                <select name="year" defaultValue="">
                  <option value="">აირჩიეთ წელი</option>
                  {YEARS.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </label>
              {showVin && (
                <label className="form-field form-field--full">
                  <span>
                    VIN <small>— არასავალდებულო, 17 სიმბოლო</small>
                  </span>
                  <input
                    ref={vinRef}
                    name="vin"
                    type="text"
                    placeholder="ავტომობილის VIN კოდი"
                    maxLength={17}
                    autoComplete="off"
                    spellCheck={false}
                    autoCapitalize="characters"
                    onInput={(e) => {
                      const el = e.currentTarget;
                      el.value = el.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "").slice(0, 17);
                      el.setCustomValidity("");
                    }}
                  />
                </label>
              )}
              <label className="form-field form-field--full">
                <span>
                  რა გჭირდებათ? <small>— არასავალდებულო</small>
                </span>
                <textarea name="message" placeholder="დეტალის დასახელება, ძარის ნომერი, სიმპტომები ან თქვენი კითხვა" maxLength={1200} rows={3} />
              </label>
            </div>
            <button className="btn" type="submit">
              განაცხადის მომზადება <Icon name="arrow" />
            </button>
            <p className="form-note">ფორმა მოამზადებს განაცხადის ტექსტს — შეგიძლიათ გაგზავნოთ ელფოსტით ან დააკოპიროთ.</p>
          </form>

          {requestText && (
            <div className="result-panel">
              <div className="result-icon">
                <Icon name="check" />
              </div>
              <h3 ref={resultTitleRef} tabIndex={-1}>
                განაცხადი მომზადებულია
              </h3>
              <p>განაცხადი ჯერ არ გაგზავნილა. გახსენით წერილი ელფოსტის აპლიკაციაში და დააჭირეთ „გაგზავნას“, ან დააკოპირეთ ტექსტი.</p>
              <pre className="result-preview">{requestText}</pre>
              <div className="result-actions">
                <a className="btn" href={mailto}>
                  <Icon name="mail" />
                  წერილის გახსნა
                </a>
                <button className="btn btn--outline" type="button" onClick={copyRequest}>
                  <Icon name="copy" />
                  კოპირება
                </button>
                <button className="btn btn--text" type="button" onClick={() => setRequestText("")}>
                  შეცვლა
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
      <div className={`toast${toast ? " visible" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
