"use client";

import { usePathname } from "next/navigation";
import { CtaSection } from "./CtaSection";

const HIDDEN_ON = ["/contact"];

export function CtaGate() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;
  return <CtaSection />;
}
