import Link from "next/link";
import { Moto, SiteSettings } from "@/types";
import MotoCard from "@/components/motos/MotoCard";
import { ArrowRight, Sparkles } from "lucide-react";

interface FeaturedMotosProps {
  motos: Moto[];
  settings: SiteSettings;
}

export default function FeaturedMotos({ motos, settings }: FeaturedMotosProps) {
  // Take up to 6 featured motos or default to first 6 if none featured
  const featured = motos.filter((m) => m.featured);
  const displayMotos = featured.length >= 3 ? featured.slice(0, 6) : motos.slice(0, 6);

  return (
    <section className="py-20 bg-zinc-950 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sélection Exclusive</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Motos Populaires & En Vedette
            </h2>
            <p className="mt-2 text-zinc-400 text-sm max-w-xl">
              Consultez nos modèles les plus recherchés actuellement disponibles dans notre concession.
            </p>
          </div>

          <Link
            href="/motos"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-400 transition-colors group"
          >
            <span>Voir tout le catalogue ({motos.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        {displayMotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayMotos.map((moto) => (
              <MotoCard
                key={moto.id}
                moto={moto}
                whatsappPhone={settings.whatsapp}
                dealershipName={settings.name}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-zinc-400">
            Aucune moto à afficher pour le moment.
          </div>
        )}
      </div>
    </section>
  );
}
