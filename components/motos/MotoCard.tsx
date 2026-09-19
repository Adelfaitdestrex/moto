"use client";

import Link from "next/link";
import Image from "next/image";
import { Moto } from "@/types";
import { formatPrice, generateWhatsAppLink, generateMotoInquiryMessage } from "@/lib/utils";
import { Gauge, Calendar, MessageSquare, ChevronRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface MotoCardProps {
  moto: Moto;
  whatsappPhone?: string;
  dealershipName?: string;
}

export default function MotoCard({ moto, whatsappPhone = "+213550123456", dealershipName = "Maison Moto" }: MotoCardProps) {
  const primaryImage = moto.images && moto.images.length > 0
    ? moto.images[0]
    : "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop";

  const getStatusBadge = () => {
    switch (moto.status) {
      case "available":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold status-badge-available shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Disponible</span>
          </span>
        );
      case "reserved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold status-badge-reserved shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>Réservée</span>
          </span>
        );
      case "sold":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold status-badge-sold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-zinc-400" />
            <span>Vendue</span>
          </span>
        );
    }
  };

  const whatsappMessage = generateMotoInquiryMessage(moto, dealershipName);
  const whatsappUrl = generateWhatsAppLink(whatsappPhone, whatsappMessage);

  return (
    <div className="group relative bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1">
      {/* Header Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        <Image
          src={primaryImage}
          alt={`${moto.brand} ${moto.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md text-[11px] font-semibold text-zinc-300 uppercase tracking-wider border border-zinc-800">
              {moto.category}
            </span>
            <span className={`px-2.5 py-1 rounded-lg backdrop-blur-md text-[11px] font-bold uppercase tracking-wider border ${
              moto.condition === "new"
                ? "bg-red-950/80 text-red-400 border-red-800/60"
                : "bg-amber-950/80 text-amber-400 border-amber-800/60"
            }`}>
              {moto.condition === "new" ? "Neuf" : "Occasion"}
            </span>
          </div>

          <div>{getStatusBadge()}</div>
        </div>

        {/* Brand overlay label */}
        <div className="absolute bottom-3 left-4">
          <span className="text-xs font-semibold text-red-500 uppercase tracking-widest block">
            {moto.brand}
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">
            {moto.model}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Specs Highlights Grid */}
        <div className="grid grid-cols-2 gap-2 py-2 px-3 bg-zinc-900/60 rounded-xl border border-zinc-800/50 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Année : <strong className="text-zinc-200">{moto.year}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-zinc-400" />
            <span>Moteur : <strong className="text-zinc-200">{moto.engine}</strong></span>
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-2 border-t border-zinc-900 flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
              Prix proposé
            </span>
            <span className="text-xl font-extrabold text-white tracking-tight">
              {formatPrice(moto.price, moto.currency)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
              title="Demander via WhatsApp"
              aria-label="Discuter sur WhatsApp"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
            </a>

            <Link
              href={`/motos/${moto.id}`}
              className="px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1 transition-all shadow-md shadow-red-900/30 group/btn"
            >
              <span>Détails</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
