"use client";

import { useEffect, useState } from "react";

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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Extract token from URL if present (after Google OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("[dashboard] URL token found:", !!token, "| URL:", window.location.href);
    if (token) {
      localStorage.setItem("skydeed_token", token);
      window.history.replaceState({}, "", "/dashboard");
    }
    console.log("[dashboard] localStorage token:", localStorage.getItem("skydeed_token")?.slice(0, 20) + "...");

    // Load user info
    authFetch(`${API_URL}/auth/me`)
      .then((r) => {
        if (!r.ok) throw new Error("Not logged in");
        return r.json();
      })
      .then(setUser)
      .catch((err) => {
        setError(`Auth failed: ${err.message}`);
      });

    // Load plots
    authFetch(`${API_URL}/plots/`)
      .then((r) => r.json())
      .then(setPlots)
      .catch(() => setPlots([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("skydeed_token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white px-4">
        <div className="bg-red-900 border border-red-700 rounded-xl p-6 max-w-lg w-full">
          <p className="font-bold mb-2">Login error</p>
          <p className="text-sm text-red-200 font-mono break-all">{error}</p>
          <p className="text-xs text-red-300 mt-2">Token in storage: {typeof window !== "undefined" ? (localStorage.getItem("skydeed_token") ? "YES ✓" : "NO ✗") : "?"}</p>
          <a href="/" className="mt-4 inline-block text-sm underline text-red-300">Go back</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-400">SkyDeed</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Welcome, {user?.name?.split(" ")[0]}</h2>
          <p className="text-gray-400 mt-1">Your satellite land monitoring dashboard</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Your Plots</h3>
        </div>

        {plots.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4">🌾</p>
            <p className="text-gray-400 mb-2">No plots registered yet</p>
            <p className="text-gray-500 text-sm">
              Use the Telegram bot <strong>@Skydeeder_bot</strong> to register your farm plot
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {plots.map((plot) => (
              <div
                key={plot.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{plot.name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Last scan: {plot.last_scan_date || "Not yet scanned"}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    plot.is_active
                      ? "bg-green-900 text-green-300"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {plot.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Telegram CTA */}
        <div className="mt-8 bg-blue-950 border border-blue-800 rounded-2xl p-6 text-center">
          <p className="font-semibold mb-2">Connect Telegram for alerts</p>
          <p className="text-gray-400 text-sm mb-4">
            Register plots and receive satellite images directly on Telegram
          </p>
          <a
            href="https://t.me/Skydeeder_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors text-sm font-semibold"
          >
            Open @Skydeeder_bot
          </a>
        </div>
      </div>
    </div>
  );
}
