"use client";

import { FilterState, Category } from "@/types";
import { Search, RotateCcw, Filter, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface MotoFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  brands: string[];
  totalResults: number;
}

const CATEGORIES: Category[] = [
  "Scooter",
  "Sportive",
  "Naked",
  "Trail",
  "Custom",
  "Cross",
  "Enduro",
  "Touring",
  "Autre",
];

export default function MotoFilters({
  filters,
  onFilterChange,
  onReset,
  brands,
  totalResults,
}: MotoFiltersProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const FilterFields = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2.5">
          Catégorie
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onFilterChange({ category: "all" })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.category === "all" || !filters.category
                ? "bg-red-600 text-white shadow-md shadow-red-900/40"
                : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700"
            }`}
          >
            Toutes
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange({ category: cat })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filters.category === cat
                  ? "bg-red-600 text-white shadow-md shadow-red-900/40"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
          Marque
        </label>
        <select
          value={filters.brand || "all"}
          onChange={(e) => onFilterChange({ brand: e.target.value })}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
        >
          <option value="all">Toutes les marques</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Condition & Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
            État
          </label>
          <select
            value={filters.condition || "all"}
            onChange={(e) => onFilterChange({ condition: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          >
            <option value="all">Tous (Neuf & Occasion)</option>
            <option value="new">Neuf (0 km)</option>
            <option value="used">Occasion</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
            Disponibilité
          </label>
          <select
            value={filters.status || "all"}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">🟢 Disponible</option>
            <option value="reserved">🟠 Réservée</option>
            <option value="sold">⚫ Vendue</option>
          </select>
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
          Budget (Dinars DA)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min DA"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          />
          <input
            type="number"
            placeholder="Max DA"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Year Filter */}
      <div>
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
          Année Modèle
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Année Min"
            value={filters.minYear}
            onChange={(e) => onFilterChange({ minYear: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          />
          <input
            type="number"
            placeholder="Année Max"
            value={filters.maxYear}
            onChange={(e) => onFilterChange({ maxYear: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-zinc-700"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Réinitialiser les filtres</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Search Bar & Sort Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une moto, marque, modèle..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Sort & Mobile filter button */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-xs shadow-md"
          >
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 hidden sm:inline">Trier par :</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="newest">Plus récentes d'abord</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="oldest">Plus anciennes d'abord</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Layout vs Mobile Modal Drawer */}
      <div className="hidden md:block bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <SlidersHorizontal className="w-4 h-4 text-red-500" />
            <span>Filtres de recherche</span>
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            {totalResults} moto{totalResults > 1 ? "s" : ""} trouvée{totalResults > 1 ? "s" : ""}
          </span>
        </div>
        <FilterFields />
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end md:hidden">
          <div className="w-full max-w-xs bg-zinc-950 h-full p-6 overflow-y-auto space-y-6 border-l border-zinc-800">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-500" />
                <span>Filtres</span>
              </h3>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterFields />
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm shadow-xl"
            >
              Voir les {totalResults} résultats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
