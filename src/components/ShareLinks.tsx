"use client";

import { useState } from "react";

/** Share this spa: copy link, text, email, Facebook. These only open the visitor's own apps; nothing is posted by us. */
export default function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const text = `${title} at Seasonally Living`;
  const enc = encodeURIComponent;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <div className="po-share" role="group" aria-label="Share this spa">
      <span className="field-label" style={{ marginRight: 4 }}>Share</span>
      <button type="button" className="btn btn-outline" onClick={copy}>{copied ? "Link copied" : "Copy link"}</button>
      <a className="btn btn-outline" href={`sms:?&body=${enc(`${text} ${url}`)}`}>Text</a>
      <a className="btn btn-outline" href={`mailto:?subject=${enc(text)}&body=${enc(`${text}\n${url}`)}`}>Email</a>
      <a className="btn btn-outline" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
    </div>
  );
}
