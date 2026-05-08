import Link from "next/link";

import { deleteTestimonial } from "@/app/actions";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { TableCard } from "@/components/admin/table-card";
import { Button } from "@/components/ui/button";
import { listAllTestimonials } from "@/lib/testimonials";

export default async function AdminTestimonialsPage({
  searchParams
}: {
  searchParams?: { created?: string; deleted?: string; error?: string };
}) {
  const testimonials = await listAllTestimonials();
  const hasScrollableList = testimonials.length > 5;
  const errorMessage = searchParams?.error;
  const wasCreated = searchParams?.created === "1";
  const wasDeleted = searchParams?.deleted === "1";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Website CMS</p>
        <h1 className="mt-3 font-display text-5xl text-white">Client Testimonials</h1>
      </div>

      {wasCreated ? (
        <div className="rounded-[24px] border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          Testimonial created successfully.
        </div>
      ) : null}

      {wasDeleted ? (
        <div className="rounded-[24px] border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          Testimonial deleted successfully.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[24px] border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-100">
          Could not complete the testimonial action. {errorMessage}
        </div>
      ) : null}

      <TestimonialForm />

      <TableCard
        title="Existing Testimonials"
        description={`${testimonials.length} testimonial${testimonials.length === 1 ? "" : "s"} available in admin.`}
        contentClassName={hasScrollableList ? "max-h-[28rem]" : undefined}
      >
        {testimonials.length ? (
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[#141414] text-zinc-500">
              <tr>
                <th className="pb-3 pl-4 pt-4">Client</th>
                <th className="pb-3 pt-4">Published</th>
                <th className="pb-3 pr-4 pt-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial: { id: string; name: string; published: boolean }) => (
                <tr key={testimonial.id} className="border-t border-white/10 text-zinc-300">
                  <td className="py-3 pl-4">{testimonial.name}</td>
                  <td className="py-3">{testimonial.published ? "Yes" : "No"}</td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-2">
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/admin/testimonials/${testimonial.id}`}>Edit</Link>
                      </Button>
                      <form action={deleteTestimonial}>
                        <input type="hidden" name="id" value={testimonial.id} />
                        <Button type="submit" variant="secondary" size="sm">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-6 text-sm text-zinc-400">No testimonials available yet.</div>
        )}
      </TableCard>
    </div>
  );
}
