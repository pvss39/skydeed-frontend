"use client";

import { useEffect, useState } from "react";

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

    // Load Razorpay SDK
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
        theme: { color: "#22c55e" },
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
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-xl font-bold text-green-400">
          SkyDeed
        </a>
        <a
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Back to Dashboard
        </a>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Choose your plan</h1>
          <p className="text-gray-400">
            Start monitoring your land today. All plans include real Sentinel-2
            satellite imagery.
          </p>
        </div>

        {message && (
          <div className="mb-8 bg-green-900 border border-green-700 rounded-xl p-4 text-center text-green-200">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400">Loading plans...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {planOrder.map((key, i) => {
              const plan = plans[key];
              if (!plan) return null;
              const isPopular = i === 1;

              return (
                <div
                  key={key}
                  className={`relative rounded-2xl p-6 border flex flex-col ${
                    isPopular
                      ? "bg-green-950 border-green-600"
                      : "bg-gray-900 border-gray-800"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h2 className="text-lg font-bold">{plan.name}</h2>
                    <div className="mt-3 flex items-end gap-1">
                      <span className="text-3xl font-bold">
                        ₹{plan.price_inr}
                      </span>
                      <span className="text-gray-400 text-sm mb-1">/month</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-8 flex-1">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span>
                        {plan.plots} plot{plan.plots > 1 ? "s" : ""}
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span>Scan every {plan.scan_days} days</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span>Telegram alerts</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span>PDF evidence reports</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span>Real Sentinel-2 imagery</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={paying === key}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                      isPopular
                        ? "bg-green-500 hover:bg-green-400 text-black"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {paying === key ? "Opening payment..." : "Get started"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-gray-500 text-xs mt-8">
          Payments secured by Razorpay. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
