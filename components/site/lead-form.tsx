"use client";

import { useFormState, useFormStatus } from "react-dom";

import { submitLead } from "@/app/actions";
import { useLanguage } from "@/components/layout/language-provider";
import { Translate } from "@/components/site/translate";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? (
        <Translate id="button.sendingInquiry" defaultText="Sending..." />
      ) : (
        <Translate id="button.sendInquiry" defaultText="Send Inquiry" />
      )}
    </Button>
  );
}

const initialState = { success: false, message: "" };

export function LeadForm() {
  const [state, action] = useFormState(submitLead, initialState);
  const { t } = useLanguage();

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" placeholder={t("form.name", "Your name")} required />
        <Input name="email" type="email" placeholder={t("form.email", "Email address")} required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="phone" placeholder={t("form.phone", "Phone number")} required />
        <Input name="city" placeholder={t("form.city", "Preferred city")} />
      </div>
      <Input name="inquiryType" placeholder={t("form.inquiryType", "Project / Property of interest")} />
      <Textarea name="message" placeholder={t("form.message", "Tell us about your requirement")} required />
      <div className="flex items-center justify-between gap-4">
        <SubmitButton />
        <p className={`text-sm font-medium ${state.success ? "text-primary" : "text-rose-300"}`}>
          {t(state.message, state.message)}
        </p>
      </div>
    </form>
  );
}
