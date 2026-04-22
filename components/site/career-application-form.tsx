"use client";

import { useFormState, useFormStatus } from "react-dom";

import { submitCareerApplication } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";
import { Translate } from "@/components/site/translate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = { success: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? (
        <Translate id="button.submitting" defaultText="Submitting..." />
      ) : (
        <Translate id="button.submit" defaultText="Submit" />
      )}
    </Button>
  );
}

export function CareerApplicationForm({
  role
}: {
  role: string;
}) {
  const [state, action] = useFormState(submitCareerApplication, initialState);
  const { t } = useLanguage();

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="role" value={role} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="fullName" placeholder={t("form.fullName", "Full Name")} required />
        <Input name="email" type="email" placeholder={t("form.email", "Email address")} required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="location" placeholder={t("form.location", "Location")} required />
        <Input name="phone" placeholder={t("form.phoneNumber", "Phone Number")} required />
      </div>
      <Input name="joinDate" type="date" required />
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground dark:text-zinc-100">
          <Translate id="form.uploadResume" defaultText="Upload your Resume" />
        </label>
        <input
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          required
          className="block w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SubmitButton />
        <p className={`text-sm font-medium ${state.success ? "text-primary" : "text-rose-400"}`}>
          {t(state.message, state.message)}
        </p>
      </div>
    </form>
  );
}
