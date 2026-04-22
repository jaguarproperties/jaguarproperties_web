"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/language-provider";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const { t } = useLanguage();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const nextTheme = storedTheme ?? "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    setTheme(nextTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      className="rounded-full px-3 py-3"
      aria-label={theme === "dark" ? t("theme.day", "Day") : t("theme.night", "Night")}
    >
      <span aria-hidden="true">◐</span>
    </Button>
  );
}
