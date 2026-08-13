"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoIcon } from "@/icons/LogoIcon";
import { SunIcon } from "@/icons/SunIcon";
import { MoonIcon } from "@/icons/MoonIcon";
import { EmailIcon } from "@/icons/EmailIcon";
import { WhatsappIcon } from "@/icons/WhatsappIcon";
import { InstagramIcon } from "@/icons/InstagramIcon";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount flag needed to avoid hydration mismatch before reading localStorage
    setMounted(true);
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setEmailError("");
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        const seconds = retryAfter ? parseInt(retryAfter, 10) : 60;
        setEmailError(
          `Too many submissions. Please wait ${seconds} second${seconds !== 1 ? "s" : ""} before trying again.`
        );
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setEmailError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="flex flex-col h-dvh max-h-dvh overflow-hidden px-8 md:px-48 py-8 md:py-10"
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
    >
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="Bole Capital Home" style={{ color: "var(--fg)" }}>
          <LogoIcon className="shrink-0 w-[28px] h-[28px] md:w-9 md:h-9" />
          <span
            className="text-sm font-bold leading-tight"
            style={{ fontFamily: "var(--font-uber-bold), sans-serif" }}
          >
            Bole
            <br />
            Capital
          </span>
        </Link>

        <button
          type="button"
          className="bg-transparent border-none cursor-pointer flex items-center justify-center transition-opacity hover:opacity-70 w-11 h-11 -mr-2.5"
          style={{ color: "var(--fg)" }}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <SunIcon width={20} height={20}/> : <MoonIcon width={20} height={20}/>}
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col justify-center flex-1 min-h-0 overflow-hidden py-10 max-w-xl -mt-12 md:-mt-20">
        <p
          className="text-sm tracking-widest uppercase mb-2"
          style={{ fontFamily: "var(--font-uber-medium), sans-serif", color: "var(--fg)" }}
        >
          Coming Soon
        </p>
        <p
          className="text-sm md:text-base leading-relaxed mb-10 opacity-80 mt-4 tracking-wider w-[90%] md:w-full"
          style={{ fontFamily: "var(--font-uber-medium), sans-serif", color: "var(--fg)" }}
        >
          We are almost there! If you want to get notified when   the website goes live, subscribe to our mailing list!
        </p>

        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight mb-10"
          style={{ fontFamily: "var(--font-uber-bold), sans-serif", color: "var(--fg)" }}
        >
          Get notified when
          <br />
          we launch
        </h1>

        {submitted ? (
          <p
            className="text-sm opacity-80 py-3 flex items-center md:h-14 h-12 tracking-wider"
            style={{ fontFamily: "var(--font-uber-medium), sans-serif", color: "var(--fg)" }}
          >
            ❥ Thank you! We&apos;ll notify you when we launch.
          </p>
        ) : (
          <form className="flex flex-col gap-2 md:h-14 h-12" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-wrap gap-3">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                className="flex-1 px-4 py-3 text-base outline-none transition-opacity placeholder:opacity-45 max-w-96 placeholder:tracking-wider tracking-wider disabled:opacity-60 md:h-14 h-12"
                style={{
                  backgroundColor: "var(--input)",
                  borderColor: "var(--fg)",
                  color: "var(--fg)",
                  fontFamily: "var(--font-uber-medium), sans-serif",
                }}
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                disabled={loading}
                required
                aria-label="Email address"
                aria-invalid={!!emailError}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 border-none cursor-none text-sm font-bold whitespace-nowrap transition-opacity hover:opacity-85 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed md:h-14 h-12"
                style={{
                  backgroundColor: "var(--fg)",
                  color: "var(--bg)",
                  fontFamily: "var(--font-uber-bold), sans-serif",
                }}
              >
                {loading ? "Sending..." : "Notify Me!"}
              </button>
            </div>
              <p
                className="text-xs opacity-80 mt-2"
                style={{ fontFamily: "var(--font-uber-medium), sans-serif", color: "var(--fg)" }}
              >
                {emailError || "\u00A0"}
              </p>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="flex items-center gap-5 pt-6">
        <a
          href="mailto:hello@bolecapital.in"
          aria-label="Email Bole Capital"
          className="flex items-center transition-opacity hover:opacity-65"
          style={{ color: "var(--fg)" }}
        >
          <EmailIcon width={20} height={20}/>
        </a>
        <a
          href="https://wa.me/917827301069"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Bole Capital"
          className="flex items-center transition-opacity hover:opacity-65"
          style={{ color: "var(--fg)" }}
        >
          <WhatsappIcon width={20} height={20}/>
        </a>
        <a
          href="https://www.instagram.com/bolecapital"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram Bole Capital"
          className="flex items-center transition-opacity hover:opacity-65 active:opacity-65"
          style={{ color: "var(--fg)" }}
        >
          <InstagramIcon width={20} height={20}/>
        </a>
      </footer>
    </main>
  );
}
