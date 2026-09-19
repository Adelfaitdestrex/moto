"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moto, SiteSettings } from "@/types";
import { getMotos, getSettings } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  Bike,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Star,
  Plus,
  Settings,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [motosData, settingsData] = await Promise.all([
          getMotos(),
          getSettings(),
        ]);
        setMotos(motosData);
        setSettings(settingsData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-zinc-400 space-y-3">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-sm">Chargement du tableau de bord...</p>
      </div>
    );
  }

  const totalCount = motos.length;
  const availableCount = motos.filter((m) => m.status === "available").length;
  const reservedCount = motos.filter((m) => m.status === "reserved").length;
  const soldCount = motos.filter((m) => m.status === "sold").length;
  const featuredCount = motos.filter((m) => m.featured).length;

  const statCards = [
    {
      title: "Total Motos",
      value: totalCount,
      description: "Véhicules enregistrés",
      icon: Bike,
      color: "text-white",
      bg: "bg-zinc-800/80 border-zinc-700/80",
    },
    {
      title: "Motos Disponibles",
      value: availableCount,
      description: "🟢 Prêtes pour la vente",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-800/50",
    },
    {
      title: "Motos Réservées",
      value: reservedCount,
      description: "🟠 En attente client",
      icon: AlertCircle,
      color: "text-orange-400",
      bg: "bg-orange-950/40 border-orange-800/50",
    },
    {
      title: "Motos Vendues",
      value: soldCount,
      description: "⚫ Transactées",
      icon: XCircle,
      color: "text-zinc-400",
      bg: "bg-zinc-900 border-zinc-800",
    },
    {
      title: "Mises en Avant",
      value: featuredCount,
      description: "⭐ Affichées sur l'accueil",
      icon: Star,
      color: "text-amber-400",
      bg: "bg-amber-950/40 border-amber-800/50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tableau de Bord
          </h1>
          <p className="text-xs text-zinc-400">
            Aperçu général de votre concession <strong className="text-white">{settings?.name}</strong> ({settings?.wilaya})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/motos/new"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une moto</span>
          </Link>

          <Link
            href="/admin/settings"
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            title="Paramètres"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${card.bg} flex flex-col justify-between space-y-3 transition-transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {card.value}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-1 font-medium">
                  {card.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Motos Table Preview */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <span>Dernières Motos du Catalogue</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Aperçu des 5 derniers véhicules enregistrés
            </p>
          </div>

          <Link
            href="/admin/motos"
            className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1"
          >
            <span>Gérer toutes les motos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {motos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 uppercase bg-zinc-950/60 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Modèle</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Année</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {motos.slice(0, 5).map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-800/40">
                    <td className="px-4 py-3.5 font-bold text-white">
                      {m.brand} {m.model}
                    </td>
                    <td className="px-4 py-3.5">{m.category}</td>
                    <td className="px-4 py-3.5">{m.year}</td>
                    <td className="px-4 py-3.5 font-semibold text-white">
                      {formatPrice(m.price, m.currency)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        m.status === "available"
                          ? "status-badge-available"
                          : m.status === "reserved"
                          ? "status-badge-reserved"
                          : "status-badge-sold"
                      }`}>
                        {m.status === "available" ? "Disponible" : m.status === "reserved" ? "Réservée" : "Vendue"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/motos/${m.id}/edit`}
                        className="text-red-500 hover:text-red-400 font-bold hover:underline"
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 text-center py-8">
            Aucune moto dans le catalogue. Cliquez sur "Ajouter une moto" pour commencer.
          </p>
        )}
      </div>
    </div>
  );
}
