export default function SectionHead({
  kicker,
  title,
  lead,
  center,
}: {
  kicker: string;
  title: React.ReactNode;
  lead?: string;
  center?: boolean;
}) {
  return (
    <div style={{ textAlign: center ? "center" : "left", maxWidth: center ? 760 : 820, margin: center ? "0 auto" : undefined }}>
      <span className={`kicker${center ? " center" : ""}`}>{kicker}</span>
      <h2 className="h-xl" style={{ marginTop: 18 }}>{title}</h2>
      {lead && (
        <p className="lead" style={{ marginTop: 18, marginLeft: center ? "auto" : undefined, marginRight: center ? "auto" : undefined }}>
          {lead}
        </p>
      )}
    </div>
  );
}
