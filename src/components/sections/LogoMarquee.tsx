import Image from "next/image";
import { Marquee } from "@/components/ui/Marquee";
import { clientLogos } from "@/data/logos";

export function LogoMarquee({ label }: { label: string }) {
  return (
    <div className="mt-16 md:mt-24">
      <p className="eyebrow mb-8 text-center">{label}</p>
      <div className="[mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <Marquee duration={28}>
          {[...clientLogos, ...clientLogos].map((logo, i) => (
            <span key={i} className="mx-8 flex h-12 items-center opacity-60 grayscale transition hover:opacity-100 md:mx-14">
              <Image src={logo.src} alt={logo.name} width={140} height={40} className="h-8 w-auto md:h-10" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
