import SatelliteLogo from "../components/SatelliteLogo";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Test location: Amaravati, Andhra Pradesh
const DEMO_LON = 80.5033;
const DEMO_LAT = 16.5150;

function mapboxSatUrl(lon: number, lat: number, zoom: number, w: number, h: number) {
  const pin = `pin-l+b8903a(${lon},${lat})`;
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${pin}/${lon},${lat},${zoom},0/${w}x${h}@2x?access_token=${MAPBOX_TOKEN}`;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skydeedexperiment-production.up.railway.app";

const stats = [
  { value: "Every 5 days", label: "Your land is scanned" },
  { value: "Instant", label: "Alerts on your phone" },
  { value: "24 / 7", label: "Always watching" },
  { value: "PDF", label: "Legal evidence ready" },
];

const steps = [
  {
    num: "01",
    title: "Add your plot",
    body: "Share the location of your land with us. Takes under a minute — no technical knowledge needed.",
  },
  {
    num: "02",
    title: "We record how it looks today",
    body: "We take an aerial snapshot of your land and save it as the reference. This is what 'normal' looks like.",
  },
  {
    num: "03",
    title: "We keep watching",
    body: "Every few days we check again. If anything looks different — construction, clearing, encroachment — we catch it.",
  },
  {
    num: "04",
    title: "You get the alert",
    body: "A message reaches you wherever you are in the world — with before/after images and a PDF you can forward to family or a lawyer back home.",
  },
];

const C = {
  bg: "#faf6f0",
  bgCard: "#f2ebe0",
  bgDark: "#1c1408",
  border: "rgba(160,120,40,0.18)",
  borderHover: "rgba(160,120,40,0.38)",
  text: "#1c1408",
  textSub: "#5c4e38",
  textMuted: "#9e8a6e",
  gold: "#b8903a",
  goldLight: "#d4aa58",
};

export default function Home() {
  return (
    <div style={{ background: C.bg, color: C.text }}>

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav
        style={{
          borderBottom: `1px solid ${C.border}`,
          background: C.bg,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <SatelliteLogo size={26} />
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-cormorant)", color: C.gold }}
            >
              SkyDeed
            </span>
          </div>
          <a
            href={`${API_URL}/auth/google/login`}
            className="text-sm font-semibold px-4 py-2 transition-opacity hover:opacity-75"
            style={{
              background: C.bgDark,
              color: "#f0e8d4",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            Sign in
          </a>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="max-w-5xl mx-auto px-5 text-center"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{
            background: "rgba(184,144,58,0.08)",
            border: `1px solid ${C.border}`,
            color: C.gold,
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: C.gold }}
          />
          For Indians living abroad with land back home
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: "var(--font-cormorant)", color: C.text }}
        >
          Know the moment something{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            changes on your land
          </span>
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: C.textSub }}
        >
          You are thousands of miles away. We make sure someone is always
          watching your land back home — and the moment anything changes,
          you know about it with evidence in hand.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`${API_URL}/auth/google/login`}
            className="inline-flex items-center gap-2 text-base font-bold px-8 py-3"
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              color: "#fff",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Start for free
          </a>
          <a
            href="/pricing"
            className="text-sm font-semibold px-6 py-3 transition-colors"
            style={{
              color: C.textSub,
              border: `1px solid ${C.border}`,
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            See pricing →
          </a>
        </div>

        {/* Trust line */}
        <div
          className="flex items-center justify-center gap-2 mt-8"
          style={{ fontFamily: "var(--font-dm-mono)", fontSize: "12px", color: C.textMuted }}
        >
          <span style={{ color: C.gold, fontSize: "16px" }}>●</span>
          Plots currently being monitored across AP &amp; Telangana
          <span
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            · Live
          </span>
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.borderHover}, transparent)` }} />

      {/* ── Stats bar ───────────────────────────────────────────── */}
      <section style={{ background: C.bgCard }}>
        <div className="max-w-5xl mx-auto px-5 py-14">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
            }}
            className="grid-cols-2 md:grid-cols-4"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{
                  textAlign: "center",
                  padding: "0 24px",
                  borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 700,
                    color: C.gold,
                    lineHeight: 1,
                    marginBottom: "10px",
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    color: C.textMuted,
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.borderHover}, transparent)` }} />

      {/* ── Satellite Map ───────────────────────────────────────── */}
      <section
        style={{ background: C.bgDark }}
        className="py-20 px-5"
      >
        <div className="max-w-5xl mx-auto">
          {/* heading */}
          <div className="text-center mb-10">
            <p
              className="text-xs font-medium mb-3 tracking-widest uppercase"
              style={{ color: C.gold, fontFamily: "var(--font-dm-mono)" }}
            >
              Andhra Pradesh &amp; Telangana
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-cormorant)", color: "#f0e8d4" }}
            >
              Real land. Real monitoring.
            </h2>
            <p
              className="text-sm max-w-xl mx-auto leading-relaxed"
              style={{ color: "#a89070" }}
            >
              This is actual satellite imagery of a plot we monitor in Amaravati, AP —
              the same view our system checks every 5 days for any change.
            </p>
          </div>

          {/* map image */}
          <div
            style={{
              position: "relative",
              borderRadius: "4px",
              overflow: "hidden",
              border: `1px solid rgba(184,144,58,0.25)`,
              boxShadow: "0 0 60px rgba(184,144,58,0.08)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mapboxSatUrl(DEMO_LON, DEMO_LAT, 14, 1200, 520)}
              alt="Satellite view of monitored land in Andhra Pradesh"
              width={1200}
              height={520}
              style={{ width: "100%", height: "auto", display: "block" }}
            />

            {/* overlay badge */}
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                background: "rgba(28,20,8,0.85)",
                border: `1px solid rgba(184,144,58,0.35)`,
                borderRadius: "3px",
                padding: "8px 14px",
                fontFamily: "var(--font-dm-mono)",
                fontSize: "11px",
                color: C.gold,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backdropFilter: "blur(6px)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: C.gold, flexShrink: 0 }}
              />
              Amaravati, Andhra Pradesh · Plot under monitoring
            </div>

            {/* Mapbox attribution */}
            <div
              style={{
                position: "absolute",
                bottom: "6px",
                right: "8px",
                fontSize: "10px",
                color: "rgba(255,255,255,0.45)",
                fontFamily: "var(--font-dm-mono)",
              }}
            >
              © Mapbox © OpenStreetMap
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.borderHover}, transparent)` }} />

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <div className="text-center mb-14">
          <p
            className="text-xs font-medium mb-3 tracking-widest uppercase"
            style={{ color: C.gold, fontFamily: "var(--font-dm-mono)" }}
          >
            How it works
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-cormorant)", color: C.text }}
          >
            Simple protection, powerful results
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: "4px",
                padding: "28px",
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
              }}
            >
              <span
                className="text-3xl font-bold shrink-0"
                style={{ fontFamily: "var(--font-cormorant)", color: C.goldLight }}
              >
                {step.num}
              </span>
              <div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ fontFamily: "var(--font-cormorant)", color: C.text }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textSub }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────────────── */}
      <section
        className="mx-4 md:mx-auto max-w-5xl px-8 py-16 text-center mb-20"
        style={{
          background: C.bgDark,
          borderRadius: "4px",
        }}
      >
        <h2
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "var(--font-cormorant)", color: "#f0e8d4" }}
        >
          You&apos;re in another country.{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            We are watching your land.
          </span>
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-sm leading-relaxed" style={{ color: "#a89070" }}>
          Someone starts building on your plot in Vizag. You find out in 5 days —
          not 5 years. That is what SkyDeed does for NRIs.
        </p>
        <a
          href={`${API_URL}/auth/google/login`}
          className="inline-block text-base font-bold px-8 py-3"
          style={{
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            color: "#fff",
            borderRadius: "2px",
            textDecoration: "none",
          }}
        >
          Get started — it&apos;s free
        </a>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: `1px solid ${C.border}`,
          background: C.bgCard,
        }}
      >
        <div
          className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: C.textMuted }}
        >
          <div className="flex items-center gap-2">
            <SatelliteLogo size={18} />
            <span style={{ fontFamily: "var(--font-dm-mono)" }}>
              SkyDeed — Land Monitoring
            </span>
          </div>
          <p style={{ fontFamily: "var(--font-dm-mono)" }}>
            © {new Date().getFullYear()} SkyDeed · All rights reserved
          </p>
        </div>
      </footer>

    </div>
  );
}
