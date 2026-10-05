import Image from "next/image";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";
import letsMakeThingsHappenImg from "@/assets/images/lets-make-things-happen.png";
import { Float } from "@/components/motion/Float";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";

export function LetsMakeThingsHappenSection() {
  return (
    <section className="w-full px-5 sm:px-8 md:px-12 lg:px-24 pb-12 sm:pb-20 mt-20">
      <Reveal
        variant="scale"
        duration={1000}
        className="rounded-3xl bg-[#F5F5F5] dark:bg-[#1c1c1c] px-6 py-10 sm:px-12 sm:py-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <div className="flex flex-col items-start gap-5 max-w-xl">
          <RevealText
            delay={200}
            className="text-xl sm:text-3xl font-medium text-dark dark:text-light"
          >
            Let&rsquo;s make things happen
          </RevealText>
          <Reveal
            as="p"
            delay={400}
            className="text-sm sm:text-base leading-relaxed text-dark dark:text-light"
          >
            Let&rsquo;s make things happen. Whether you&rsquo;re starting your
            first SIP or rethinking a larger portfolio, a short conversation
            about your goals is the best place to begin.
          </Reveal>
          <Reveal delay={550}>
            <IconButton
              as="link"
              href="/contact"
              className="mt-3"
              style={{ backgroundColor: "#1DB954", color: "#fafafa" }}
              icon={<ChevronRightIcon />}
            >
              Start a conversation
            </IconButton>
          </Reveal>
        </div>

        <div className="relative w-64 h-42 sm:w-96 sm:h-64 shrink-0">
          <Float className="absolute inset-0">
            <Image
              src={letsMakeThingsHappenImg}
              alt="Let's make things happen"
              fill
              className="object-contain"
            />
          </Float>
        </div>
      </Reveal>
    </section>
  );
}
