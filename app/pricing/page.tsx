"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skydeedexperiment-production.up.railway.app";

interface Plan {
  name: string;
  price_inr: number;
  plots: number;
  scan_days: number;
  description: string;
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

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export default function Pricing() {
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/payments/plans`)
      .then((r) => r.json())
      .then(setPlans)
      .finally(() => setLoading(false));

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  async function handleUpgrade(planKey: string) {
    const token = localStorage.getItem("skydeed_token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    setPaying(planKey);
    setMessage("");

    try {
      const res = await authFetch(`${API_URL}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessage(err.detail || "Payment setup failed");
        setPaying(null);
        return;
      }

      const order = await res.json();

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "SkyDeed",
        description: order.plan_name,
        order_id: order.order_id,
        prefill: {
          name: order.user_name,
          email: order.user_email,
        },
        theme: { color: "#c9a84c" },
        handler: function () {
          setMessage(
            "Payment successful! Your plan will be activated within a minute."
          );
          setPaying(null);
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 3000);
        },
        modal: {
          ondismiss: function () {
            setPaying(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setMessage("Something went wrong. Please try again.");
      setPaying(null);
    }
  }

  const planOrder = ["starter", "farmer", "pro"];

  return (
    <div className="min-h-screen" style={{ background: "var(--navy-900)" }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-5 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-medium mb-3 tracking-widest uppercase"
            style={{ color: "var(--gold-600)", fontFamily: "var(--font-dm-mono)" }}
          >
            Pricing
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Choose your monitoring plan
          </h1>
          <p className="max-w-xl mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>
            Every plan includes real Sentinel-2 satellite imagery, Telegram
            alerts, and PDF evidence reports.
          </p>
        </div>

        {/* Success / error message */}
        {message && (
          <div
            className="mb-10 rounded-xl p-4 text-center text-sm font-medium"
            style={{
              background: "rgba(201,168,76,0.1)",
              border: "1px solid var(--border-hover)",
              color: "var(--gold-400)",
            }}
          >
            {message}
          </div>
        )}

        {/* Plan cards */}
        {loading ? (
          <div className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Loading plans…
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {planOrder.map((key, i) => {
              const plan = plans[key];
              if (!plan) return null;
              const isPopular = i === 1;

              return (
                <div
                  key={key}
                  className="relative rounded-2xl p-7 flex flex-col transition-transform hover:-translate-y-0.5"
                  style={{
                    background: isPopular ? "var(--navy-700)" : "var(--navy-800)",
                    border: `1px solid ${isPopular ? "var(--border-hover)" : "var(--border)"}`,
                    boxShadow: isPopular ? "0 0 32px rgba(201,168,76,0.08)" : "none",
                  }}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          background: "linear-gradient(135deg, var(--gold-600), var(--gold-500))",
                          color: "var(--navy-900)",
                          fontFamily: "var(--font-dm-mono)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        POPULAR
                      </span>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="mb-6">
                    <p
                      className="text-xs font-medium mb-1 tracking-widest uppercase"
                      style={{ color: "var(--gold-700)", fontFamily: "var(--font-dm-mono)" }}
                    >
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1 mt-3">
                      <span
                        className="text-4xl font-bold"
                        style={{ fontFamily: "var(--font-cormorant)", color: isPopular ? "var(--gold-400)" : "var(--text-primary)" }}
                      >
                        ₹{plan.price_inr}
                      </span>
                      <span className="text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>/month</span>
                    </div>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                    {[
                      `${plan.plots} plot${plan.plots > 1 ? "s" : ""}`,
                      `Scan every ${plan.scan_days} days`,
                      "Telegram alerts",
                      "PDF evidence reports",
                      "Real Sentinel-2 imagery",
                    ].map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-sm">
                        <span style={{ color: "var(--gold-600)" }}>✓</span>
                        <span style={{ color: "var(--text-secondary)" }}>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={paying === key}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={
                      isPopular
                        ? {
                            background: "linear-gradient(135deg, var(--gold-600), var(--gold-500))",
                            color: "var(--navy-900)",
                          }
                        : {
                            background: "transparent",
                            color: "var(--gold)",
                            border: "1px solid var(--gold)",
                          }
                    }
                  >
                    {paying === key ? "Opening payment…" : "Get started"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs mt-10" style={{ color: "var(--text-muted)", fontFamily: "var(--font-dm-mono)" }}>
          Payments secured by Razorpay · Cancel anytime
        </p>
      </div>
    </div>
  );
}
