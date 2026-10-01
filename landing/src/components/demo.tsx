"use client";

import { useEffect, useState } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";

const settings = { word: "SUBLIME", scrollLength: 2.4, interactive: true, annotations: false };
const family = '"Glyph Portal Jakarta", Arial, sans-serif';
let fontLoad: Promise<void> | undefined;

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [face, setFace] = useState<string | null>(null);
  useEffect(() => {
    let settled = false;
    const finish = (value: string) => { if (!settled) { settled = true; setFace(value); } };
    // The demo uses the résumé's face. The component itself never fetches a font.
    fontLoad ??= new FontFace("Glyph Portal Jakarta", 'url("https://cdn.21st.dev/assets/mirror/15/153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79.woff2")', { weight: "400 700" })
      .load().then((font) => { document.fonts.add(font); });
    const timeout = window.setTimeout(() => finish("Arial, sans-serif"), 1600);
    void fontLoad.then(() => finish(family), () => finish("Arial, sans-serif"));
    return () => { settled = true; clearTimeout(timeout); };
  }, []);
  return (
    <div data-demo-scroll data-slipstream-demo tabIndex={0} role="region" aria-label="Sublime. Scroll to step inside."
      style={{ width: "100%", height: "min(720px, 100svh)", overflowY: "auto", background: "#fff", containerType: "inline-size", fontFamily: face ?? "Arial, sans-serif" }}>
      {face ? <GlyphPortal word={s.word} fontFamily={face} fontWeight={700} style={{ fontFamily: face }} scrollLength={s.scrollLength} interactive={s.interactive} annotations={s.annotations} enterLabel="Step inside" />
        : <div role="status" style={{ height: "100%", display: "grid", placeItems: "center", color: "#555", fontSize: 12 }}>Loading type…</div>}
    </div>
  );
}
