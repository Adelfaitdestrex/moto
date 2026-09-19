"use client";

import { MessageSquare } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";
import { SiteSettings } from "@/types";

interface FloatingWhatsAppProps {
  settings: SiteSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const whatsappUrl = generateWhatsAppLink(
    settings.whatsapp || settings.phone,
    `Bonjour ${settings.name || "Maison Moto"}, je souhaite demander des informations sur vos motos disponibles.`
  );

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 group"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <span className="hidden sm:inline-block px-3 py-1.5 bg-zinc-900/90 text-white text-xs font-semibold rounded-lg border border-zinc-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Discuter sur WhatsApp
      </span>
      <div className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 group-hover:scale-110 transition-transform duration-300 relative">
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300"></span>
        </span>
        <MessageSquare className="w-7 h-7 fill-current" />
      </div>
    </a>
  );
}
