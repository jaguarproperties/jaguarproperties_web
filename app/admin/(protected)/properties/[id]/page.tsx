import { notFound } from "next/navigation";

import { PropertyForm } from "@/components/admin/property-form";
import { getAdminCollections } from "@/lib/data";

export default async function EditPropertyPage({
  params
}: {
  params: { id: string };
}) {
  const { properties, projects } = await getAdminCollections();
  const property = properties.find((item) => item.id === params.id);

  if (!property) notFound();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Admin</p>
        <h1 className="mt-3 font-display text-5xl text-white">Edit Property</h1>
      </div>
      <PropertyForm
        property={property}
        projects={projects
          .map((project) => ({ id: project.id, title: project.title }))
          .sort((a, b) => a.title.localeCompare(b.title))}
      />
    </div>
  );
}
