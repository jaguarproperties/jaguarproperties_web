import { redirect } from "next/navigation";

export default function LegacyEditJobRoute({
  params
}: {
  params: { id: string };
}) {
  redirect(`/admin/jobs/${params.id}`);
}
