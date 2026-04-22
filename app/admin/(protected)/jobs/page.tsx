import Link from "next/link";
import { deleteJobPosting } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TableCard } from "@/components/admin/table-card";
import { getAdminJobPostings } from "@/lib/data";

export default async function JobPostingsPage() {
  const jobPostings = await getAdminJobPostings();

  const departments = Array.from(new Set(jobPostings.map((job) => job.department))).slice(0, 3);
  const totalOpenings = jobPostings.reduce((sum, job) => sum + (job.openings ?? 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">HRM Workspace</p>
          <h1 className="mt-3 font-display text-5xl text-white">Recruitment Management</h1>
          <p className="mt-2 text-sm text-zinc-400">Create, publish, and manage recruitment openings for your organization.</p>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/create">Create Job Opening</Link>
        </Button>
      </div>

      <TableCard title="Active Recruitment Openings">
        {jobPostings.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-zinc-400">
            No live job postings are available right now. This usually means the database model is unavailable in the
            current runtime or no jobs have been created yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="pb-3">Job Title</th>
              <th className="pb-3">Department</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Openings</th>
              <th className="pb-3">Type</th>
              <th className="pb-3">Salary</th>
              <th className="pb-3">Posted</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobPostings.map((job) => (
                <tr key={job.id} className="border-t border-white/10 text-zinc-300">
                  <td className="py-3 font-medium text-white">{job.title}</td>
                  <td className="py-3">{job.department}</td>
                  <td className="py-3">{job.location}</td>
                  <td className="py-3">{job.openings}</td>
                  <td className="py-3">
                    <span className="inline-block rounded-full bg-primary/20 px-2 py-1 text-xs text-primary">
                      {job.type}
                    </span>
                  </td>
                  <td className="py-3 text-xs">{job.salary ?? "—"}</td>
                  <td className="py-3 text-xs">{job.postedAt.toISOString().split("T")[0]}</td>
                  <td className="space-x-2 py-3">
                    <Link href={`/admin/jobs/${job.id}`} className="text-primary hover:underline">
                      Edit
                    </Link>
                    <form action={deleteJobPosting} className="inline">
                      <input type="hidden" name="id" value={job.id} />
                      <button type="submit" className="text-rose-400 hover:text-rose-300">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white">Active Openings</h3>
          <p className="mt-2 text-3xl font-bold text-primary">{jobPostings.length}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white">Total Openings</h3>
          <p className="mt-2 text-3xl font-bold text-primary">{totalOpenings}</p>
          <p className="mt-2 text-sm text-zinc-400">This matches the opening counts managed from the job form.</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white">Hiring Departments</h3>
          <div className="mt-2 space-y-1 text-sm text-zinc-400">
            {departments.map((department) => (
              <div key={department}>{department}</div>
            ))}
            {departments.length === 0 ? <div>No departments yet</div> : null}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white">Recruitment Shortcuts</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link href="/admin/jobs/create">Create Job Opening</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/admin/applications">Open Candidate Applications</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
