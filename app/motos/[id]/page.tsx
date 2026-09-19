"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Moto, SiteSettings } from "@/types";
import { getMotoById, getMotos, getSettings } from "@/lib/store";
import { formatPrice, generateWhatsAppLink, generateMotoInquiryMessage } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import MotoGallery from "@/components/motos/MotoGallery";
import SpecTable from "@/components/motos/SpecTable";
import MotoCard from "@/components/motos/MotoCard";
import {
  Phone,
  MessageSquare,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  Loader2,
  MapPin,
  Bike,
  Sparkles,
} from "lucide-react";

export default function MotoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [moto, setMoto] = useState<Moto | null>(null);
  const [allMotos, setAllMotos] = useState<Moto[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [motoData, motosData, settingsData] = await Promise.all([
          getMotoById(id),
          getMotos(),
          getSettings(),
        ]);
        setMoto(motoData);
        setAllMotos(motosData);
        setSettings(settingsData);
      } catch (error) {
        console.error("Error fetching moto details:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        <p className="text-sm font-medium text-zinc-400">Chargement de la moto...</p>
      </div>
    );
  }

  if (!moto || !settings) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-red-500">
          <Bike className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Moto Introuvable</h2>
        <p className="text-zinc-400 text-sm max-w-sm">
          La moto que vous recherchez n'existe pas ou a été retirée du catalogue.
        </p>
        <Link
          href="/motos"
          className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-xs shadow-xl"
        >
          Retour au catalogue
        </Link>
      </div>
    );
  }

  // Generate WhatsApp dynamic URL
  const whatsappMsg = generateMotoInquiryMessage(moto, settings.name);
  const whatsappUrl = generateWhatsAppLink(settings.whatsapp || settings.phone, whatsappMsg);

  // Similar bikes recommendations (same category or same brand, excluding current)
  const similarMotos = allMotos
    .filter((m) => m.id !== moto.id && (m.category === moto.category || m.brand === moto.brand))
    .slice(0, 3);

  const getStatusBadge = () => {
    switch (moto.status) {
      case "available":
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold status-badge-available shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>🟢 En Stock / Disponible</span>
          </span>
        );
      case "reserved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold status-badge-reserved shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            <span>🟠 Moto Réservée</span>
          </span>
        );
      case "sold":
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold status-badge-sold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
            <span>⚫ Moto Vendue</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-red-600 selection:text-white">
      <Header settings={settings} />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/motos"
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-red-500" />
              <span>Retour au catalogue</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-red-500" />}
              <span>{copied ? "Lien copié !" : "Partager"}</span>
            </button>
          </div>

          {/* Main Grid: Left Gallery vs Right Purchase Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 7 Cols: Gallery & Specs */}
            <div className="lg:col-span-7 space-y-8">
              <MotoGallery images={moto.images} altText={`${moto.brand} ${moto.model}`} />
              <SpecTable moto={moto} />
            </div>

            {/* Right 5 Cols: Buying Panel & Immediate CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-7 rounded-3xl space-y-6 shadow-2xl sticky top-28">
                {/* Header Info */}
                <div className="space-y-2 border-b border-zinc-800 pb-5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-red-950/80 text-red-400 border border-red-800/60 text-xs font-bold uppercase tracking-wider">
                      {moto.category}
                    </span>
                    {getStatusBadge()}
                  </div>

                  <h1 className="text-3xl font-extrabold text-white tracking-tight pt-2">
                    <span className="text-red-500">{moto.brand}</span> {moto.model}
                  </h1>
                  <p className="text-xs text-zinc-400 font-medium flex items-center gap-2">
                    <span>Année {moto.year}</span> • <span>{moto.condition === "new" ? "Véhicule Neuf (0 km)" : "Véhicule d'occasion"}</span>
                  </p>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Prix de vente
                  </span>
                  <div className="text-4xl font-extrabold text-white tracking-tight">
                    {formatPrice(moto.price, moto.currency)}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Présentation du véhicule
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                    {moto.description || "Aucune description fournie pour cette moto."}
                  </p>
                </div>

                {/* Direct Action Inquiry Buttons (VERY VISIBLE) */}
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <div className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <span>Vous êtes intéressé par cette moto ?</span>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-950/50 hover:scale-[1.02]"
                  >
                    <MessageSquare className="w-5 h-5 fill-current" />
                    <span>Contacter sur WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${settings.phone}`}
                    className="w-full py-3.5 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-sm flex items-center justify-center gap-3 transition-all"
                  >
                    <Phone className="w-5 h-5 text-red-500" />
                    <span>Appeler le vendeur ({settings.phone})</span>
                  </a>
                </div>

                {/* Location Note */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-3 text-xs text-zinc-400">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0" />
                  <span>Disponible en exposition chez <strong>{settings.name}</strong> ({settings.wilaya}).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Bikes Section */}
          {similarMotos.length > 0 && (
            <div className="pt-12 border-t border-zinc-900 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    Motos Similaires
                  </h3>
                  <p className="text-xs text-zinc-400">
                    D'autres modèles susceptibles de vous intéresser
                  </p>
                </div>
                <Link
                  href="/motos"
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Voir tout
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarMotos.map((m) => (
                  <MotoCard
                    key={m.id}
                    moto={m}
                    whatsappPhone={settings.whatsapp}
                    dealershipName={settings.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </div>
  );
}
