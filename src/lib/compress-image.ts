// ფოტოს ბრაუზერში ვაპატარავებთ და WEBP-ში ვაკონვერტებთ ატვირთვამდე.
const MAX_SIDE = 1600;
const QUALITY = 0.82;

export async function compressToWebp(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
    // ძველი ბრაუზერი WEBP-ს ვერ ქმნის და PNG-ს აბრუნებს. ასეთ დროს ორიგინალს ვტოვებთ.
    if (!blob || blob.type !== "image/webp") return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.webp`, { type: "image/webp" });
  } finally {
    bitmap.close();
  }
}
