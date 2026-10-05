import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center">
      <h1
        className="text-6xl md:text-7xl"
        style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
      >
        404
      </h1>
      <h2
        className="mt-6 text-lg md:text-xl"
        style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
      >
        Page Not Found
      </h2>
      <p
        className="mt-6 max-w-md text-sm leading-relaxed md:text-base"
        style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
      >
        Sorry, the page you are looking for does not exist.
        <br />
        You can go back to the{" "}
        <Link
          href="/"
          className="border-b border-current pb-px transition-opacity hover:opacity-70"
        >
          homepage
        </Link>
        .
      </p>
    </main>
  );
}
