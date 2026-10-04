import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaGate } from "@/components/cta/CtaGate";
import { Footer } from "@/components/footer/Footer";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const uberMoveBold = localFont({
  src: "./fonts/ubermovebold.otf",
  variable: "--font-uber-bold",
  display: "swap",
});

const uberMoveMedium = localFont({
  src: "./fonts/ubermovemdeium.otf",
  variable: "--font-uber-medium",
  display: "swap",
});

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
  title: "Bole Capital",
  description:
    "Bole Capital helps individuals and families build and protect wealth through a disciplined, long-term approach.",
  keywords: ["Bole Capital", "investment", "mutual funds", "wealth management"],
  openGraph: {
    title: "Bole Capital",
    description:
      "Bole Capital helps individuals and families build and protect wealth through a disciplined, long-term approach.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${uberMoveBold.variable} ${uberMoveMedium.variable} ${poppins.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
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
          <Navbar />
          {children}
          <CtaGate />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
