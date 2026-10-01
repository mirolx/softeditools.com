import { useEffect, useState } from "react";
import {
  ArrowUpRight, Baseline, CaseSensitive, Calculator, CalendarDays, Coins,
  FlaskConical, KeyRound, Palette, Pilcrow, Ruler, Type,
} from "lucide-react";
import GlyphPortal from "@/components/ui/glyph-portal";
import playfairUrl from "@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2?url";

const FAMILY = '"SoftEdit Display", "Playfair Display", Georgia, serif';
const FALLBACK = "Georgia, serif";

const tools = [
  { href: "/word-counter/", name: "Word Counter", desc: "Count words, sentences and reading time.", icon: Type },
  { href: "/character-counter/", name: "Character Counter", desc: "Characters with and without spaces.", icon: Baseline },
  { href: "/case-converter/", name: "Case Converter", desc: "Upper, lower, title and sentence case.", icon: CaseSensitive },
  { href: "/lorem-ipsum-generator/", name: "Lorem Ipsum", desc: "Placeholder text, made to measure.", icon: Pilcrow },
  { href: "/password-generator/", name: "Password Generator", desc: "Strong passwords, generated locally.", icon: KeyRound },
  { href: "/palette-finder/", name: "Palette Finder", desc: "Find colours that sit well together.", icon: Palette },
  { href: "/calculator/", name: "Calculator", desc: "A clean, quiet everyday calculator.", icon: Calculator },
  { href: "/scientific-calculator/", name: "Scientific Calculator", desc: "Functions, powers and more.", icon: FlaskConical },
  { href: "/unit-converter/", name: "Unit Converter", desc: "Length, weight, temperature and more.", icon: Ruler },
  { href: "/currency-converter/", name: "Currency Converter", desc: "Live exchange rates, no clutter.", icon: Coins },
  { href: "/age-calculator/", name: "Age Calculator", desc: "Exact age in years, months and days.", icon: CalendarDays },
];

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
        "--gp-field": "#fdfcf7",
        "--gp-ink": "#ffffff",
        "--gp-foreground": "#33382e",
      }}
      background={<div className="absolute inset-0 bg-cream" style={{ transform: "scale(var(--gp-field-scale,1))" }} />}
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
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ href, name, desc, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                className="group flex h-full flex-col gap-2 rounded-2xl border border-[#e5e1d3] bg-white/60 p-5 text-inherit no-underline transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Icon className="size-6 text-[#7c8b6f]" aria-hidden />
                <span className="font-serif text-xl text-forest">{name}</span>
                <span className="flex-1 text-sm leading-relaxed text-[#686d5d]">{desc}</span>
                <span className="flex items-center justify-between text-sm font-bold text-[#5b6b4e]">
                  Open
                  <ArrowUpRight className="size-5 rounded-full border border-current p-1 transition group-hover:bg-[#5b6b4e] group-hover:text-white" aria-hidden />
                </span>
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
