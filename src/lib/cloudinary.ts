// Server-safe Cloudinary constants. Kept out of cloudinary-loader.ts, which is "use client": a server
// component that imports a value from a client module gets a client reference, not the string
// (that made /pre-owned/[slug] print a function body into og:image and the JSON-LD image URLs).
export const CLOUDINARY_BASE = "https://res.cloudinary.com/tolowa-studio/image/upload";
