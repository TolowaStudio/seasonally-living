import Image from "next/image";

/** Showroom page hero (comp C): type on the left, the photograph on the right. Text always sits on a pale ground, so it never depends on a scrim. */
export default function PageHero({
  kicker,
  title,
  lead,
  image,
  alt,
  children,
  position = "center",
  caption,
}: {
  kicker: string;
  title: React.ReactNode;
  lead?: string;
  image: string;
  alt: string;
  children?: React.ReactNode;
  position?: string;
  caption?: string;
}) {
  return (
    <section className="sh-hero">
      <div className="sh-hero-t">
        <span className="kicker">{kicker}</span>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children && <div className="sh-hero-actions">{children}</div>}
      </div>
      <div className="sh-hero-p">
        <Image src={image} alt={alt} fill loading="eager" fetchPriority="high" sizes="(max-width: 1000px) 100vw, 58vw" style={{ objectFit: "cover", objectPosition: position }} />
        {caption && <span className="sh-cap">{caption}</span>}
      </div>
    </section>
  );
}
