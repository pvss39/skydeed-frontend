import SatelliteLogo from "../components/SatelliteLogo";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skydeedexperiment-production.up.railway.app";

const stats = [
  { value: "5-day", label: "Scan frequency" },
  { value: "10m", label: "Sentinel-2 resolution" },
  { value: "100%", label: "Real imagery, no AI fakes" },
  { value: "PDF", label: "Legal evidence reports" },
];

const steps = [
  {
    num: "01",
    title: "Register your plot",
    body: "Send GPS coordinates to our Telegram bot. We convert them into a monitoring polygon on Sentinel-2 imagery.",
  },
  {
    num: "02",
    title: "We baseline the land",
    body: "We capture the first satellite image as a baseline — NDVI vegetation index + true-colour RGB.",
  },
  {
    num: "03",
    title: "Automated scans run",
    body: "Every few days we compare new imagery against the baseline. Any change above threshold triggers an alert.",
  },
  {
    num: "04",
    title: "You receive the alert",
    body: "Get a Telegram message with before/after satellite images and a downloadable PDF evidence report.",
  },
];

export default function Home() {
  return (
    <div style={{ background: "var(--navy-900)", color: "var(--text-primary)" }}>
      {/* ── Nav ───────────────────────────────────────────────── */}
      <nav
        style={{ borderBottom: "1px solid var(--border)", background: "var(--navy-950)" }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SatelliteLogo size={26} />
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--gold-400)" }}
            >
              SkyDeed
            </span>
          </div>
          <a
            href={`${API_URL}/auth/google/login`}
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "var(--navy-700)", color: "var(--gold-400)", border: "1px solid var(--border)" }}
          >
            Sign in
          </a>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="max-w-6xl mx-auto px-5 text-center"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{
            background: "rgba(201,168,76,0.08)",
            border: "1px solid var(--border)",
            color: "var(--gold-500)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--gold-500)" }}
          />
          Powered by ESA Sentinel-2 satellite constellation
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Guard your land{" "}
          <span className="text-gold-gradient">from orbit</span>
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Real Sentinel-2 satellite imagery scanned every few days. Instant
          Telegram alerts when encroachment, construction, or vegetation loss is
          detected on your land.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={`${API_URL}/auth/google/login`} className="btn-gold text-base px-8 py-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Start monitoring free
          </a>
          <a
            href="/pricing"
            className="text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            View plans →
          </a>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <div className="divider" />
      <section style={{ background: "var(--navy-950)" }}>
        <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--gold-400)" }}
              >
                {s.value}
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-dm-mono)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>
      <div className="divider" />

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <div className="text-center mb-14">
          <p
            className="text-xs font-medium mb-3 tracking-widest uppercase"
            style={{ color: "var(--gold-600)", fontFamily: "var(--font-dm-mono)" }}
          >
            How it works
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Four steps to satellite protection
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="card p-7 flex gap-5 items-start hover:border-gold-600 transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="text-3xl font-bold shrink-0"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--gold-700)" }}
              >
                {step.num}
              </span>
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────────── */}
      <section
        className="mx-4 md:mx-auto max-w-5xl rounded-2xl px-8 py-14 text-center mb-20"
        style={{
          background: "linear-gradient(135deg, var(--navy-700) 0%, var(--navy-600) 100%)",
          border: "1px solid var(--border-hover)",
        }}
      >
        <h2
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Your land deserves{" "}
          <span className="text-gold-gradient">eyes in space</span>
        </h2>
        <p className="mb-8 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Join landowners monitoring plots across Andhra Pradesh with real
          Copernicus satellite data.
        </p>
        <a href={`${API_URL}/auth/google/login`} className="btn-gold text-base">
          Get started — it&apos;s free
        </a>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer
        className="border-t"
        style={{ borderColor: "var(--border)", background: "var(--navy-950)" }}
      >
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <div className="flex items-center gap-2">
            <SatelliteLogo size={18} />
            <span>SkyDeed — Satellite Land Monitoring</span>
          </div>
          <p>Imagery from ESA Copernicus Sentinel-2 via Google Earth Engine.</p>
        </div>
      </footer>
    </div>
  );
}
