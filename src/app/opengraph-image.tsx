import { ImageResponse } from "next/og";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/icons/LogoIcon";
import { COMPLIANCE } from "@/lib/compliance";

// Shared social preview (WhatsApp, LinkedIn, X). Statically generated at build time.
export const alt = "Bole Capital, AMFI-registered Mutual Fund Distributor in Dhanbad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0E0E0E";
const FG = "#FAFAFA";
const GREEN = "#22a352";

export default function OpengraphImage() {
  const logoHeight = 132;
  const logoWidth = Math.round((LOGO_VIEWBOX.width / LOGO_VIEWBOX.height) * logoHeight);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          color: FG,
          background: `linear-gradient(135deg, ${BG} 0%, ${BG} 45%, #1a3a2a 75%, #2d6b4a 100%)`,
        }}
      >
        <svg
          width={logoWidth}
          height={logoHeight}
          viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
        >
          {LOGO_PATHS.map((d) => (
            <path key={d} d={d} fill={FG} />
          ))}
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.15, maxWidth: 900 }}>
            Build and protect wealth with a disciplined, long-term plan.
          </div>
          <div style={{ display: "flex", fontSize: 28, opacity: 0.75 }}>
            Mutual funds · Portfolio review · Goal-based investing · NPS
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: GREEN }} />
          <div style={{ display: "flex", opacity: 0.85 }}>
            {`AMFI-registered Mutual Fund Distributor · ${COMPLIANCE.arn} · Dhanbad`}
          </div>
        </div>
      </div>
    ),
    size
  );
}
