"use client";

import { useLanguage } from "@/components/layout/language-provider";

export function Translate({ id, defaultText }: { id: string; defaultText: string }) {
  const { t } = useLanguage();
  return <>{t(id, defaultText)}</>;
}
