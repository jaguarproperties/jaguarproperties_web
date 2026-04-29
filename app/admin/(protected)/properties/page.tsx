import { deleteProperty } from "@/app/actions";
import { PropertyForm } from "@/components/admin/property-form";
import { TableCard } from "@/components/admin/table-card";
import { Button } from "@/components/ui/button";
import { getAdminCollections } from "@/lib/data";
import Link from "next/link";

export default async function AdminPropertiesPage() {
  const { properties, projects } = await getAdminCollections();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">Admin</p>
        <h1 className="mt-3 font-display text-5xl text-white">Manage Properties</h1>
      </div>

      <PropertyForm projects={projects.map((project) => ({ id: project.id, title: project.title }))} />

      <TableCard
        title="Property Inventory"
        contentClassName={properties.length > 4 ? "max-h-[26rem] overflow-y-auto" : undefined}
      >
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="pb-3">Title</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-white/10 text-zinc-300">
                <td className="py-3">{property.title}</td>
                <td className="py-3">{property.location}</td>
                <td className="py-3">{property.price}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/admin/properties/${property.id}`}>Edit</Link>
                    </Button>
                    <form action={deleteProperty}>
                      <input type="hidden" name="id" value={property.id} />
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
