import { notFound } from "next/navigation";

import { TestimonialForm } from "@/components/admin/testimonial-form";
import { listAllTestimonials } from "@/lib/testimonials";

export default async function EditTestimonialPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { updated?: string; error?: string };
}) {
  const testimonials = await listAllTestimonials();
  const testimonial = testimonials.find((item: { id: string }) => item.id === params.id);
  const wasUpdated = searchParams?.updated === "1";
  const errorMessage = searchParams?.error;

  if (!testimonial) notFound();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Website CMS</p>
        <h1 className="mt-3 font-display text-5xl text-white">Edit Testimonial</h1>
      </div>
      {wasUpdated ? (
        <div className="rounded-[24px] border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          Testimonial updated successfully.
        </div>
      ) : null}
      {errorMessage ? (
        <div className="rounded-[24px] border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-100">
          Could not save this testimonial. {errorMessage}
        </div>
      ) : null}
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
