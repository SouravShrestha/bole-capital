import { ServiceSection } from "./ServiceSection";
import { ServicesMenu } from "./ServicesMenu";
import { services } from "./servicesData";

export function ServicesList() {
  return (
    <section
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
      className="w-full"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 pb-16 sm:pb-24 md:pb-32 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-16">
        <ServicesMenu />
        <div className="flex flex-col gap-16 lg:gap-24 max-w-2xl">
          {services.map((service) => (
            <ServiceSection key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
