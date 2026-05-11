"use client";

import { useLanguage } from "@/components/layout/language-provider";

export function TranslateText({ text }: { text: string | null | undefined }) {
  const { t } = useLanguage();

  if (!text) {
    return null;
  }

  return <>{t(text, text)}</>;
}
