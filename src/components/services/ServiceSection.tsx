import type { ServiceItem } from "./servicesData";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";

export function ServiceSection({ service }: { service: ServiceItem }) {
  return (
    <article
      id={service.id}
      className="scroll-mt-6 sm:scroll-mt-12 min-h-112 lg:min-h-128"
    >
      <h2 className="text-2xl sm:text-3xl font-medium leading-tight">
        {service.title}{" "}
        <span className="block sm:inline mt-1 sm:mt-0 text-sm font-normal opacity-50">
          {service.tagline}
        </span>
      </h2>

      <p className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed opacity-90">
        {service.description}
      </p>

      <div
        className="mt-6 h-px w-full"
        style={{ backgroundColor: "var(--card-border)" }}
      />

      <ul className="mt-6 flex flex-col gap-5">
        {service.points.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-4 text-sm">
            <Icon className="w-4 h-4 shrink-0" />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 text-right sm:text-left">
        <Link
          href={`/contact?message=${encodeURIComponent(`I would like to know about ${service.title}`)}`}
          className="inline-flex items-center gap-1 text-[#1DB954] hover:underline text-xs tracking-wide"
        >
          Know more
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {service.image && (
        <div className="mt-16 mb-10 overflow-hidden px-6 sm:px-12 py-4 bg-(--surface) rounded-xl sm:rounded-2xl md:rounded-2xl w-full sm:w-[80%] border border-(--card-border)">
          <Image
            src={service.image}
            alt={service.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
    </article>
  );
}
