import { useEffect, useState } from "react";
import {
  ArrowUpRight, Baseline, CaseSensitive, Calculator, CalendarDays, Coins,
  FlaskConical, KeyRound, Palette, Pilcrow, Ruler, Type,
} from "lucide-react";
import GlyphPortal from "@/components/ui/glyph-portal";
import { Pointer } from "@/components/ui/pointer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import playfairUrl from "@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2?url";

const FAMILY = '"SoftEdit Display", "Playfair Display", Georgia, serif';
const FALLBACK = "Georgia, serif";

type Tool = { href: string; name: string; label: string; desc: string; icon: typeof Type; wide?: boolean };
const tools: Tool[] = [
  { href: "/word-counter/", name: "Word Counter", label: "Writing", wide: true, desc: "Count words, sentences and reading time.", icon: Type },
  { href: "/character-counter/", name: "Character Counter", label: "Writing", desc: "Characters with and without spaces.", icon: Baseline },
  { href: "/case-converter/", name: "Case Converter", label: "Writing", desc: "Upper, lower, title and sentence case.", icon: CaseSensitive },
  { href: "/lorem-ipsum-generator/", name: "Lorem Ipsum", label: "Writing", desc: "Placeholder text, made to measure.", icon: Pilcrow },
  { href: "/password-generator/", name: "Password Generator", label: "Security", desc: "Strong passwords, generated locally.", icon: KeyRound },
  { href: "/palette-finder/", name: "Palette Finder", label: "Design", desc: "Find colours that sit well together.", icon: Palette },
  { href: "/calculator/", name: "Calculator", label: "Numbers", desc: "A clean, quiet everyday calculator.", icon: Calculator },
  { href: "/scientific-calculator/", name: "Scientific Calculator", label: "Numbers", desc: "Functions, powers and more.", icon: FlaskConical },
  { href: "/unit-converter/", name: "Unit Converter", label: "Convert", desc: "Length, weight, temperature and more.", icon: Ruler },
  { href: "/currency-converter/", name: "Currency Converter", label: "Convert", desc: "Live exchange rates, no clutter.", icon: Coins },
  { href: "/age-calculator/", name: "Age Calculator", label: "Dates", desc: "Exact age in years, months and days.", icon: CalendarDays },
];

// Cream to sage wash, shared by the portal field and the content behind the tool grid.
const FIELD = "linear-gradient(155deg, #fdfcf7 0%, #eef0e2 35%, #d3d9c3 70%, #b3bd9f 100%)";

let fontLoad: Promise<void> | undefined;

export default function App() {
  const [face, setFace] = useState<string | null>(null);

  useEffect(() => {
    let settled = false;
    const finish = (v: string) => { if (!settled) { settled = true; setFace(v); } };
    // The portal freezes the face at mount, so wait for it (or fall back after 1.6s).
    fontLoad ??= new FontFace("SoftEdit Display", `url(${playfairUrl})`, { weight: "400" })
      .load().then((f) => { document.fonts.add(f); });
    const timeout = window.setTimeout(() => finish(FALLBACK), 1600);
    void fontLoad.then(() => finish(FAMILY), () => finish(FALLBACK));
    return () => { settled = true; clearTimeout(timeout); };
  }, []);

  if (!face) return <div className="min-h-svh bg-sage" role="status" aria-label="Loading" />;

  return (
    <GlyphPortal
      word="SoftEdit Tools"
      focusChar="o"
      fontFamily={face}
      fontWeight={400}
      scrollLength={2.2}
      enterLabel="Browse the tools"
      style={{
        "--gp-paper": "#98998a",
        "--gp-field": FIELD,
        "--gp-ink": "#ffffff",
        "--gp-foreground": "#33382e",
      }}
      background={<div className="absolute inset-0" style={{ background: FIELD, transform: "scale(var(--gp-field-scale,1))" }} />}
      front={
        <p
          className="absolute left-[8%] right-[8%] m-0 font-sans text-[clamp(1.1rem,2.6vw,2rem)] font-normal italic leading-tight tracking-[0.04em] text-white"
          style={{ bottom: "calc(100% - var(--gp-word-top, 35%) + 28px)" }}
        >
          simple tools, softly made
        </p>
      }
    >
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="m-0 mb-3 font-serif text-4xl leading-tight text-forest sm:text-5xl">Everyday tools, kept simple.</h2>
        <p className="m-0 mb-10 max-w-[48ch] text-base leading-relaxed text-[#686d5d]">
          Free, fast and quiet. No sign-up, no clutter — just the tool you came for.
        </p>
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ href, name, label, desc, icon: Icon, wide }) => (
            <li key={href} className={wide ? "sm:col-span-2" : undefined}>
              <a href={href} className="block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest">
                <Card className="group h-full overflow-hidden rounded-3xl border-white/70 bg-card/80 shadow-[0_1px_2px_rgba(63,74,56,.06),0_12px_32px_-12px_rgba(63,74,56,.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(63,74,56,.08),0_24px_48px_-16px_rgba(63,74,56,.28)]">
                  <div
                    className={`relative grid place-items-center overflow-hidden ${wide ? "h-52" : "h-40"}`}
                    style={{ background: "radial-gradient(120% 90% at 20% 0%, #f4f2e4 0%, #dfe4d0 55%, #c4ccb0 100%)" }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-60"
                      style={{ backgroundImage: "radial-gradient(#7c8b6f33 1.2px, transparent 1.2px)", backgroundSize: "16px 16px", maskImage: "linear-gradient(to bottom, #000, transparent 85%)" }}
                    />
                    <span className="relative grid size-16 place-items-center rounded-2xl bg-white/90 shadow-[0_8px_24px_-8px_rgba(63,74,56,.35)] transition duration-300 group-hover:scale-110 group-hover:-rotate-3">
                      <Icon className="size-7 text-[#5b6b4e]" aria-hidden />
                    </span>
                  </div>
                  <CardHeader className="gap-1.5 px-6 pb-6 pt-5">
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#7c8b6f]">{label}</span>
                    <CardTitle className="font-serif text-2xl font-medium tracking-normal text-forest">{name}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{desc}</CardDescription>
                  </CardHeader>
                </Card>
                <Pointer>
                  <span className="flex items-center gap-1.5 rounded-full bg-forest py-2 pl-4 pr-3 text-sm font-bold text-cream shadow-lg">
                    Open <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </Pointer>
              </a>
            </li>
          ))}
        </ul>
        <p className="m-0 mt-12 text-sm text-[#686d5d]">
          &copy; 2026 SoftEdit Tools &middot; <a className="hover:text-[#5b6b4e]" href="/about/">About</a> &middot; <a className="hover:text-[#5b6b4e]" href="/blog/">Blog</a> &middot; <a className="hover:text-[#5b6b4e]" href="/privacy-policy/">Privacy Policy</a>
        </p>
      </div>
    </GlyphPortal>
  );
}
