"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Card } from "@/components/ui/card";
import { Translate } from "@/components/site/translate";
import { resolveImageSrc, shouldBypassImageOptimization } from "@/lib/image";
import { cn } from "@/lib/utils";

type Testimonial = {
  id: string;
  name: string;
  message: string;
  image: string;
};

export function TestimonialsMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  const items = testimonials.length > 1 ? [...testimonials, ...testimonials] : testimonials;

  return (
    <div className="mt-10 overflow-hidden">
      <div
        className={cn(
          "flex gap-6",
          testimonials.length > 1 ? "testimonial-marquee-track w-max" : "justify-center"
        )}
      >
        {items.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const element = messageRef.current;
    if (!element) return;

    const checkOverflow = () => {
      setCanExpand(element.scrollHeight > element.clientHeight + 1);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  return (
    <Card className="w-[300px] shrink-0 rounded-[28px] border-black/10 bg-white/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/[0.04] md:w-[360px]">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-primary/20 bg-primary/10">
          <Image
            src={resolveImageSrc(testimonial.image)}
            alt={testimonial.name}
            fill
            sizes="64px"
            className="object-cover"
            unoptimized={shouldBypassImageOptimization(resolveImageSrc(testimonial.image))}
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-primary">
            <Translate id="home.testimonials.client" defaultText="Client Voice" />
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">{testimonial.name}</h3>
        </div>
      </div>
      <p
        ref={messageRef}
        className={cn(
          "mt-5 text-sm leading-7 text-zinc-700 dark:text-zinc-300",
          expanded ? "" : "line-clamp-4"
        )}
      >
        <Translate id={testimonial.message} defaultText={testimonial.message} />
      </p>
      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:opacity-75"
        >
          {expanded ? "See less" : "See more"}
        </button>
      ) : null}
    </Card>
  );
}
