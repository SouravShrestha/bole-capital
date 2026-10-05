import { HONEYPOT_FIELD } from "@/lib/formLimits";

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Off-screen input that humans never see or reach (hidden from assistive tech
 * and skipped by Tab). Bots that auto-fill every field trip it, and the API
 * silently drops the submission.
 */
export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Do not fill
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          // Browsers often ignore "off"; an unknown token reliably disables autofill.
          autoComplete="bc-honeypot"
          // Opt out of password-manager autofill (1Password, LastPass, Bitwarden, Dashlane).
          data-1p-ignore=""
          data-lpignore="true"
          data-bwignore=""
          data-form-type="other"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
