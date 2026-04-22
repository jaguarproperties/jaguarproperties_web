"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";

import { useLanguage } from "@/components/layout/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLanguage();
  const locations = [
    { value: "All Locations", label: t("filter.allLocations", "All Locations") },
    { value: "Doddaballapur", label: t("filter.doddaballapur", "Doddaballapur") },
    { value: "Devanahalli", label: t("filter.devanahalli", "Devanahalli") },
    { value: "Yelahanka", label: t("filter.yelahanka", "Yelahanka") },
    { value: "Davanagere", label: t("filter.davanagere", "Davanagere") }
  ];
  const budgets = [
    { value: "Any Budget", label: t("filter.anyBudget", "Any Budget") },
    { value: "Under 1 Cr", label: t("filter.under1Cr", "Under 1 Cr") },
    { value: "1 Cr - 2 Cr", label: t("filter.1Cr2Cr", "1 Cr - 2 Cr") },
    { value: "2 Cr - 5 Cr", label: t("filter.2Cr5Cr", "2 Cr - 5 Cr") },
    { value: "5 Cr+", label: t("filter.5Cr", "5 Cr+") }
  ];
  const sizes = [
    { value: "Any Size", label: t("filter.anySize", "Any Size") },
    { value: "Under 1500 sq ft", label: t("filter.under1500", "Under 1500 sq ft") },
    { value: "1500 - 2400 sq ft", label: t("filter.1500to2400", "1500 - 2400 sq ft") },
    { value: "2400 - 3200 sq ft", label: t("filter.2400to3200", "2400 - 3200 sq ft") },
    { value: "3200+ sq ft", label: t("filter.3200Plus", "3200+ sq ft") }
  ];
  const statuses = [
    { value: "Any Status", label: t("filter.anyStatus", "Any Status") },
    { value: "AVAILABLE", label: t("filter.status.available", "AVAILABLE") },
    { value: "SOLD", label: t("filter.status.sold", "SOLD") },
    { value: "HOLD", label: t("filter.status.hold", "HOLD") }
  ];
  const categories = [
    { value: "All Projects", label: t("filter.category.allProjects", "All Projects") },
    { value: "North Bengaluru", label: t("filter.category.northBengaluru", "North Bengaluru") },
    { value: "Township", label: t("filter.category.township", "Township") },
    { value: "Villa Plots", label: t("filter.category.villaPlots", "Villa Plots") },
    { value: "Farm Lands", label: t("filter.category.farmLands", "Farm Lands") },
    { value: "Apartments", label: t("filter.category.apartments", "Apartments") },
    { value: "Commercial Land", label: t("filter.category.commercialLand", "Commercial Land") },
    { value: "Investment", label: t("filter.category.investment", "Investment") },
    { value: "Gated Community", label: t("filter.category.gatedCommunity", "Gated Community") }
  ];

  const search = params.get("search") ?? "";
  const location = params.get("location") ?? locations[0].value;
  const budget = params.get("budget") ?? budgets[0].value;
  const size = params.get("size") ?? sizes[0].value;
  const status = params.get("status") ?? statuses[0].value;
  const category = params.get("category") ?? categories[0].value;

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (
        !value ||
        value === locations[0].value ||
        value === budgets[0].value ||
        value === sizes[0].value ||
        value === statuses[0].value ||
        value === categories[0].value
      ) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    router.push(`/properties${next.toString() ? `?${next.toString()}` : ""}`);
  };

  return (
    <div className="w-full rounded-[30px] border border-black/10 bg-black/[0.03] p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:p-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400">{t("filter.searchLabel", "Search project or area")}</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              defaultValue={search}
              placeholder={t("filter.searchPlaceholder", "Search Doddaballapur, Devanahalli, villa plots...")}
              className="pl-10"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  updateParams({ search: (event.target as HTMLInputElement).value });
                }
              }}
              onBlur={(event) => updateParams({ search: event.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400">{t("filter.location", "Location")}</label>
          <Select value={location} onChange={(event) => updateParams({ location: event.target.value })}>
            {locations.map((item) => (
              <option key={item.value} value={item.value} className="bg-zinc-950">
                {item.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400">{t("filter.budget", "Budget")}</label>
          <Select value={budget} onChange={(event) => updateParams({ budget: event.target.value })}>
            {budgets.map((item) => (
              <option key={item.value} value={item.value} className="bg-zinc-950">
                {item.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400">{t("filter.size", "Plot Size")}</label>
          <Select value={size} onChange={(event) => updateParams({ size: event.target.value })}>
            {sizes.map((item) => (
              <option key={item.value} value={item.value} className="bg-zinc-950">
                {item.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400">{t("filter.status", "Status")}</label>
          <Select value={status} onChange={(event) => updateParams({ status: event.target.value })}>
            {statuses.map((item) => (
              <option key={item.value} value={item.value} className="bg-zinc-950">
                {item.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            type="button"
            variant="secondary"
            className="w-full md:w-auto"
            onClick={() => router.push("/properties")}
          >
            <RotateCcw className="h-4 w-4" />
            {t("button.reset", "Reset")}
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => updateParams({ category: item.value })}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              category === item.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-black/10 bg-black/[0.04] text-zinc-700 hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
