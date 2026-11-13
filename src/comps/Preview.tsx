"use client";

import { useEffect, useRef, useState } from "react";

/** A live, non-interactive miniature of a comp page. Scales a 1280px-wide iframe to the card width. */
export default function Preview({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / 1280);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="cmp-idx-frame" style={{ ["--s" as string]: scale }}>
      <iframe src={src} title={title} loading="lazy" tabIndex={-1} aria-hidden="true" />
    </div>
  );
}
