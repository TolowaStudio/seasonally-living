import Link from "next/link";
import type { ReactNode } from "react";
import type { PortableBlock, PortableSpan } from "@/content/journal";

// Minimal portable-text renderer for the journal: paragraphs, h2/h3, quotes, bullet and numbered
// lists, and bold / italic / link marks. Anything else Sanity sends is rendered as a plain paragraph.

const SAFE_HREF = /^(\/(?!\/)[^\s]*|https:\/\/[^\s]+|tel:\+?[0-9]+)$/i;

function Span({ span, block }: { span: PortableSpan; block: PortableBlock }) {
  let node: ReactNode = span.text;
  for (const mark of span.marks ?? []) {
    if (mark === "strong") node = <strong>{node}</strong>;
    else if (mark === "em") node = <em>{node}</em>;
    else {
      const def = block.markDefs?.find((d) => d._key === mark);
      if (def && SAFE_HREF.test(def.href)) {
        node = def.href.startsWith("/") ? <Link href={def.href}>{node}</Link> : <a href={def.href} rel="noopener noreferrer">{node}</a>;
      }
    }
  }
  return <>{node}</>;
}

const Inline = ({ block }: { block: PortableBlock }) => (
  <>{block.children.map((c, i) => <Span key={c._key ?? i} span={c} block={block} />)}</>
);

export default function PortableBody({ blocks }: { blocks: PortableBlock[] }) {
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; ) {
    const b = blocks[i];
    if (b.listItem) {
      const kind = b.listItem;
      const items: PortableBlock[] = [];
      while (i < blocks.length && blocks[i].listItem === kind) items.push(blocks[i++]);
      const List = kind === "number" ? "ol" : "ul";
      out.push(<List key={b._key ?? `l${i}`}>{items.map((it, n) => <li key={it._key ?? n}><Inline block={it} /></li>)}</List>);
      continue;
    }
    const key = b._key ?? `b${i}`;
    if (b.style === "h2") out.push(<h2 key={key} className="h-md"><Inline block={b} /></h2>);
    else if (b.style === "h3") out.push(<h3 key={key}><Inline block={b} /></h3>);
    else if (b.style === "blockquote") out.push(<blockquote key={key}><Inline block={b} /></blockquote>);
    else out.push(<p key={key}><Inline block={b} /></p>);
    i++;
  }
  return <div className="jr-prose">{out}</div>;
}
