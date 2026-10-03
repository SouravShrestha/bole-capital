import { ShineIcon } from "@/icons/ShineIcon";

const PILLARS = [0, 1, 2];

export function PhilosophySection() {
  return (
    <section className="py-8 sm:py-16 px-5 sm:px-8 md:px-12 lg:px-24 mx-auto w-full mt-4 sm:mt-6">
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-medium mb-12 sm:mb-16"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Our{" "}
        <span className="relative inline-block">
          philosophy
          <ShineIcon
            className="absolute left-1/2 top-1/2 -translate-x-1/3 -translate-y-1/2 w-[80%] max-w-none h-auto text-(--fg)"
            color="currentColor"
          />
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-14">
        {PILLARS.map((pillar) => (
          <div
            key={pillar}
            className="aspect-square rounded-2xl sm:rounded-3xl bg-(--fg)/4"
          />
        ))}
      </div>
    </section>
  );
}
