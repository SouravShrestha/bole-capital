import type { Metadata } from "next";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "Bole Capital - Coming Soon",
  description:
    "We are almost there! Get notified when the Bole Capital website goes live.",
  keywords: ["Bole Capital", "coming soon", "investment", "capital"],
  openGraph: {
    title: "Bole Capital - Coming Soon",
    description: "Get notified when the Bole Capital website goes live.",
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
        className={`${uberMoveBold.variable} ${uberMoveMedium.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
