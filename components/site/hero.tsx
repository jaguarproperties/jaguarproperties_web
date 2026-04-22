import Link from "next/link";
import Image from "next/image";
import { Building2, MapPin, Sparkles } from "lucide-react";

import { Translate } from "@/components/site/translate";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export function Hero({
  title,
  subtitle,
  image,
  primaryCta,
  secondaryCta,
  locations,
  signatureText,
  spotlight
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  locations: string[];
  signatureText: string;
  spotlight: {
    label: string;
    title: string;
    text: string;
    price: string;
  };
}) {
  const isAnimatedAsset = /\.(gif|webp|apng)(\?.*)?$/i.test(image);

  return (
    <section className="relative isolate overflow-hidden bg-[#12110f]">
      <div aria-hidden className="hero-animated-backdrop absolute inset-0" />
      <div aria-hidden className="hero-animated-grid absolute inset-0 opacity-60" />
      <div aria-hidden className="hero-animated-sweep absolute inset-y-0 right-[-8%] w-[48%]" />
      <div
        aria-hidden
        className="animate-pulse-glow absolute left-[4%] top-[14%] h-64 w-64 rounded-full bg-[rgba(195,154,82,0.12)] blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-soft absolute right-[8%] top-[18%] h-72 w-72 rounded-full bg-[rgba(245,237,223,0.08)] blur-3xl"
      />
      <div
        aria-hidden
        className="animate-pulse-glow absolute bottom-[10%] right-[16%] h-56 w-56 rounded-full bg-[rgba(180,140,72,0.12)] blur-3xl"
      />
      {isAnimatedAsset ? (
        <img
          src={image}
          alt="Luxury real estate development"
          className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-screen"
        />
      ) : (
        <Image
          src={image}
          alt="Luxury real estate development"
          fill
          className="object-cover opacity-32 mix-blend-screen"
          priority
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,13,12,0.86)_0%,rgba(20,19,17,0.66)_45%,rgba(30,27,24,0.42)_100%)]" />
      <div className="absolute inset-0 bg-hero-gradient opacity-90" />
      <div className="animate-pulse-glow absolute left-[8%] top-24 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      <div className="animate-float-soft absolute bottom-20 right-[10%] h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="container relative flex min-h-[78vh] items-center py-20 sm:py-24 lg:min-h-[84vh]">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-12">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.45em] text-primary">
                <Translate id="hero.brand" defaultText="Jaguar Properties" />
              </p>
              <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] text-white md:text-6xl xl:text-7xl">{title}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-200 md:text-lg">{subtitle}</p>
              <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
                <Button asChild size="lg">
                  <Link href={primaryCta.href}>
                    <Translate id="hero.viewProjects" defaultText={primaryCta.label} />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <Link href={secondaryCta.href}>
                    <Translate id="hero.contactUs" defaultText={secondaryCta.label} />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="hidden lg:block">
            <div className="space-y-4">
              <div className="animate-float-soft rounded-[30px] border border-white/15 bg-black/30 p-6 shadow-2xl backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">
                  <Translate id="hero.presence" defaultText="Presence" />
                </p>
                <div className="mt-4 space-y-3 text-sm text-zinc-100">
                  {locations.map((location) => (
                    <p key={location} className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> {location}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-[30px] border border-white/15 bg-black/30 p-6 shadow-2xl backdrop-blur-xl">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary">
                  <Sparkles className="h-4 w-4" />
                  <Translate id="hero.signatureLiving" defaultText="Signature Living" />
                </p>
                <p className="mt-4 text-sm leading-7 text-zinc-200">
                  <Translate id="hero.presence.details" defaultText={signatureText} />
                </p>
              </div>
              <div className="animate-property-float rounded-[30px] border border-white/15 bg-black/30 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-primary">
                  <Building2 className="h-5 w-5" />
                  <span>{spotlight.label}</span>
                </div>
                <div className="mt-5 rounded-3xl bg-white/10 p-5 text-zinc-100 shadow-xl">
                  <p className="text-sm uppercase tracking-[0.35em] text-zinc-300">{spotlight.label}</p>
                  <p className="mt-3 whitespace-pre-line text-2xl font-semibold text-white">{spotlight.title}</p>
                  <p className="mt-2 text-sm text-zinc-400">{spotlight.text}</p>
                  <p className="mt-4 text-sm font-semibold text-primary">{spotlight.price}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
        <div className="mt-8 grid gap-4 lg:hidden">
          <div className="rounded-[24px] border border-white/15 bg-black/30 p-5 shadow-2xl backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              <Translate id="hero.presence" defaultText="Presence" />
            </p>
            <div className="mt-3 space-y-2 text-sm text-zinc-100">
              {locations.map((location) => (
                <p key={location} className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> {location}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/15 bg-black/30 p-5 shadow-2xl backdrop-blur-xl">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary">
              <Sparkles className="h-4 w-4" />
              <Translate id="hero.signatureLiving" defaultText="Signature Living" />
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-200">
              <Translate id="hero.presence.details" defaultText={signatureText} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
