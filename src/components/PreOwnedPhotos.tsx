"use client";

import Image from "next/image";
import { useState } from "react";

export default function PreOwnedPhotos({ photos, title }: { photos: { image: string; alt?: string }[]; title: string }) {
  const [i, setI] = useState(0);
  if (!photos.length) return null;
  const cur = photos[i] ?? photos[0];
  return (
    <div>
      <div className="photo" style={{ aspectRatio: "4 / 3" }}>
        <Image src={cur.image} alt={cur.alt || title} fill priority sizes="(max-width: 940px) 100vw, 55vw" />
      </div>
      {photos.length > 1 && (
        <div className="po-thumbs">
          {photos.map((p, n) => (
            <button key={p.image + n} type="button" className={`po-thumb${n === i ? " sel" : ""}`} onClick={() => setI(n)} aria-label={`Show photo ${n + 1}`} aria-pressed={n === i}>
              <Image src={p.image} alt="" fill sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
