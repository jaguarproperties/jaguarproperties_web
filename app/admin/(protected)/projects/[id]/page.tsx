import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/project-form";
import { getAdminCollections } from "@/lib/data";

export default async function EditProjectPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { updated?: string; error?: string };
}) {
  const { projects } = await getAdminCollections();
  const project = projects.find((item) => item.id === params.id);
  const wasUpdated = searchParams?.updated === "1";
  const errorMessage = searchParams?.error ? decodeURIComponent(searchParams.error) : null;
  const hasError = Boolean(errorMessage);

  if (!project) notFound();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Admin</p>
        <h1 className="mt-3 font-display text-5xl text-white">Edit Project</h1>
      </div>
      {wasUpdated ? (
        <div className="rounded-[24px] border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-100">
          Project updated successfully.
        </div>
      ) : null}
      {hasError ? (
        <div className="rounded-[24px] border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-100">
          {errorMessage === "1" ? "Could not save this project. Please review the form and try again." : errorMessage}
        </div>
      ) : null}
      <ProjectForm project={project} />
    </div>
  );
}
