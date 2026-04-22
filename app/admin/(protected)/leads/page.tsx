import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { TableCard } from "@/components/admin/table-card";
import { getAdminCollections } from "@/lib/data";

export default async function AdminLeadsPage() {
  const { leads } = await getAdminCollections();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">CRM Workspace</p>
          <h1 className="mt-3 font-display text-5xl text-white">Lead Management</h1>
          <p className="mt-2 text-sm text-zinc-400">Review inbound inquiries, contact details, and lead intent in one CRM view.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="secondary">
            <Link href="/api/leads/export?format=csv">Export Lead CSV</Link>
          </Button>
          <Button asChild>
            <Link href="/api/leads/export?format=xlsx">Export Lead XLSX</Link>
          </Button>
        </div>
      </div>

      <TableCard title="Inbound Lead Records">
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">Interest</th>
              <th className="pb-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-white/10 align-top text-zinc-300">
                <td className="py-3">
                  <p>{lead.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">{lead.city ?? "No city selected"}</p>
                </td>
                <td className="py-3">
                  <p>{lead.email}</p>
                  <p className="mt-1 text-xs text-zinc-500">{lead.phone}</p>
                </td>
                <td className="py-3">
                  <p>{lead.inquiryType ?? "General inquiry"}</p>
                  <p className="mt-1 max-w-md text-xs text-zinc-500">{lead.message}</p>
                </td>
                <td className="py-3">{format(lead.createdAt, "dd MMM yyyy")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
