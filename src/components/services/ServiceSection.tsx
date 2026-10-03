import type { ServiceItem } from "./servicesData";

export function ServiceSection({ service }: { service: ServiceItem }) {
  return (
    <article
      id={service.id}
      className="scroll-mt-12 min-h-[28rem] lg:min-h-[32rem]"
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
    </article>
  );
}
