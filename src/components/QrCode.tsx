import qrcode from "qrcode-generator";

/**
 * A QR code drawn as one inline SVG path, generated locally (no third-party image service, nothing leaves the server).
 * Error correction "Q" (25%) so a printed, slightly scuffed card still scans.
 */
export default function QrCode({ value, label, className }: { value: string; label: string; className?: string }) {
  const qr = qrcode(0, "Q"); // type 0 = smallest version that fits
  qr.addData(value);
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 4; // quiet zone, in modules (the QR spec asks for 4)
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d += `M${c + quiet} ${r + quiet}h1v1h-1z`;
    }
  }
  const size = n + quiet * 2;
  return (
    <svg className={className} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="#fff" />
      <path d={d} fill="#000" />
    </svg>
  );
}
