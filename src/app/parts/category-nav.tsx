"use client";

import Link from "next/link";
import { useState } from "react";

type CategoryItem = { id: number; name: string; count: number; href: string };
export type CategoryGroupItem = CategoryItem & { children: CategoryItem[] };

export function CategoryNav({
  allHref,
  activeId,
  categories,
}: {
  allHref: string;
  activeId?: number;
  categories: CategoryGroupItem[];
}) {
  const hasToggles = categories.some((category) => category.children.length > 0);
  return (
    <nav aria-label="კატეგორიები" className={hasToggles ? "category-nav has-toggles" : "category-nav"}>
      <Link href={allHref} aria-current={activeId ? undefined : "true"}>
        ყველა ნაწილი
      </Link>
      {categories.map((category) => (
        <CategoryGroup key={category.id} category={category} activeId={activeId} />
      ))}
    </nav>
  );
}

function CategoryGroup({ category, activeId }: { category: CategoryGroupItem; activeId?: number }) {
  // არჩეული კატეგორია თავისით იშლება, სანამ მომხმარებელი ისარს თავად არ შეცვლის.
  const [toggled, setToggled] = useState<boolean | null>(null);
  const containsActive = category.id === activeId || category.children.some((child) => child.id === activeId);
  const open = toggled ?? containsActive;
  const panelId = `category-children-${category.id}`;

  return (
    <div className="category-group">
      <div className="category-row">
        <Link href={category.href} aria-current={category.id === activeId ? "true" : undefined}>
          {category.name} <span>{category.count}</span>
        </Link>
        {category.children.length > 0 && (
          <button
            type="button"
            className="category-toggle"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${category.name}: ქვეკატეგორიების ${open ? "დახურვა" : "გახსნა"}`}
            onClick={() => setToggled(!open)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}
      </div>
      {category.children.length > 0 && (
        <div id={panelId} className={open ? "category-children is-open" : "category-children"} inert={!open}>
          <div>
            {category.children.map((child) => (
              <Link
                key={child.id}
                className="parts-subcategory"
                href={child.href}
                aria-current={child.id === activeId ? "true" : undefined}
              >
                {child.name} <span>{child.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
