import Link from "next/link";
import { notFound } from "next/navigation";

import { createOrUpdateJobPosting, deleteJobPosting } from "@/app/actions";
import { JobPostingForm } from "@/components/admin/job-posting-form";
import { Button } from "@/components/ui/button";
import { getAdminJobPostingById } from "@/lib/data";

export default async function EditJobPage({
  params
}: {
  params: { id: string };
}) {
  const job = await getAdminJobPostingById(params.id);

  if (!job) notFound();

  const posting = {
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location,
    description: job.description,
    requirements: job.requirements,
    openings: job.openings,
    qualification: job.qualification ?? "",
    experience: job.experience ?? "",
    salary: job.salary ?? "",
    type: job.type,
    postedAt: job.postedAt.toISOString().split("T")[0],
    isActive: job.isActive
  };

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/jobs" className="text-sm text-primary hover:underline">
          ← Back to Job Postings
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-primary">HR Management</p>
        <h1 className="mt-3 font-display text-5xl text-white">Edit Job Posting</h1>
        <p className="mt-4 text-sm text-zinc-400">Update the job posting details</p>
      </div>

      <div className="max-w-4xl rounded-lg border border-white/10 bg-white/5 p-8">
        <JobPostingForm posting={posting} onSubmit={createOrUpdateJobPosting} isLoading={false} />
      </div>

      <div className="max-w-4xl">
        <form action={deleteJobPosting} className="mt-4">
          <input type="hidden" name="id" value={job.id} />
          <Button type="submit" variant="destructive" className="text-rose-400 hover:text-rose-300">
            Delete This Job Posting
          </Button>
        </form>
      </div>
    </div>
  );
}
