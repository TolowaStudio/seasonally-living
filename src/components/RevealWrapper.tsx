"use client";

import React, { useEffect, useRef, ReactNode } from "react";

interface RevealWrapperProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function RevealWrapper({
  children,
  className = "",
  style,
  delay = 0,
  as: Tag = "div",
}: RevealWrapperProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      el.classList.add("in");
      return;
    }

    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay) {
              setTimeout(() => el.classList.add("in"), delay);
            } else {
              el.classList.add("in");
            }
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  const ElementTag = Tag as React.ElementType;

  return (
    <ElementTag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${className}`}
      style={style}
    >
      {children}
    </ElementTag>
  );
}
