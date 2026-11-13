"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Photo = { image: string; alt?: string };

/** Big photo-led gallery with thumbnails and a full-screen lightbox (native <dialog>: Esc closes, focus is trapped). */
export default function PreOwnedPhotos({ photos, title }: { photos: Photo[]; title: string }) {
  const [i, setI] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const n = photos.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.open) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!n) return null;
  const cur = photos[i] ?? photos[0];
  const alt = cur.alt || `${title}, photo ${i + 1}`;

  return (
    <div>
      <button type="button" className="photo po-main" style={{ aspectRatio: "4 / 3" }} onClick={() => dialog.current?.showModal()} aria-label={`Open photo ${i + 1} of ${n} full screen`}>
        <Image src={cur.image} alt={alt} fill loading="eager" fetchPriority="high" sizes="(max-width: 940px) 100vw, 60vw" />
        <span className="po-zoom" aria-hidden>Full screen</span>
      </button>
      {n > 1 && (
        <div className="po-thumbs">
          {photos.map((p, k) => (
            <button key={p.image + k} type="button" className={`po-thumb${k === i ? " sel" : ""}`} onClick={() => setI(k)} aria-label={`Show photo ${k + 1}`} aria-pressed={k === i}>
              <Image src={p.image} alt="" fill sizes="120px" />
            </button>
          ))}
        </div>
      )}

      <dialog ref={dialog} className="po-lightbox" aria-label={`${title} photos`} onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className="po-lb-stage" onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
          <Image src={cur.image} alt={alt} fill sizes="100vw" quality={85} />
          <button type="button" className="po-lb-btn po-lb-close" onClick={() => dialog.current?.close()} aria-label="Close">&times;</button>
          {n > 1 && (
            <>
              <button type="button" className="po-lb-btn po-lb-prev" onClick={() => go(-1)} aria-label="Previous photo">&lsaquo;</button>
              <button type="button" className="po-lb-btn po-lb-next" onClick={() => go(1)} aria-label="Next photo">&rsaquo;</button>
              <span className="po-lb-count" aria-live="polite">{i + 1} / {n}</span>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
