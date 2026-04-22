"use client";

import { useMemo, useState } from "react";

import { useLanguage } from "@/components/layout/language-provider";
import { Translate } from "@/components/site/translate";
import { Input } from "@/components/ui/input";

export function EmiCalculator() {
  const { language, t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState("8500000");
  const [interestRate, setInterestRate] = useState("8.5");
  const [tenureYears, setTenureYears] = useState("20");

  const result = useMemo(() => {
    const principal = Number(loanAmount);
    const annualRate = Number(interestRate);
    const years = Number(tenureYears);

    if (!principal || !annualRate || !years) {
      return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    return { emi, totalInterest, totalPayment };
  }, [interestRate, loanAmount, tenureYears]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(language === "ar" ? "ar" : language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value || 0);

  return (
    <div className="rounded-[28px] border border-black/10 bg-black/[0.03] p-6 dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-zinc-700 dark:text-zinc-300">
            {t("emi.loanAmount", "Loan Amount")}
          </label>
          <Input value={loanAmount} onChange={(event) => setLoanAmount(event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-zinc-700 dark:text-zinc-300">
            {t("emi.interest", "Interest %")}
          </label>
          <Input value={interestRate} onChange={(event) => setInterestRate(event.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-zinc-700 dark:text-zinc-300">
            {t("emi.tenureYears", "Tenure In Years")}
          </label>
          <Input value={tenureYears} onChange={(event) => setTenureYears(event.target.value)} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] border border-black/10 bg-white/50 p-5 dark:border-white/10 dark:bg-black/20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            <Translate id="emi.monthly" defaultText="Monthly EMI" />
          </p>
          <p className="mt-3 font-display text-3xl text-foreground dark:text-white">{formatCurrency(result.emi)}</p>
        </div>
        <div className="rounded-[22px] border border-black/10 bg-white/50 p-5 dark:border-white/10 dark:bg-black/20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            <Translate id="emi.totalInterest" defaultText="Total Interest" />
          </p>
          <p className="mt-3 font-display text-3xl text-foreground dark:text-white">
            {formatCurrency(result.totalInterest)}
          </p>
        </div>
        <div className="rounded-[22px] border border-black/10 bg-white/50 p-5 dark:border-white/10 dark:bg-black/20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            <Translate id="emi.totalPayment" defaultText="Total Payment" />
          </p>
          <p className="mt-3 font-display text-3xl text-foreground dark:text-white">
            {formatCurrency(result.totalPayment)}
          </p>
        </div>
      </div>
    </div>
  );
}
