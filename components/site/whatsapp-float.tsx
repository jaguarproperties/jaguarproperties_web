"use client";

import Link from "next/link";
import { MessageCircleMore } from "lucide-react";

import { useLanguage } from "@/components/layout/language-provider";

export function WhatsAppFloat() {
  const { t } = useLanguage();
  const phone = "919513304482";
  const label = "+91 95133 04482";

  return (
    <Link
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t("whatsapp.aria", "Chat on WhatsApp at")} ${label}`}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-full border border-[#25D366]/30 bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,211,102,0.35)] transition-transform duration-300 hover:scale-105"
    >
      <MessageCircleMore className="h-5 w-5" />
      <span className="hidden sm:inline">{t("whatsapp.us", "WhatsApp Us")}</span>
    </Link>
  );
}
