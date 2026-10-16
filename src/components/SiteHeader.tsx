"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { Icon } from "./Icons";
import { Logo } from "./Logo";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 901px)");
    const onMq = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive("#" + entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    document.querySelectorAll("section[id],footer[id]").forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      observer.disconnect();
    };
  }, []);

  return (
    <header ref={headerRef} className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#home" className="brand" aria-label="Honda Parts — მთავარი">
          <Logo />
        </a>
        <nav className="desktop-nav" aria-label="მთავარი ნავიგაცია">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={active === item.href ? "active" : undefined}
              aria-current={active === item.href ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-phone" href={`tel:${SITE.phone}`} aria-label="დარეკვა">
          <Icon name="phone" />
          <div>
            <strong>{SITE.phoneLabel}</strong>
            <span>{SITE.hours}</span>
          </div>
        </a>
        <button className="btn header-cta" type="button" data-inquiry="consultation">
          განაცხადის გაგზავნა
        </button>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "მენიუს დახურვა" : "მენიუს გახსნა"}
          aria-controls="mobile-nav"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      <nav className="mobile-nav" id="mobile-nav" aria-label="მობილური ნავიგაცია" hidden={!open}>
        {NAV.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <button className="btn" type="button" data-inquiry="consultation" onClick={() => setOpen(false)}>
          განაცხადის გაგზავნა <Icon name="arrow" />
        </button>
      </nav>
    </header>
  );
}
