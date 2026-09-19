"use client";

import { useEffect, useState } from "react";
import { Moto, SiteSettings, FilterState } from "@/types";
import { getMotos, getSettings } from "@/lib/store";
import { filterMotos } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import MotoCard from "@/components/motos/MotoCard";
import MotoFilters from "@/components/motos/MotoFilters";
import { Bike, Loader2, Frown } from "lucide-react";

export default function CatalogPage() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    brand: "all",
    category: "all",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    condition: "all",
    status: "all",
    sortBy: "newest",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [motosData, settingsData] = await Promise.all([
          getMotos(),
          getSettings(),
        ]);
        setMotos(motosData);
        setSettings(settingsData);
      } catch (error) {
        console.error("Error loading catalog data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      brand: "all",
      category: "all",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      condition: "all",
      status: "all",
      sortBy: "newest",
    });
  };

  // Get unique brands dynamically
  const uniqueBrands = Array.from(new Set(motos.map((m) => m.brand))).sort();

  const filteredMotos = filterMotos(motos, filters);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-red-600 selection:text-white">
      {settings && <Header settings={settings} />}

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8">
              <Bike className="w-80 h-80 text-white" />
            </div>
            <div className="relative z-10 space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                Catalogue Exposition
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Motos Disponibles en Algérie
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Explorez notre stock de motos de sport, roadsters, scooters et trails. Filtrez par marque, catégorie et budget pour trouver votre future machine.
              </p>
            </div>
          </div>

          {/* Filters & Results Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <MotoFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
                brands={uniqueBrands}
                totalResults={filteredMotos.length}
              />
            </div>

            {/* Motos Grid */}
            <div className="lg:col-span-3 space-y-6">
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center text-zinc-400 space-y-4">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  <p className="text-sm font-medium">Chargement du catalogue...</p>
                </div>
              ) : filteredMotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMotos.map((moto) => (
                    <MotoCard
                      key={moto.id}
                      moto={moto}
                      whatsappPhone={settings?.whatsapp}
                      dealershipName={settings?.name}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 px-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 mx-auto flex items-center justify-center text-zinc-500">
                    <Frown className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Aucune moto trouvée</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Aucun modèle ne correspond à vos critères de recherche actuels. Essayez de réinitialiser vos filtres.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs shadow-lg shadow-red-900/40 hover:bg-red-700 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {settings && (
        <>
          <Footer settings={settings} />
          <FloatingWhatsApp settings={settings} />
        </>
      )}
    </div>
  );
}
