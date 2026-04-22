import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { TableCard } from "@/components/admin/table-card";
import { getAdminCollections } from "@/lib/data";

export default async function AdminApplicationsPage() {
  const { applications } = await getAdminCollections();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Admin</p>
          <h1 className="mt-3 font-display text-5xl text-white">Job Applications</h1>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="secondary">
            <Link href="/api/applications/export?format=csv">Export CSV</Link>
          </Button>
          <Button asChild>
            <Link href="/api/applications/export?format=xlsx">Export XLSX</Link>
          </Button>
        </div>
      </div>

      <TableCard title="Career Applicants">
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="pb-3">Applicant</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Join Date</th>
              <th className="pb-3">Resume</th>
              <th className="pb-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((item) => (
              <tr key={item.id} className="border-t border-white/10 align-top text-zinc-300">
                <td className="py-3">
                  <p>{item.fullName}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.email}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.phone}</p>
                </td>
                <td className="py-3">
                  <p>{item.role}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.location}</p>
                </td>
                <td className="py-3">{format(item.joinDate, "dd MMM yyyy")}</td>
                <td className="py-3">
                  <Link href={`/api/applications/${item.id}/resume`} className="text-primary hover:underline">
                    {item.resumeName}
                  </Link>
                </td>
                <td className="py-3">{format(item.createdAt, "dd MMM yyyy")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
