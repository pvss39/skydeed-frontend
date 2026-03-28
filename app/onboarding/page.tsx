"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SatelliteLogo from "../../components/SatelliteLogo";
import { handleStripeCheckout } from "../../lib/stripeCheckout";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skydeedexperiment-production.up.railway.app";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

// ── Plan data ─────────────────────────────────────────────────

interface PlanDef {
  key: string;
  name: string;
  usdPrice: string;
  inrPrice: string;
  tagline: string;
  features: [string, string, string];
  stripePriceId: string;
  popular?: boolean;
}

const PLANS: PlanDef[] = [
  {
    key: "starter",
    name: "Starter",
    usdPrice: "$6",
    inrPrice: "₹499",
    tagline: "1 plot · Weekly scans",
    features: ["1 plot", "Scan every 7 days", "Telegram alerts"],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_ID || "",
  },
  {
    key: "farmer",
    name: "Farmer",
    usdPrice: "$12",
    inrPrice: "₹999",
    tagline: "3 plots · Every 5 days",
    features: ["3 plots", "Scan every 5 days", "Telegram + email alerts, PDF reports"],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_FARMER_ID || "",
    popular: true,
  },
  {
    key: "pro",
    name: "Pro",
    usdPrice: "$29",
    inrPrice: "₹2499",
    tagline: "10 plots · Every 3 days",
    features: ["10 plots", "Scan every 3 days", "Priority alerts, PDF + SAR fallback"],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_ID || "",
  },
];

// ── Step indicator ────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        {[1, 2, 3].map((n, i) => (
          <div key={n} style={{ display: "flex", alignItems: "center" }}>
            {/* Dot */}
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: n <= current ? "var(--gold)" : "transparent",
                border: n <= current ? "none" : "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {n < current && (
                <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2" stroke="var(--navy-900)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            {/* Connector line */}
            {i < 2 && (
              <div
                style={{ width: "64px", height: "1px", background: "var(--border)" }}
              />
            )}
          </div>
        ))}
      </div>
      <p
        style={{
          textAlign: "center",
          fontFamily: "var(--font-dm-mono)",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        Step {current} of 3
      </p>
    </div>
  );
}

// ── Field component ───────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  type = "text",
  helper,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  type?: string;
  helper?: string;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-dm-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--text-muted)",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          background: "var(--navy-800)",
          border: `1px solid ${error ? "#e05555" : "var(--border)"}`,
          borderRadius: "4px",
          padding: "10px 14px",
          color: disabled ? "var(--text-secondary)" : "var(--text-primary)",
          fontFamily: "var(--font-dm-sans)",
          fontSize: "14px",
          outline: "none",
          cursor: disabled ? "not-allowed" : "text",
          opacity: disabled ? 0.5 : 1,
          boxSizing: "border-box",
        }}
      />
      {error && (
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "12px",
            color: "#e05555",
            marginTop: "4px",
          }}
        >
          {error}
        </p>
      )}
      {helper && !error && (
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "11px",
            color: "var(--text-muted)",
            marginTop: "4px",
          }}
        >
          {helper}
        </p>
      )}
    </div>
  );
}

// ── Loading spinner ───────────────────────────────────────────

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite", verticalAlign: "middle" }}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

// ── Ghost gold button ─────────────────────────────────────────

function GhostBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: "var(--gold)",
        fontFamily: "var(--font-dm-sans)",
        fontSize: "13px",
        cursor: "pointer",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────

