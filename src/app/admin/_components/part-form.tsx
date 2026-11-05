"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CAR_MODELS, CAR_MODEL_SLUGS, type CarModelSlug } from "@/lib/models";
import { savePart } from "../actions";
import { ActionForm, SubmitButton } from "./action-form";

export type CategoryOption = {
  id: number;
  name: string;
  children: { id: number; name: string }[];
};

export type PartFormValues = {
  id: number;
  name: string;
  oemCode: string | null;
  description: string | null;
  price: string | null;
  imageUrl: string | null;
  categoryId: number;
  subcategoryId: number | null;
  models: CarModelSlug[];
  isPublished: boolean;
};

export function PartForm({ categories, part }: { categories: CategoryOption[]; part?: PartFormValues }) {
  const [categoryId, setCategoryId] = useState(part ? String(part.categoryId) : "");
  const [subcategoryId, setSubcategoryId] = useState(part?.subcategoryId ? String(part.subcategoryId) : "");
  const [models, setModels] = useState<CarModelSlug[]>(part?.models ?? []);
  const [imageUrl, setImageUrl] = useState(part?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const subcategories = categories.find((c) => String(c.id) === categoryId)?.children ?? [];
  const allSelected = models.length === CAR_MODEL_SLUGS.length;

  function toggleModel(slug: CarModelSlug) {
    setModels((current) => (current.includes(slug) ? current.filter((m) => m !== slug) : [...current, slug]));
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const blob = await upload(`parts/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      setImageUrl(blob.url);
    } catch {
      setUploadError("ფოტო ვერ აიტვირთა. გამოიყენეთ JPG, PNG ან WEBP ფაილი, მაქსიმუმ 8 MB.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <ActionForm action={savePart} className="admin-form">
      {part && <input type="hidden" name="id" value={part.id} />}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <section className="admin-card admin-fields">
        <label className="admin-field admin-field--full">
          <span>დასახელება *</span>
          <input name="name" required maxLength={200} defaultValue={part?.name} />
        </label>
        <label className="admin-field">
          <span>OEM / ნაწილის კოდი</span>
          <input name="oemCode" maxLength={80} defaultValue={part?.oemCode ?? ""} />
        </label>
        <label className="admin-field">
          <span>ფასი (₾)</span>
          <input
            name="price"
            inputMode="decimal"
            placeholder="ცარიელი = ფასი შეთანხმებით"
            defaultValue={part?.price ?? ""}
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>აღწერა</span>
          <textarea name="description" rows={4} maxLength={5000} defaultValue={part?.description ?? ""} />
        </label>
      </section>

      <section className="admin-card">
        <h2>რომელი მანქანისთვისაა? *</h2>
        <div className="admin-models">
          {CAR_MODELS.map((model) => (
            <label key={model.slug} className="admin-check admin-check--box">
              <input
                type="checkbox"
                name="models"
                value={model.slug}
                checked={models.includes(model.slug)}
                onChange={() => toggleModel(model.slug)}
              />
              <span>{model.name}</span>
            </label>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => setModels(allSelected ? [] : [...CAR_MODEL_SLUGS])}
          >
            {allSelected ? "მონიშვნის მოხსნა" : "სამივე მოდელი"}
          </button>
        </div>
      </section>

      <section className="admin-card admin-fields">
        <label className="admin-field">
          <span>კატეგორია *</span>
          <select
            name="categoryId"
            required
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setSubcategoryId("");
            }}
          >
            <option value="">აირჩიეთ კატეგორია</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span>ქვეკატეგორია</span>
          <select
            name="subcategoryId"
            value={subcategoryId}
            disabled={subcategories.length === 0}
            onChange={(event) => setSubcategoryId(event.target.value)}
          >
            <option value="">{subcategories.length ? "ქვეკატეგორიის გარეშე" : "ქვეკატეგორია არ არის"}</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </label>
        {categories.length === 0 && (
          <p className="admin-note admin-field--full">
            ჯერ <Link href="/admin/categories">დაამატეთ კატეგორია</Link>.
          </p>
        )}
      </section>

      <section className="admin-card">
        <h2>ფოტო</h2>
        <div className="admin-image-field">
          {imageUrl ? (
            <Image src={imageUrl} alt="" width={160} height={120} className="admin-image-preview" />
          ) : (
            <div className="admin-image-preview admin-image-preview--empty">ფოტო არ არის</div>
          )}
          <div className="admin-image-actions">
            <input
              type="file"
              aria-label="ფოტოს არჩევა"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={uploading}
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            {uploading && <p className="admin-note">იტვირთება…</p>}
            {uploadError && (
              <p className="admin-error" role="alert">
                {uploadError}
              </p>
            )}
            {imageUrl && (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setImageUrl("")}>
                ფოტოს მოხსნა
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="admin-card admin-toggles">
        <label className="admin-check">
          <input type="checkbox" name="isPublished" defaultChecked={part?.isPublished ?? true} />
          <span>გამოჩნდეს საიტზე</span>
        </label>
      </section>

      <div className="admin-form-actions">
        <SubmitButton disabled={uploading}>{part ? "ცვლილებების შენახვა" : "ნაწილის დამატება"}</SubmitButton>
        <Link className="admin-btn admin-btn--ghost" href="/admin/parts">
          გაუქმება
        </Link>
      </div>
    </ActionForm>
  );
}
