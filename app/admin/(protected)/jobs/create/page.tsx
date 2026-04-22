import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JobPostingForm } from "@/components/admin/job-posting-form";
import { createOrUpdateJobPosting } from "@/app/actions";

export default async function CreateJobPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/jobs" className="text-sm text-primary hover:underline">
          ← Back to Job Postings
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-primary">HR Management</p>
        <h1 className="mt-3 font-display text-5xl text-white">Post New Job</h1>
        <p className="mt-4 text-sm text-zinc-400">
          Create a new job posting to attract qualified candidates
        </p>
      </div>

      <div className="max-w-4xl rounded-lg border border-white/10 bg-white/5 p-8">
        <JobPostingForm onSubmit={createOrUpdateJobPosting} isLoading={false} />
      </div>
    </div>
  );
}
