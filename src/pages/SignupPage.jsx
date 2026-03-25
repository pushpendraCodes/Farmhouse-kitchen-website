import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

// ── Validation helpers ─────────────────────────────────────────────────────
const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateMobile(val) {
  if (!val) return "Mobile Number Required";
  if (!/^[6-9]/.test(val)) return "Must start with 6, 7, 8, or 9.";
  if (/\D/.test(val)) return "Only digits allowed.";
  if (val.length < 10) return `${10 - val.length} more digit(s) needed.`;
  if (val.length > 10) return "Mobile number must be exactly 10 digits.";
  return "";
}

function validateEmail(val) {
  if (!val) return "";
  return EMAIL_RE.test(val) ? "" : "Enter a valid email address (e.g. user@example.com).";
}

// ── 6-box OTP input ────────────────────────────────────────────────────────
function OtpInput({ value, onChange, disabled }) {
  const inputs = useRef([]);

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      if (value[idx]) {
        const next = value.split("");
        next[idx] = "";
        onChange(next.join(""));
      } else if (idx > 0) {
        inputs.current[idx - 1].focus();
      }
    }
  };

  const handleChange = (e, idx) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[idx] = char;
    onChange(next.join(""));
    if (char && idx < 5) inputs.current[idx + 1].focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, ""));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          className={[
            "w-11 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500",
            value[i]
              ? "border-amber-500 bg-amber-50 text-amber-700"
              : "border-gray-300 bg-white text-gray-800",
            disabled ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ── Countdown hook ─────────────────────────────────────────────────────────
function useCountdown() {
  const [seconds, setSeconds] = useState(0);
  const timer = useRef(null);
  const start = (s) => {
    setSeconds(s);
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setSeconds((p) => {
        if (p <= 1) {
          clearInterval(timer.current);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  };
  useEffect(() => () => clearInterval(timer.current), []);
  return { seconds, start };
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", mobile: "", email: "", address: "" });
  const [fieldErrors, setFieldErrors] = useState({ name: "", mobile: "", email: "", address: "" });

  // "idle" | "sending" | "awaiting" | "verifying" | "verified"
  const [otpState, setOtpState] = useState("idle");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // DEV: display OTP returned from API for testing
  const [devOtp, setDevOtp] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", ok: true });

  const { seconds, start: startCountdown } = useCountdown();

  const isVerified = otpState === "verified";
  const canSubmit =
    isVerified &&
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    !fieldErrors.email &&
    form.address.trim() !== "" &&
    !submitting;

  // ── field change ──────────────────────────────────────────────────────
  const handleField = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: val }));

    if (field === "mobile") {
      // any change resets OTP flow
      setOtpState("idle");
      setOtp("");
      setOtpError("");
      setDevOtp("");
      setFieldErrors((fe) => ({ ...fe, mobile: validateMobile(val) }));
    } else if (field === "email") {
      setFieldErrors((fe) => ({ ...fe, email: validateEmail(val) }));
    } else {
      setFieldErrors((fe) => ({ ...fe, [field]: "" }));
    }
  };

  // block non-digit keypresses in mobile field
  const handleMobileKeyDown = (e) => {
    const passthrough = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (!passthrough.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // ── send OTP ────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    const phone = form.mobile.trim();
    const err = validateMobile(phone);
    if (err) {
      setFieldErrors((fe) => ({ ...fe, mobile: err }));
      return;
    }
    setOtpState("sending");
    setOtpError("");
    setDevOtp("");
    try {
      const { data } = await axios.post(
        `${API}/api/customer/auth/send-register-otp`,
        { phone }
      );
      if (data.success) {
        setOtpState("awaiting");
        startCountdown(60);
        // DEV: show OTP on screen if backend returns it
        if (data.otp) setDevOtp(String(data.otp));
      } else {
        setOtpError(data.message || "Failed to send OTP.");
        setOtpState("idle");
      }
    } catch (err) {
      console.log(err, "Err")
      setOtpError(err.response?.data?.message || "Could not send OTP. Try again.");
      setOtpState("idle");
    }
  };

  // ── verify OTP ──────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setOtpError("Enter all 6 digits.");
      return;
    }
    setOtpState("verifying");
    setOtpError("");
    try {
      const { data } = await axios.post(
        `${API}/api/customer/auth/verify-register-otp`,
        { phone: form.mobile.trim(), otp }
      );
      if (data.success) {
        setOtpState("verified");
        setDevOtp("");
      } else {
        setOtpError(data.message || "Invalid OTP.");
        setOtpState("awaiting");
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || "Verification failed.");
      setOtpState("awaiting");
    }
  };

  // ── resend OTP ──────────────────────────────────────────────────────────
  const handleResend = async () => {
    setOtp("");
    setOtpError("");
    setDevOtp("");
    setOtpState("sending");
    try {
      const { data } = await axios.post(
        `${API}/api/customer/auth/resend-otp`,
        { phone: form.mobile.trim() }
      );
      if (data.success) {
        setOtpState("awaiting");
        startCountdown(60);
        if (data.otp) setDevOtp(String(data.otp)); // DEV only
      } else {
        setOtpError(data.message || data.error || "Failed to resend OTP.");
        setOtpState("awaiting"); // keep panel open so user sees the error
      }
    } catch (err) {
      // 429 = rate-limited — show the server message
      setOtpError(err.response?.data?.error || "Could not resend OTP. Try again.");
      setOtpState("awaiting");
    }
  };

  // ── register ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // final sanity checks
    const emailErr = validateEmail(form.email.trim());
    if (emailErr) {
      setFieldErrors((fe) => ({ ...fe, email: emailErr }));
      return;
    }

    setSubmitting(true);
    setMessage({ text: "", ok: true });
    try {
      const { data } = await axios.post(`${API}/api/customer/auth/register`, {
        fullName: form.name.trim(),
        phone: form.mobile.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
      });
      if (data.success) {
        setMessage({ text: "Account created successfully! Redirecting…", ok: true });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.customer));



        // Store login timestamp for auto-logout (7 days)
        localStorage.setItem("loginTime", Date.now().toString());

        // setMessage({ type: "success", text: "Login successful! Redirecting..." });
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage({ text: data.message || "Signup failed.", ok: false });
      }
    } catch (err) {
      console.log(err)
      setMessage({ text: err.response?.data?.message || "Server error.", ok: false });
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Hero */}
      <section
        className="relative max-w-7xl mx-auto text-white py-32 overflow-hidden min-h-[400px]"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">Sign Up</h1>
        </div>
      </section>

      {/* Form */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-amber-600 mb-2 text-center">Create Account</h2>
          <p className="text-gray-500 text-center mb-6">
            Book a table and access exclusive features!
          </p>

          {/* ── DEV OTP banner (remove in production) ── */}
          {devOtp && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border-2 border-dashed border-orange-400 bg-orange-50 px-4 py-3">
              <span className="text-2xl">🛠️</span>
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-0.5">
                  Dev Mode · OTP (remove in production)
                </p>
                <p className="text-3xl font-black tracking-[0.35em] text-orange-700 font-mono">
                  {devOtp}
                </p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Name */}
            <Field label="Name" error={fieldErrors.name}>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleField("name")}
                className={inputCls()}
                required
              />
            </Field>

            {/* Mobile + Get OTP inline */}
            <Field label="Mobile" error={fieldErrors.mobile}>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={handleField("mobile")}
                  onKeyDown={handleMobileKeyDown}
                  maxLength={10}
                  disabled={isVerified}
                  className={inputCls(
                    isVerified
                      ? "bg-green-50 border-green-400 text-green-700 cursor-not-allowed"
                      : fieldErrors.mobile
                        ? "border-red-400 focus:ring-red-400"
                        : ""
                  )}
                  required
                />

                {!isVerified ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={
                      otpState === "sending" ||
                      otpState === "awaiting" ||
                      otpState === "verifying"
                    }
                    className="shrink-0 px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-sm font-semibold transition whitespace-nowrap"
                  >
                    {otpState === "sending" ? (
                      <span className="flex items-center gap-1">
                        <Spinner /> Sending…
                      </span>
                    ) : otpState === "awaiting" || otpState === "verifying" ? (
                      "Sent ✓"
                    ) : (
                      "Get OTP"
                    )}
                  </button>
                ) : (
                  <span className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-md bg-green-100 text-green-700 text-sm font-semibold border border-green-300">
                    <CheckIcon />
                    Verified
                  </span>
                )}
              </div>
            </Field>
            {otpError && (
              <p className="text-center text-sm text-red-500 font-medium">{otpError}</p>
            )}
            {/* OTP panel — slides in after OTP is sent */}
            {(otpState === "awaiting" || otpState === "verifying") && (
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5 space-y-4 animate-fadeIn">
                <p className="text-sm text-center text-gray-600">
                  Enter the 6-digit OTP sent to{" "}
                  <span className="font-semibold text-amber-700">{form.mobile}</span>
                </p>

                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  disabled={otpState === "verifying"}
                />



                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 6 || otpState === "verifying"}
                  className="w-full mt-2 py-2.5 rounded-md bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold transition flex items-center justify-center gap-2"
                >
                  {otpState === "verifying" ? (
                    <><Spinner /> Verifying…</>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <p className="text-center text-xs text-gray-500">
                  {seconds > 0 ? (
                    <>
                      Resend in{" "}
                      <span className="font-semibold text-amber-600">{seconds}s</span>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-amber-600 font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </div>
            )}

            {/* Email */}
            <Field label="Email" error={fieldErrors.email}>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleField("email")}
                className={inputCls(
                  fieldErrors.email ? "border-red-400 focus:ring-red-400" : ""
                )}
                required
              />
            </Field>

            {/* Address */}
            <Field label="Address" error={fieldErrors.address}>
              <textarea
                rows={3}
                placeholder="Enter your address"
                value={form.address}
                onChange={handleField("address")}
                className={inputCls()}
                required
              />
            </Field>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={!canSubmit}
                className={[
                  "w-full py-3 font-bold rounded-md text-lg shadow-lg transition-all duration-200",
                  canSubmit
                    ? "bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed",
                ].join(" ")}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner /> Creating…
                  </span>
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>

              {!isVerified && (
                <p className="text-center text-xs text-gray-400 mt-2">
                  Verify your mobile number to enable this button
                </p>
              )}
            </div>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>

          {message.text && (
            <p
              className={[
                "text-center font-medium mt-4",
                message.ok ? "text-green-600" : "text-red-500",
              ].join(" ")}
            >
              {message.ok ? "✅" : "❌"} {message.text}
            </p>
          )}
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease forwards; }
      `}</style>
    </>
  );
}

// ── Reusable tiny components ───────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-amber-600 mb-2">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

function inputCls(extra = "") {
  return [
    "w-full border border-amber-300 rounded-md px-4 py-3",
    "focus:outline-none focus:ring-2 focus:ring-amber-600",
    "text-gray-800 transition",
    extra,
  ].join(" ");
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}