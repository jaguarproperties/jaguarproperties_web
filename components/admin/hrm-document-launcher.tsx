"use client";

import { useState } from "react";
import { FileBadge2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { HrmDocumentDefinition } from "@/lib/hrm";

type EmployeeOption = {
  id: string;
  name: string;
  employeeCode: string;
  email: string;
};

export function HrmDocumentLauncher({
  documents,
  employees,
  selectedEmployeeId
}: {
  documents: HrmDocumentDefinition[];
  employees: EmployeeOption[];
  selectedEmployeeId?: string;
}) {
  const [openDocument, setOpenDocument] = useState<string | null>(null);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {documents.map((document) => {
        const isOpen = openDocument === document.type;

        return (
          <Card key={document.type} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary">{document.category}</p>
                <h3 className="mt-3 font-display text-3xl text-white">{document.label}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{document.description}</p>
              </div>
              <ShieldCheck className="mt-1 h-6 w-6 text-primary" />
            </div>

            {!isOpen ? (
              <div className="mt-6">
                <Button type="button" onClick={() => setOpenDocument(document.type)}>
                  <FileBadge2 className="h-4 w-4" />
                  Create {document.label}
                </Button>
              </div>
            ) : (
              <form
                method="GET"
                action={`/api/hrm/documents/${document.type}`}
                target="_blank"
                className="mt-6 space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-200">Employee</label>
                  <select
                    name="employeeId"
                    defaultValue={selectedEmployeeId ?? employees[0]?.id ?? ""}
                    className="flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} · {employee.employeeCode || employee.email}
                      </option>
                    ))}
                  </select>
                </div>

                {document.requiredFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-200">{field.label}</label>
                    {field.type === "textarea" ? (
                      <Textarea
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="min-h-[110px] bg-white/5"
                      />
                    ) : (
                      <Input
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="bg-white/5"
                      />
                    )}
                  </div>
                ))}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="submit" name="mode" value="inline">
                    {document.type === "employee-id-card" ? "Download PNG ID Card" : "Preview & Print"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setOpenDocument(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>
        );
      })}
    </div>
  );
}
