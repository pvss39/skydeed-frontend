"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SatelliteLogo from "../../components/SatelliteLogo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://skydeedexperiment-production.up.railway.app";

interface User {
  id: number;
  email: string;
  name: string;
  picture_url: string;
}

interface Plot {
  id: number;
  name: string;
  last_scan_date: string | null;
  is_active: boolean;
}

function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("skydeed_token");
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// ── Sub-components ────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card" style={{ padding: "20px", borderRadius: "4px" }}>
      <p
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "var(--text-muted)",
          marginBottom: "8px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "28px",
          color: "var(--gold-400)",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        padding: "12px 24px",
        fontFamily: "var(--font-dm-sans)",
        fontSize: "14px",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        background: active ? "rgba(201,168,76,0.06)" : "transparent",
        borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
        textDecoration: "none",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.04)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {label}
    </a>
  );
}

// ── Main component ────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const freshLogin = Boolean(urlToken);
    if (urlToken) {
      localStorage.setItem("skydeed_token", urlToken);
      window.history.replaceState({}, "", "/dashboard");
    }

    authFetch(`${API_URL}/auth/me`)
      .then((r) => {
        if (!r.ok) throw new Error("Not logged in");
        return r.json();
      })
      .then(setUser)
      .catch((err) => {
        setError(`Auth failed: ${err.message}`);
      });

    authFetch(`${API_URL}/plots/`)
      .then((r) => r.json())
      .then((data: Plot[]) => {
        setPlots(data);
        if (freshLogin && data.length === 0) {
          router.push("/onboarding");
        }
      })
      .catch(() => setPlots([]))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("skydeed_token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--navy-900)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary)",
          gap: "12px",
          fontSize: "14px",
        }}
      >
        <SatelliteLogo size={22} />
        Loading your dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--navy-900)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <div
          className="card"
          style={{ maxWidth: "420px", width: "100%", padding: "32px", textAlign: "center", borderColor: "rgba(239,68,68,0.3)" }}
        >
          <p style={{ fontWeight: 600, color: "#f87171", marginBottom: "8px" }}>Authentication failed</p>
          <p style={{ fontSize: "13px", fontFamily: "var(--font-dm-mono)", color: "var(--text-secondary)", wordBreak: "break-all", marginBottom: "24px" }}>
            {error}
          </p>
          <a href="/" className="btn-gold" style={{ fontSize: "13px" }}>Return home</a>
        </div>
      </div>
    );
  }

  // Derived stat data
  const activePlots = plots.filter((p) => p.is_active).length;
  const lastScan = plots
    .map((p) => p.last_scan_date)
    .filter(Boolean)
    .sort()
    .reverse()[0] ?? null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--navy-900)", position: "relative" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 30 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "220px",
          background: "var(--navy-800)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 40,
          transform: sidebarOpen ? "translateX(0)" : undefined,
          transition: "transform 0.2s",
        }}
        className={sidebarOpen ? "" : "sidebar-hidden"}
      >
        {/* Logo */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <SatelliteLogo size={24} />
          <span
            style={{
              fontFamily: "var(--font-cormorant)",
              color: "var(--gold-400)",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          >
            SkyDeed
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: "8px" }}>
          <NavItem href="/dashboard" label="Dashboard" active />
          <NavItem href="/pricing" label="Upgrade Plan" />
        </nav>

        {/* Bottom */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)" }}>
          {user && (
            <p
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "11px",
                color: "var(--text-muted)",
                marginBottom: "10px",
                wordBreak: "break-all",
              }}
            >
              {user.email}
            </p>
          )}
          <button
            onClick={handleLogout}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "13px",
              color: "var(--text-secondary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, marginLeft: "220px", display: "flex", flexDirection: "column" }} className="main-content">

        {/* Top bar */}
        <header
          style={{
            height: "56px",
            background: "var(--navy-950)",
            borderBottom: "1px solid var(--border)",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="hamburger-btn"
              style={{ color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", display: "none" }}
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: "18px", color: "var(--text-primary)" }}>
              Dashboard
            </span>
          </div>
          <a
            href="/pricing"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--gold)",
              border: "1px solid var(--gold)",
              background: "transparent",
              padding: "6px 16px",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            Upgrade
          </a>
        </header>

        {/* Page body */}
        <main style={{ padding: "32px 24px", maxWidth: "960px", width: "100%" }}>

          {/* Stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginBottom: "36px",
            }}
          >
            <StatCard label="Active Plots" value={String(activePlots)} />
            <StatCard label="Last Scan" value={lastScan ?? "No scans yet"} />
            <StatCard label="Alerts This Month" value="0" />
            <StatCard label="Next Scan Due" value={lastScan ? "In 5 days" : "—"} />
          </div>

          {/* Plot list */}
          <h2
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: "16px",
              marginBottom: "16px",
              color: "var(--text-primary)",
            }}
          >
            My Plots
          </h2>

          {plots.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <SatelliteLogo size={48} />
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "26px",
                  color: "var(--text-primary)",
                  margin: "16px 0 8px",
                }}
              >
                No plots registered yet
              </p>
              <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
                Send /register to @Skydeeder_bot to add your first plot
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {plots.map((plot) => (
                <div
                  key={plot.id}
                  className="card"
                  style={{
                    padding: "16px 20px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: "15px", color: "var(--text-primary)" }}>
                      {plot.name}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-mono)",
                        fontSize: "10px",
                        padding: "3px 10px",
                        borderRadius: "999px",
                        background: plot.is_active ? "rgba(34,197,94,0.1)" : "rgba(180,140,60,0.08)",
                        color: plot.is_active ? "#22c55e" : "var(--text-muted)",
                        border: `1px solid ${plot.is_active ? "rgba(34,197,94,0.3)" : "rgba(180,140,60,0.2)"}`,
                      }}
                    >
                      {plot.is_active ? "Active" : "Inactive"}
                    </span>
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
                      {plot.last_scan_date ?? "Not yet scanned"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Telegram CTA */}
          <div
            style={{
              background: "var(--navy-700)",
              border: "1px solid var(--border-hover)",
              borderRadius: "4px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: "15px", color: "#fff", marginBottom: "4px" }}>
                Manage via Telegram
              </p>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "13px", color: "var(--gold)" }}>
                @Skydeeder_bot
              </p>
            </div>
            <a
              href="https://t.me/Skydeeder_bot"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--gold)",
                border: "1px solid var(--gold)",
                background: "transparent",
                padding: "8px 20px",
                borderRadius: "2px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Open Bot
            </a>
          </div>
        </main>
      </div>

      {/* ── Responsive: sidebar + hamburger visibility ─────────── */}
      <style>{`
        @media (max-width: 767px) {
          .sidebar-hidden { transform: translateX(-100%) !important; }
          .main-content { margin-left: 0 !important; }
          .hamburger-btn { display: block !important; }
        }
        @media (min-width: 768px) {
          .sidebar-hidden { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
