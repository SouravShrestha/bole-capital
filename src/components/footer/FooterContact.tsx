import Link from "next/link";
import { WhatsappIcon } from "@/icons/WhatsappIcon";
import { InstagramIcon } from "@/icons/InstagramIcon";
import { LinkedinIcon } from "@/icons/LinkedinIcon";

const SOCIAL_LINKS = [
  {
    label: "WhatsApp",
    href: "https://wa.me/919971301069",
    Icon: WhatsappIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/bolecapital",
    Icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/bolecapital",
    Icon: LinkedinIcon,
  },
];

export function FooterContact() {
  return (
    <div className="flex flex-col gap-4">
      <h3
        className="text-xs tracking-widest opacity-50"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        Contact
      </h3>

      <div
        className="flex flex-col gap-4 mt-2"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <Link
          href="/contact"
          className="text-sm no-underline opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: "var(--fg)" }}
        >
          Start a conversation
        </Link>

        <a
          href="mailto:hello@bolecapital.in"
          className="text-sm no-underline opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: "var(--fg)" }}
        >
          hello@bolecapital.in
        </a>

        <a
          href="tel:+919971301069"
          className="text-sm no-underline opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: "var(--fg)" }}
        >
          +91 9971301069
        </a>

        <address className="text-sm opacity-70 not-italic leading-6">
          Bank More, Dhanbad,
          <br />
          Jharkhand, India
          <br />
          826001
        </address>
      </div>

      <div className="flex items-center gap-4 mt-4">
        {SOCIAL_LINKS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} - Bole Capital`}
            className="flex items-center justify-center transition-opacity opacity-80 hover:opacity-100"
            style={{ color: "var(--fg)" }}
          >
            <Icon width={22} height={22} />
          </a>
        ))}
      </div>
    </div>
  );
}
