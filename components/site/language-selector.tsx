"use client";

import { Select } from "@/components/ui/select";
import { useLanguage } from "@/components/layout/language-provider";

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
  { value: "ar", label: "العربية" },
  { value: "kn", label: "ಕನ್ನಡ" }
];

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-w-[140px]">
      <label htmlFor="language-select" className="sr-only">
        {t("language.choose", "Choose language")}
      </label>
      <Select
        id="language-select"
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        className="max-w-[160px]"
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
