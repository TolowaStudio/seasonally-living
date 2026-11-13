import Image from "next/image";

export default function PageHero({
  kicker,
  title,
  lead,
  image,
  alt,
  children,
  position = "center",
}: {
  kicker: string;
  title: React.ReactNode;
  lead?: string;
  image: string;
  alt: string;
  children?: React.ReactNode;
  position?: string;
}) {
  return (
    <section style={{ position: "relative", minHeight: "78vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
      <Image src={image} alt={alt} fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: position }} />
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(100deg, rgba(8,7,5,0.88) 0%, rgba(8,7,5,0.55) 34%, rgba(8,7,5,0.1) 70%), linear-gradient(to bottom, rgba(8,7,5,0.55) 0%, rgba(8,7,5,0) 26%, rgba(8,7,5,0.75) 100%)",
        }}
      />
      <div className="wrap" style={{ position: "relative", width: "100%", paddingTop: "calc(var(--nav-h) + 60px)", paddingBottom: "clamp(52px, 9vh, 96px)" }}>
        <span className="kicker" style={{ color: "var(--clay-soft)" }}>{kicker}</span>
        <h1 className="display" style={{ color: "#fff", marginTop: 20, maxWidth: "16ch", textShadow: "0 2px 26px rgba(0,0,0,0.5)" }}>
          {title}
        </h1>
        {lead && (
          <p className="lead" style={{ marginTop: 22, color: "rgba(247,242,234,0.9)", maxWidth: "50ch" }}>
            {lead}
          </p>
        )}
        {children && <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>{children}</div>}
      </div>
    </section>
  );
}
