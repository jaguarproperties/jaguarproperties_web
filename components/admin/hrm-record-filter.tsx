"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EmployeeOption = {
  id: string;
  name: string;
  role: string;
  employeeCode: string;
  email: string;
};

export function HrmRecordFilter({
  canManage,
  employeeOptions,
  selectedEmployeeId
}: {
  canManage: boolean;
  employeeOptions: EmployeeOption[];
  selectedEmployeeId?: string;
}) {
  const defaultValue = selectedEmployeeId ?? (canManage ? "all" : employeeOptions[0]?.id ?? "");
  const [currentValue, setCurrentValue] = useState(defaultValue);

  const currentSelectionLabel = useMemo(() => {
    if (canManage && currentValue === "all") {
      return "All visible employees";
    }

    const selectedEmployee = employeeOptions.find((employee) => employee.id === currentValue);
    return selectedEmployee
      ? `${selectedEmployee.name} · ${selectedEmployee.role}`
      : "No employee selected";
  }, [canManage, currentValue, employeeOptions]);

  return (
    <form className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-200">Record Scope</label>
        <select
          name="employeeId"
          value={currentValue}
          onChange={(event) => setCurrentValue(event.target.value)}
          className="flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          {canManage ? <option value="all">All Employees</option> : null}
          {employeeOptions.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name} · {employee.employeeCode || employee.email}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-200">Current Selection</label>
        <Input value={currentSelectionLabel} readOnly className="bg-white/5" />
      </div>
      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Apply Filter
        </Button>
      </div>
    </form>
  );
}
