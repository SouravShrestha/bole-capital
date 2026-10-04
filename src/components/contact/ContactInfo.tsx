import { WhatsappIcon } from "@/icons/WhatsappIcon";
import { InstagramIcon } from "@/icons/InstagramIcon";
import { LinkedinIcon } from "@/icons/LinkedinIcon";

const SOCIAL_LINKS = [
  { label: "WhatsApp", href: "https://wa.me/919971301069", Icon: WhatsappIcon },
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

const linkClassName =
  "text-sm no-underline opacity-90 hover:opacity-100 hover:underline transition-opacity";

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xs tracking-widest opacity-50 uppercase">{label}</h2>
      {children}
    </div>
  );
}

export function ContactInfo() {
  return (
    <div
      className="flex flex-col gap-8"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <InfoBlock label="Email">
        <a href="mailto:hello@bolecapital.in" className={linkClassName}>
          hello@bolecapital.in
        </a>
      </InfoBlock>

      <InfoBlock label="Phone">
        <a href="tel:+919971301069" className={linkClassName}>
          +91 9971301069
        </a>
      </InfoBlock>

      <InfoBlock label="Address">
        <address className="text-sm opacity-90 not-italic leading-6">
          Dhanbad,
          <br />
          Jharkhand, India
          <br />
          826001
        </address>
      </InfoBlock>

      <InfoBlock label="Social">
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} - Bole Capital`}
              className="flex items-center justify-center transition-opacity opacity-80 hover:opacity-100"
            >
              <Icon width={22} height={22} />
            </a>
          ))}
        </div>
      </InfoBlock>
    </div>
  );
}
