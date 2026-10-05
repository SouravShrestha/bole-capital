import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/navbar/Navbar";
import { ScrollToTop } from "@/components/navbar/ScrollToTop";
import { CtaGate } from "@/components/cta/CtaGate";
import { Footer } from "@/components/footer/Footer";
import NextTopLoader from "nextjs-toploader";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  CONTACT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Mutual Fund Distributor in Dhanbad`,
    template: `%s - ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Bole Capital",
    "mutual fund distributor",
    "mutual funds Dhanbad",
    "SIP",
    "portfolio review",
    "goal-based investing",
    "NPS",
    "PMS",
    "SIF",
    "insurance",
    "wealth management",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FinancialService",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      image: `${SITE_URL}/icon.png`,
      description: SITE_DESCRIPTION,
      email: CONTACT.email,
      telephone: CONTACT.telephone,
      address: { "@type": "PostalAddress", ...CONTACT.address },
      areaServed: { "@type": "Country", name: "India" },
      sameAs: CONTACT.sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className={`${poppins.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        {/* Without JS the scroll-reveal observer never runs; show everything. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>[data-reveal],[data-reveal-text],[data-rt-word]{opacity:1!important;transform:none!important;filter:none!important}[data-reveal-text] svg{clip-path:none!important}</style>",
          }}
        />
        {/* Fixed page background; see .page-backdrop in globals.css */}
        <div className="page-backdrop" aria-hidden="true" />
        <JsonLd data={ORGANIZATION_JSON_LD} />
        <ThemeProvider>
          <NextTopLoader
            color="var(--fg)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow={false}
          />
          <ScrollToTop />
          <Navbar />
          {children}
          <CtaGate />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
