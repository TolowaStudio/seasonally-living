import Link from "next/link";
import Preview from "@/comps/Preview";
import { COMPS, type V } from "@/comps/data";

export default function CompsIndex() {
  const order: V[] = ["a", "b", "c"];
  return (
    <main className="cmp-idx" id="comp-main">
      <div className="cmp-wrap">
        <p className="cmp-eyebrow">Seasonally Living · Design comps</p>
        <h1>Three directions. Pick one in a minute.</h1>
        <p className="cmp-lead" style={{ color: "var(--ink-soft)" }}>
          Each comp is a full home page and a full hot tubs page, built from the real photography and the real facts. The live site (Alpine) is unchanged. Previews below are live; open one to scroll it.
        </p>
        <div className="cmp-idx-grid">
          {order.map((v) => {
            const c = COMPS[v];
            return (
              <article key={v} className="cmp-idx-card">
                <Preview src={`/comps/${v}`} title={`Preview of comp ${c.letter}: ${c.name}`} />
                <div className="cmp-idx-body">
                  <p className="l">Comp {c.letter}</p>
                  <h2>{c.name}</h2>
                  <p>{c.line}</p>
                  <p className="why">{c.rationale}</p>
                  <div className="cmp-idx-links">
                    <Link href={`/comps/${v}`} className="btn btn-primary">Open home</Link>
                    <Link href={`/comps/${v}/hot-tubs`} className="btn btn-outline">Open hot tubs</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
