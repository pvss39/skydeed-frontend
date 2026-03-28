"use client";

import { useState } from "react";
import SatelliteLogo from "./SatelliteLogo";

interface NavbarProps {
  /** If provided, shows user email + logout button instead of Sign In */
  userEmail?: string;
  onLogout?: () => void;
  /** Highlight the Upgrade link */
  showUpgrade?: boolean;
}

export default function Navbar({ userEmail, onLogout, showUpgrade }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{ borderBottom: "1px solid var(--border)", background: "var(--navy-950)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <SatelliteLogo size={26} />
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--gold-400)" }}
          >
            SkyDeed
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {userEmail ? (
            <>
              {showUpgrade && (
                <a
                  href="/pricing"
                  className="px-3 py-1.5 rounded-lg font-semibold text-xs"
                  style={{
                    background: "rgba(201,168,76,0.12)",
                    color: "var(--gold-400)",
                    border: "1px solid var(--border)",
                  }}
                >
                  Upgrade
                </a>
              )}
              <span style={{ color: "var(--text-secondary)" }}>{userEmail}</span>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{ background: "var(--navy-700)", color: "var(--text-secondary)" }}
              >
                Logout
              </button>
            </>
          ) : (
            <a href="/dashboard" style={{ color: "var(--text-secondary)" }} className="hover:text-white transition-colors">
              Dashboard
            </a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 rounded-lg"
          style={{ color: "var(--text-secondary)" }}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {open ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden px-5 pb-4 flex flex-col gap-3 text-sm"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {userEmail ? (
            <>
              <span style={{ color: "var(--text-secondary)" }}>{userEmail}</span>
              {showUpgrade && (
                <a href="/pricing" style={{ color: "var(--gold-400)" }}>
                  Upgrade plan
                </a>
              )}
              <button
                onClick={onLogout}
                style={{ color: "var(--text-secondary)", textAlign: "left" }}
              >
                Logout
              </button>
            </>
          ) : (
            <a href="/dashboard" style={{ color: "var(--text-secondary)" }}>
              Dashboard
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
