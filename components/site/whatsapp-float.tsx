"use client";

import Link from "next/link";

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
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6 fill-current"
      >
        <path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.56 0 .24 5.3.24 11.82c0 2.08.54 4.1 1.57 5.88L0 24l6.48-1.7a11.8 11.8 0 0 0 5.6 1.42h.01c6.52 0 11.83-5.3 11.83-11.82 0-3.16-1.23-6.14-3.4-8.42ZM12.1 21.7h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.22-3.85 1.01 1.03-3.75-.24-.39a9.75 9.75 0 0 1-1.5-5.17c0-5.41 4.42-9.82 9.85-9.82 2.63 0 5.1 1.02 6.96 2.88a9.76 9.76 0 0 1 2.88 6.96c0 5.41-4.42 9.82-9.84 9.82Zm5.39-7.35c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.24-.46-2.36-1.47-.87-.78-1.45-1.75-1.62-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.22 5.1 4.52.71.3 1.27.48 1.7.61.71.22 1.35.19 1.86.11.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.08-.12-.28-.2-.57-.35Z" />
      </svg>
      <span className="hidden sm:inline">{t("whatsapp.us", "WhatsApp Us")}</span>
    </Link>
  );
}
