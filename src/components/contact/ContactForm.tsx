"use client";

import { useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";

const MAX_MESSAGE_LENGTH = 300;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const FIELDS: { name: keyof FormState; label: string; type: string }[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email (optional)", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "message", label: "Message", type: "textarea" },
];

const EMPTY_FORM: FormState = { name: "", email: "", phone: "", message: "" };

function validateField(name: keyof FormState, value: string): string {
  const trimmed = value.trim();
  switch (name) {
    case "name":
      return trimmed ? "" : "Name is required.";
    case "email":
      return trimmed && !EMAIL_REGEX.test(trimmed)
        ? "Enter a valid email address."
        : "";
    case "phone":
      if (!trimmed) return "Phone number is required.";
      return trimmed.replace(/\D/g, "").length < 7
        ? "Enter a valid phone number."
        : "";
    case "message":
      if (!trimmed) return "Message is required.";
      return value.length > MAX_MESSAGE_LENGTH
        ? `Message must be under ${MAX_MESSAGE_LENGTH} characters.`
        : "";
  }
}

const inputClassName =
  "w-full rounded-lg px-4 py-3 text-sm outline-none border border-transparent focus:border-[#1DB954] transition-colors disabled:opacity-60";

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name as keyof FormState;
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, e.target.value),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name as keyof FormState;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, form[name]) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors: FormErrors = {};
    FIELDS.forEach(({ name }) => {
      const error = validateField(name, form[name]);
      if (error) validationErrors[name] = error;
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 429) {
        const seconds = parseInt(res.headers.get("Retry-After") ?? "60", 10);
        setStatus({
          type: "error",
          text: `Too many submissions. Please wait ${seconds} second${seconds !== 1 ? "s" : ""} before trying again.`,
        });
        return;
      }
      if (!res.ok) throw new Error();

      setStatus({ type: "success", text: "Thank you! We'll be in touch soon." });
      setForm(EMPTY_FORM);
    } catch {
      setStatus({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 w-full"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      {FIELDS.map(({ name, label, type }) => (
        <label key={name} className="flex flex-col gap-2 text-sm">
          <span className="flex items-center justify-between gap-2">
            <span>{label}</span>
            {errors[name] && (
              <span className="text-xs text-red-500">{errors[name]}</span>
            )}
          </span>
          {type === "textarea" ? (
            <>
              <textarea
                name={name}
                rows={5}
                value={form[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`${inputClassName} resize-none`}
                style={{ backgroundColor: "var(--input)", color: "var(--fg)" }}
              />
              <span className="text-xs opacity-50 self-end">
                {form.message.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </>
          ) : (
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={inputClassName}
              style={{ backgroundColor: "var(--input)", color: "var(--fg)" }}
            />
          )}
        </label>
      ))}

      {status && (
        <p
          role="status"
          className={`text-sm rounded-lg px-4 py-3 ${
            status.type === "success"
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {status.text}
        </p>
      )}

      <div>
        <IconButton
          type="submit"
          disabled={loading}
          icon={<ChevronRightIcon />}
          className="disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send message"}
        </IconButton>
      </div>
    </form>
  );
}
