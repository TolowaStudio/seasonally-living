import Link from "next/link";
import Icon from "./Icon";
import { site } from "@/lib/site";

export default function CtaBand({
  title = "Come sit by the fire. Or in the water.",
  body = "The showroom is the fastest way to decide. Book a visit and we'll have the right models running when you arrive.",
  cta = "Book a visit",
  href = "/visit#book",
}: {
  title?: string;
  body?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <section className="section-sm bg-bone">
      <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 640 }}>
          <h2 className="h-lg">{title}</h2>
          <p className="body-muted" style={{ marginTop: 12 }}>{body}</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={href} className="btn btn-primary btn-lg">
            {cta} <Icon name="arrow" size={18} />
          </Link>
          <a href={`tel:${site.phoneTel}`} className="btn btn-outline btn-lg">
            <Icon name="phone" size={18} /> {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