export default function Onboarding() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [step1Loading, setStep1Loading] = useState(false);
  const [step1Error, setStep1Error] = useState("");

  // Step 2
  const [plotName, setPlotName] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [plotErrors, setPlotErrors] = useState<Record<string, string>>({});
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2Error, setStep2Error] = useState("");

  // Step 3
  const [currency, setCurrency] = useState<"usd" | "inr">(() => {
    if (typeof window === "undefined") return "inr";
    return Intl.DateTimeFormat().resolvedOptions().timeZone.startsWith("America")
      ? "usd"
      : "inr";
  });
  const [selectedPlan, setSelectedPlan] = useState("farmer");
  const [step3Loading, setStep3Loading] = useState(false);
  const [step3Error, setStep3Error] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("skydeed_token");
    if (!token) {
      router.push("/");
      return;
    }

    // Load Razorpay SDK for INR payments
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/auth/me`, { headers }).then((r) =>
        r.ok ? r.json() : Promise.reject()
      ),
      fetch(`${API_URL}/plots/`, { headers })
        .then((r) => r.json())
        .catch(() => [] as unknown[]),
    ])
      .then(([userInfo, plots]) => {
        if (Array.isArray(plots) && plots.length > 0) {
          router.push("/dashboard");
          return;
        }
        setName((userInfo as { name?: string }).name ?? "");
        setEmail((userInfo as { email?: string }).email ?? "");
        setCheckingAuth(false);
      })
      .catch(() => router.push("/"));
  }, [router]);

  // ── Step 1 handler ───────────────────────────────────────

  async function handleStep1() {
    if (!phone.trim()) {
      setPhoneError("Phone number required");
      return;
    }
    setPhoneError("");
    setStep1Loading(true);
    setStep1Error("");
    try {
      const token = localStorage.getItem("skydeed_token");
      const res = await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStep(2);
    } catch {
      setStep1Error("Failed to save. Please try again.");
    } finally {
      setStep1Loading(false);
    }
  }

  // ── Step 2 handler ───────────────────────────────────────

  async function handleStep2() {
    const errors: Record<string, string> = {};
    if (!plotName.trim()) errors.name = "Plot name required";
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (!lat.trim() || isNaN(latNum) || latNum < -90 || latNum > 90)
      errors.lat = "Valid latitude required (−90 to 90)";
    if (!lon.trim() || isNaN(lonNum) || lonNum < -180 || lonNum > 180)
      errors.lon = "Valid longitude required (−180 to 180)";
    if (Object.keys(errors).length > 0) {
      setPlotErrors(errors);
      return;
    }
    setPlotErrors({});
    setStep2Loading(true);
    setStep2Error("");
    try {
      const token = localStorage.getItem("skydeed_token");
      const res = await fetch(`${API_URL}/plots/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: plotName, lat: latNum, lon: lonNum }),
      });
      if (!res.ok) throw new Error("Failed to register plot");
      setStep(3);
    } catch {
      setStep2Error("Failed to register plot. Please try again.");
    } finally {
      setStep2Loading(false);
    }
  }

  // ── Razorpay handler (INR) ───────────────────────────────

  async function handleRazorpay(planKey: string) {
    const token = localStorage.getItem("skydeed_token");
    try {
      const res = await fetch(`${API_URL}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planKey }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { detail?: string };
        setStep3Error(err.detail ?? "Payment setup failed");
        setStep3Loading(false);
        return;
      }
      const order = await res.json() as {
        key_id: string;
        amount: number;
        currency: string;
        plan_name: string;
        order_id: string;
      };
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "SkyDeed",
        description: order.plan_name,
        order_id: order.order_id,
        prefill: { name, email },
        theme: { color: "#c9a84c" },
        handler: function () {
          router.push("/dashboard?payment=success");
        },
        modal: {
          ondismiss: function () {
            setStep3Loading(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setStep3Error("Payment setup failed. Please try again.");
      setStep3Loading(false);
    }
  }

  // ── Step 3 handler ───────────────────────────────────────

  async function handleStep3() {
    const plan = PLANS.find((p) => p.key === selectedPlan);
    if (!plan) return;
    setStep3Loading(true);
    setStep3Error("");
    if (currency === "usd") {
      try {
        await handleStripeCheckout(plan.stripePriceId);
      } catch {
        setStep3Error("Payment setup failed. Please try again.");
        setStep3Loading(false);
      }
    } else {
      await handleRazorpay(plan.key);
    }
  }

  // ── Auth loading screen ───────────────────────────────────

  if (checkingAuth) {
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
        Checking your account…
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--navy-900)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%" }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <SatelliteLogo size={40} />
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* ── STEP 1 ─────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "32px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Confirm your details
            </h1>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "28px",
              }}
            >
              We use this to send your satellite alerts.
            </p>

            <Field
              label="WhatsApp / Phone Number"
              value={phone}
              onChange={setPhone}
              placeholder="+1 (555) 000-0000"
              error={phoneError}
              helper="Include country code. US: +1, India: +91"
            />

            {step1Error && (
              <p style={{ color: "#e05555", fontSize: "13px", marginBottom: "12px" }}>
                {step1Error}
              </p>
            )}

            <button
              onClick={handleStep1}
              disabled={step1Loading}
              className="btn-gold"
              style={{ width: "100%", justifyContent: "center", opacity: step1Loading ? 0.7 : 1 }}
            >
              {step1Loading ? <><Spinner /> Saving…</> : "Continue"}
            </button>
          </div>
        )}

        {/* ── STEP 2 ─────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "32px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Register your first plot
            </h1>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "28px",
              }}
            >
              Tell us exactly where your land is.
            </p>

            <Field
              label="Plot Name"
              value={plotName}
              onChange={setPlotName}
              placeholder="e.g. Nanna Farm"
              error={plotErrors.name}
            />

            {/* Coordinates */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <label
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--text-muted)",
                  }}
                >
                  GPS Coordinates
                </label>
                <a
                  href="https://support.google.com/maps/answer/18539"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "12px",
                    color: "var(--gold)",
                    textDecoration: "none",
                  }}
                >
                  How to find these →
                </a>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="16.321966"
                    style={{
                      width: "100%",
                      background: "var(--navy-800)",
                      border: `1px solid ${plotErrors.lat ? "#e05555" : "var(--border)"}`,
                      borderRadius: "4px",
                      padding: "10px 14px",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {plotErrors.lat && (
                    <p style={{ fontSize: "11px", color: "#e05555", marginTop: "4px" }}>
                      {plotErrors.lat}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    placeholder="80.667474"
                    style={{
                      width: "100%",
                      background: "var(--navy-800)",
                      border: `1px solid ${plotErrors.lon ? "#e05555" : "var(--border)"}`,
                      borderRadius: "4px",
                      padding: "10px 14px",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {plotErrors.lon && (
                    <p style={{ fontSize: "11px", color: "#e05555", marginTop: "4px" }}>
                      {plotErrors.lon}
                    </p>
                  )}
                </div>
              </div>

              {/* Helper box */}
              <div
                style={{
                  marginTop: "10px",
                  background: "var(--navy-700)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  padding: "12px 16px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    lineHeight: "1.7",
                    margin: 0,
                    whiteSpace: "pre-line",
                  }}
                >
                  {"1. Open Google Maps on your phone\n2. Navigate to your land\n3. Long press on the exact location\n4. Copy the numbers that appear at the bottom"}
                </p>
              </div>
            </div>

            {step2Error && (
              <p style={{ color: "#e05555", fontSize: "13px", marginBottom: "12px" }}>
                {step2Error}
              </p>
            )}

            <button
              onClick={handleStep2}
              disabled={step2Loading}
              className="btn-gold"
              style={{ width: "100%", justifyContent: "center", opacity: step2Loading ? 0.7 : 1 }}
            >
              {step2Loading ? <><Spinner /> Registering…</> : "Register Plot"}
            </button>

            {/* Legal disclaimer — mandatory, do not remove */}
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "11px",
                color: "var(--text-muted)",
                textAlign: "center",
                padding: "12px 0 0",
                lineHeight: "1.6",
              }}
            >
              By registering this plot, you confirm you own or have legal authority
              to monitor this property. Coordinates are monitored as entered —
              accuracy is your responsibility. SkyDeed is not liable for incorrectly
              entered property details.
            </p>
          </div>
        )}

        {/* ── STEP 3 ─────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "32px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Start monitoring
            </h1>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "24px",
              }}
            >
              Less than the cost of one legal consultation.
            </p>

            {/* Currency toggle */}
            <div
              style={{
                display: "inline-flex",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "20px",
              }}
            >
              {(["usd", "inr"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  style={{
                    padding: "7px 20px",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "13px",
                    fontWeight: currency === c ? 500 : 400,
                    background: currency === c ? "var(--gold)" : "transparent",
                    color: currency === c ? "var(--navy-900)" : "var(--gold)",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {c === "usd" ? "USD $" : "INR ₹"}
                </button>
              ))}
            </div>

            {/* Plan cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.key;
                return (
                  <div
                    key={plan.key}
                    onClick={() => setSelectedPlan(plan.key)}
                    className="card"
                    style={{
                      padding: "20px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      border: isSelected
                        ? "1px solid var(--gold)"
                        : "1px solid var(--border)",
                      background: isSelected
                        ? "rgba(201,168,76,0.05)"
                        : "var(--bg-card)",
                      position: "relative",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    {plan.popular && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "16px",
                          fontFamily: "var(--font-dm-mono)",
                          fontSize: "9px",
                          letterSpacing: "0.1em",
                          background: "linear-gradient(135deg, var(--gold-600), var(--gold-500))",
                          color: "var(--navy-900)",
                          padding: "2px 8px",
                          borderRadius: "2px",
                        }}
                      >
                        POPULAR
                      </span>
                    )}
                    {/* Top row */}
                    <div
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "var(--text-primary)",
                        }}
                      >
                        {plan.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-dm-mono)",
                          fontSize: "22px",
                          color: "var(--gold-400)",
                        }}
                      >
                        {currency === "usd" ? plan.usdPrice : plan.inrPrice}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                          }}
                        >
                          /mo
                        </span>
                      </span>
                    </div>
                    {/* Tagline */}
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        marginBottom: "10px",
                      }}
                    >
                      {plan.tagline}
                    </p>
                    {/* Features */}
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "6px",
                            marginBottom: "3px",
                          }}
                        >
                          <span style={{ color: "var(--gold-600)", marginTop: "1px" }}>–</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {step3Error && (
              <p style={{ color: "#e05555", fontSize: "13px", marginBottom: "12px" }}>
                {step3Error}
              </p>
            )}

            <button
              onClick={handleStep3}
              disabled={step3Loading}
              className="btn-gold"
              style={{ width: "100%", justifyContent: "center", opacity: step3Loading ? 0.7 : 1 }}
            >
              {step3Loading ? <><Spinner /> Processing…</> : "Start Monitoring"}
            </button>

            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "11px",
                color: "var(--text-muted)",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              Cancel anytime · No setup fees
            </p>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <GhostBtn onClick={() => router.push("/dashboard")}>
                Skip for now, explore free →
              </GhostBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
