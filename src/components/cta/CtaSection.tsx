"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";

export function CtaSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setFormData({ name: "", email: "", phone: "" });
    } catch {
      setStatus("error");
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name *"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full py-3.5 px-4 border-[1.5px] border-gray-300 rounded-lg text-sm text-[#111] bg-transparent font-poppins transition-all outline-none placeholder:text-gray-400 focus:border-[#2d6b4a] focus:ring-[3px] focus:ring-[#2d6b4a]/10"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full py-3.5 px-4 border-[1.5px] border-gray-300 rounded-lg text-sm text-[#111] bg-transparent font-poppins transition-all outline-none placeholder:text-gray-400 focus:border-[#2d6b4a] focus:ring-[3px] focus:ring-[#2d6b4a]/10"
            />
            <input
              type="tel"
              placeholder="Phone *"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full py-3.5 px-4 border-[1.5px] border-gray-300 rounded-lg text-sm text-[#111] bg-transparent font-poppins transition-all outline-none placeholder:text-gray-400 focus:border-[#2d6b4a] focus:ring-[3px] focus:ring-[#2d6b4a]/10"
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

          {status === "success" && (
            <p className="mt-3 text-[0.85rem] text-center text-[#22a352]">
              Thank you! We&rsquo;ll be in touch shortly.
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-[0.85rem] text-center text-red-600">
              Something went wrong. Please try again.
            </p>
          )}

          <div className="mt-6 flex flex-col items-center gap-0.5 text-[0.72rem] text-[#888] text-center">
            <span>Your information is kept private & never shared.</span>
            <span>
              Read our{" "}
              <a
                href="/privacy-policy"
                className="text-[#111] underline underline-offset-2 transition-colors hover:text-[#2d6b4a] hover:cursor-pointer"
              >
                Privacy Policy.
              </a>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
