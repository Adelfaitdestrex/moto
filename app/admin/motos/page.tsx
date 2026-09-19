"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Moto } from "@/types";
import { getMotos, updateMoto, deleteMoto } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export default function AdminMotosPage() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadMotos = async () => {
    try {
      const data = await getMotos();
      setMotos(data);
    } catch (err) {
      console.error("Error loading motos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMotos();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFeatured = async (moto: Moto) => {
    try {
      await updateMoto(moto.id, { featured: !moto.featured });
      showToast(
        moto.featured
          ? `Moto ${moto.model} retirée des vedettes.`
          : `Moto ${moto.model} mise en avant !`
      );
      loadMotos();
    } catch (err) {
      console.error("Failed to update featured flag:", err);
    }
  };

  const handleStatusChange = async (moto: Moto, newStatus: any) => {
    try {
      await updateMoto(moto.id, { status: newStatus });
      showToast(`Statut de ${moto.model} mis à jour : ${newStatus}`);
      loadMotos();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setActionLoading(true);
    try {
      await deleteMoto(deleteTargetId);
      showToast("Moto supprimée avec succès du catalogue.");
      setDeleteTargetId(null);
      loadMotos();
    } catch (err) {
      console.error("Failed to delete moto:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMotos = motos.filter(
    (m) =>
      m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-semibold text-xs animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 p-6 rounded-3xl border border-zinc-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Gestion du Catalogue Motos
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gérez les véhicules, mettez en avant vos meilleurs modèles et modifiez les prix en direct.
          </p>
        </div>

        <Link
          href="/admin/motos/new"
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-950/50 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une moto</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par marque, modèle ou catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Motos Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Chargement des motos...</p>
        </div>
      ) : filteredMotos.length > 0 ? (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 uppercase bg-zinc-950/80 border-b border-zinc-800 font-bold">
                <tr>
                  <th className="px-4 py-4">Photo</th>
                  <th className="px-4 py-4">Moto</th>
                  <th className="px-4 py-4">Catégorie / Année</th>
                  <th className="px-4 py-4">Prix</th>
                  <th className="px-4 py-4">Statut Vente</th>
                  <th className="px-4 py-4 text-center">Vedette</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredMotos.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
                        <Image
                          src={m.images && m.images.length > 0 ? m.images[0] : "/placeholder.png"}
                          alt={m.model}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      <div>
                        <span>{m.brand} {m.model}</span>
                        <span className="block text-[10px] font-normal text-zinc-400">
                          {m.condition === "new" ? "Neuf (0 km)" : "Occasion"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{m.category}</span>
                      <span className="block text-[10px] text-zinc-400">{m.year}</span>
                    </td>
                    <td className="px-4 py-3 font-extrabold text-white">
                      {formatPrice(m.price, m.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={m.status}
                        onChange={(e) => handleStatusChange(m, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border bg-zinc-950 focus:outline-none ${
                          m.status === "available"
                            ? "text-emerald-400 border-emerald-800"
                            : m.status === "reserved"
                            ? "text-orange-400 border-orange-800"
                            : "text-zinc-400 border-zinc-800"
                        }`}
                      >
                        <option value="available">🟢 Disponible</option>
                        <option value="reserved">🟠 Réservée</option>
                        <option value="sold">⚫ Vendue</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleFeatured(m)}
                        className={`p-2 rounded-xl transition-all ${
                          m.featured
                            ? "bg-amber-950/80 text-amber-400 border border-amber-800/60 shadow-md"
                            : "bg-zinc-950 text-zinc-600 border border-zinc-800 hover:text-zinc-300"
                        }`}
                        title={m.featured ? "Moto mise en avant" : "Mettre en avant"}
                      >
                        <Star className={`w-4 h-4 ${m.featured ? "fill-current" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        href={`/admin/motos/${m.id}/edit`}
                        className="inline-flex items-center p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteTargetId(m.id)}
                        className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center bg-zinc-900/50 rounded-3xl border border-zinc-800 text-zinc-400 text-xs">
          Aucune moto ne correspond à votre recherche.
        </div>
      )}

      {/* Confirmation Modal Delete */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950 text-red-500 border border-red-800 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Confirmer la suppression</h3>
              <p className="text-xs text-zinc-400">
                Êtes-vous sûr de vouloir supprimer définitivement cette moto du catalogue ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-zinc-700"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-lg shadow-red-950/50"
              >
                {actionLoading ? "Suppression..." : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
