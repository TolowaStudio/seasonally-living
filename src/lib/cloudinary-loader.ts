"use client";

// next/image loader: every image is a Cloudinary public ID in the tolowa-studio cloud
// (e.g. "seasonally-living/brand/calspas/swim-pro-garden"). Cloudinary handles format,
// quality and resizing, so Cloud Run never spends CPU on images.
export const CLOUDINARY_BASE = "https://res.cloudinary.com/tolowa-studio/image/upload";

export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (/^https?:\/\//.test(src)) return src;
  const q = quality ? `q_${quality}` : "q_auto";
  return `${CLOUDINARY_BASE}/f_auto,${q},c_limit,w_${width}/${src.replace(/^\//, "")}`;
}
