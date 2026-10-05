"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { FORM_LIMITS, HONEYPOT_FIELD } from "@/lib/formLimits";
import { formatRetryMessage } from "@/lib/formMessages";

const INPUT_CLASS =
  "w-full py-3.5 px-4 border-[1.5px] border-gray-300 rounded-lg text-sm text-[#111] bg-transparent font-poppins transition-all outline-none placeholder:text-gray-500 focus:border-[#2d6b4a] focus:ring-[3px] focus:ring-[#2d6b4a]/10";

const SUCCESS_MESSAGE = "Thank you! We\u2019ll be in touch shortly.";
const ERROR_MESSAGE = "Something went wrong. Please try again.";

export function CtaSection() {
  const fieldId = useId();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/portfolio-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, [HONEYPOT_FIELD]: honeypot }),
      });

      if (res.status === 429) {
        setStatus("error");
        setMessage(formatRetryMessage(res.headers.get("Retry-After")));
        return;
      }
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage(SUCCESS_MESSAGE);
      setFormData({ name: "", email: "", phone: "" });
    } catch {
      setStatus("error");
      setMessage(ERROR_MESSAGE);
    }
  }

  return (
    <section className="w-full bg-linear-to-br from-[#0e0e0e] from-35% via-[#1a3a2a] via-65% to-[#2d6b4a] py-20 px-6 font-poppins">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center">
        {/* Left column */}
        <div>
          <RevealText className="font-poppins text-4xl sm:text-4xl lg:text-5xl text-[#fafafa] leading-[1.2] mb-5 font-medium">
            Start with a conversation
          </RevealText>
          <Reveal
            as="p"
            delay={250}
            className="text-[#fafafa]/60 text-base sm:text-lg leading-loose max-w-sm"
          >
            Share where you are today. We&rsquo;ll help you understand your
            portfolio and what to do next.
          </Reveal>
        </div>

        {/* Right column - form card */}
        <Reveal
          variant="right"
          delay={150}
          duration={1000}
          className="bg-[#fafafa] rounded-xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(14,14,14,0.25),0_0_40px_rgba(45,107,74,0.1)]">
          <h3 className="font-poppins text-xl sm:text-xl lg:text-2xl text-[#111] mb-4 md:mb-6">
            Let&rsquo;s make things happen.
          </h3>
          <p className="text-[0.85rem] text-[#666] leading-[1.6] mb-7">
            Share your goals and we&rsquo;ll show you where your money stands
            and how a clear plan could look.
          </p>

          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col gap-4"
            aria-describedby={`${fieldId}-consent`}
          >
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            {/* Visually hidden labels keep the placeholder-only design while giving screen readers a name. */}
            <label htmlFor={`${fieldId}-name`} className="sr-only">
              Name (required)
            </label>
            <input
              id={`${fieldId}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Name *"
              required
              maxLength={FORM_LIMITS.name}
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={INPUT_CLASS}
            />
            <label htmlFor={`${fieldId}-email`} className="sr-only">
              Email (optional)
            </label>
            <input
              id={`${fieldId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              maxLength={FORM_LIMITS.email}
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={INPUT_CLASS}
            />
            <label htmlFor={`${fieldId}-phone`} className="sr-only">
              Phone (required)
            </label>
            <input
              id={`${fieldId}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone *"
              required
              maxLength={FORM_LIMITS.phone}
              pattern="[0-9+\-\(\)\.\s]{7,}"
              title="Enter a valid phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className={INPUT_CLASS}
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-fit px-8 py-3.5 rounded-lg bg-[#22a352] text-[#fafafa] font-poppins text-sm font-medium transition-all mt-2 hover:bg-[#1d8d46] enabled:hover:cursor-pointer active:scale-[0.98] disabled:opacity-65 disabled:cursor-not-allowed tracking-wide self-center"
            >
              {status === "submitting"
                ? "Sending…"
                : "Book My Portfolio Review"}
            </button>
          </form>

          {/* Always mounted so screen readers announce changes to its content. */}
          <p
            role="status"
            aria-live="polite"
            className={`text-[0.85rem] text-center empty:hidden mt-3 ${
              status === "success" ? "text-[#1a7f40]" : "text-red-700"
            }`}
          >
            {message}
          </p>

          <div
            id={`${fieldId}-consent`}
            className="mt-6 flex flex-col items-center gap-0.5 text-[0.72rem] text-[#666] text-center"
          >
            <span>
              By submitting, you agree to be contacted by Bole Capital about
              your request.
            </span>
            <span>Your information is kept private &amp; never shared.</span>
            <span>
              Read our{" "}
              <Link
                href="/privacy-policy"
                className="text-[#111] underline underline-offset-2 transition-colors hover:text-[#2d6b4a] hover:cursor-pointer"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms-of-use"
                className="text-[#111] underline underline-offset-2 transition-colors hover:text-[#2d6b4a] hover:cursor-pointer"
              >
                Terms of Use
              </Link>
              .
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
