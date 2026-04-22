import { Upload } from "lucide-react";

import { uploadHrmLetterhead } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { HrmWorkspaceData } from "@/lib/hrm";

export function HrmPageHeader({
  canManage,
  letterhead,
  uploadErrorMessage,
  letterheadUpdated
}: {
  canManage: boolean;
  letterhead: HrmWorkspaceData["letterhead"];
  uploadErrorMessage: string | null;
  letterheadUpdated?: string;
}) {
  return (
    <>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="admin-section-eyebrow">HRM Documents</p>
          <h1 className="mt-3 font-display text-5xl text-white">Payroll, Performance, and Documents</h1>
          <p className="mt-4 max-w-4xl admin-soft-copy">
            Manage salary calculation, payslips, bonuses, deductions, tax calculation, performance reviews, KPI
            tracking, appraisals, promotions, and employee document generation from one role-based workspace.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {canManage
              ? "HR and Admin accounts can generate, print, and download employee documents for the full authorized scope."
              : "Your account can open only the documents available for your employee ID. Management actions stay restricted to HR and Admin."}
          </p>
        </div>

        <Card className="max-w-md p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Letterhead Status</p>
          <div className="mt-4 space-y-2 text-sm text-zinc-300">
            <p className="font-semibold text-white">{letterhead.companyName}</p>
            <p>{letterhead.address}</p>
            <p>
              {letterhead.email} · {letterhead.phone}
            </p>
            <p className="pt-2 text-zinc-400">{letterhead.supportNote}</p>
          </div>
          {letterhead.sampleUrl ? (
            <div className="mt-5 rounded-[20px] border border-white/10 bg-white/5 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={letterhead.sampleUrl}
                alt="Uploaded HRM letterhead sample"
                className="max-h-44 w-full rounded-2xl object-contain"
              />
            </div>
          ) : null}
          {canManage ? (
            <form action={uploadHrmLetterhead} className="mt-5 space-y-3" encType="multipart/form-data">
              <label className="block text-sm font-semibold text-zinc-200">Upload Sample Letterhead</label>
              <Input name="file" type="file" accept=".png,.jpg,.jpeg,.webp,.svg" className="bg-white/5" required />
              <Button type="submit" variant="secondary" className="w-full">
                <Upload className="h-4 w-4" />
                Save Letterhead Sample
              </Button>
            </form>
          ) : null}
        </Card>
      </div>

      {letterheadUpdated ? (
        <div className="rounded-[24px] border border-emerald-400/25 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
          HRM letterhead sample uploaded successfully and will be used in printable documents.
        </div>
      ) : null}

      {uploadErrorMessage ? (
        <div className="rounded-[24px] border border-rose-400/25 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
          {uploadErrorMessage}
        </div>
      ) : null}
    </>
  );
}
