import Link from "next/link";

import { deleteProject } from "@/app/actions";
import { ProjectForm } from "@/components/admin/project-form";
import { TableCard } from "@/components/admin/table-card";
import { Button } from "@/components/ui/button";
import { getAdminCollections } from "@/lib/data";

export default async function AdminProjectsPage({
  searchParams
}: {
  searchParams?: { created?: string; deleted?: string; error?: string };
}) {
  const { projects } = await getAdminCollections();
  const wasCreated = searchParams?.created === "1";
  const wasDeleted = searchParams?.deleted === "1";
  const hasError = searchParams?.error === "1";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Admin</p>
        <h1 className="mt-3 font-display text-5xl text-white">Manage Projects</h1>
      </div>

      {wasCreated ? (
        <div className="rounded-[24px] border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          Project created successfully.
        </div>
      ) : null}
      {wasDeleted ? (
        <div className="rounded-[24px] border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          Project deleted successfully.
        </div>
      ) : null}
      {hasError ? (
        <div className="rounded-[24px] border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-100">
          Could not save this project. Please review the form and try again.
        </div>
      ) : null}

      <ProjectForm />

      <TableCard
        title="Project Inventory"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"} available in admin.`}
        contentClassName={projects.length > 4 ? "max-h-[26rem] overflow-y-auto" : undefined}
      >
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="pb-3 pl-4">Title</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-white/10 text-zinc-300">
                <td className="py-3 pl-4">{project.title}</td>
                <td className="py-3">{project.location}</td>
                <td className="py-3">{project.status}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                    </Button>
                    <form action={deleteProject}>
                      <input type="hidden" name="id" value={project.id} />
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
      </TableCard>
    </div>
  );
}
