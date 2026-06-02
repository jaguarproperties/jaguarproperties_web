"use client";

import { usePathname, useRouter } from "next/navigation";

import { Select } from "@/components/ui/select";
import { useLanguage } from "@/components/layout/language-provider";
import { getLocalizedHref } from "@/lib/i18n";

const languages = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" }
];

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-w-[110px] sm:min-w-[140px]">
      <label htmlFor="language-select" className="sr-only">
        {t("language.choose", "Choose language")}
      </label>
      <Select
        id="language-select"
        value={language}
        onChange={(event) => {
          const nextLanguage = event.target.value as typeof language;
          setLanguage(nextLanguage);
          router.push(getLocalizedHref(pathname, nextLanguage));
          router.refresh();
        }}
        className="max-w-[120px] sm:max-w-[160px]"
      >
        {languages.map((languageOption) => (
          <option key={languageOption.value} value={languageOption.value}>
            {languageOption.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
