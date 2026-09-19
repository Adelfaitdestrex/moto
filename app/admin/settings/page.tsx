"use client";

import { useEffect, useState } from "react";
import { SiteSettings } from "@/types";
import { getSettings, updateSettings } from "@/lib/store";
import {
  Settings,
  Building,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Palette,
  Eye,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await updateSettings(settings);
      showToast("Paramètres de la concession enregistrés avec succès !");
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-zinc-400 space-y-3">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-xs">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-semibold text-xs animate-in fade-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 p-6 rounded-3xl border border-zinc-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-red-500" />
            <span>Paramètres de la Concession</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Personnalisez les coordonnées, réseaux sociaux et préférences d'affichage sans modifier le code.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xl shadow-red-950/50 flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistrer les paramètres</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Box 1: Informations Concession */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-red-500" />
            <span>Coordonnées de la Concession</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                Nom de la concession
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                Wilaya d'implantation (Algérie)
              </label>
              <input
                type="text"
                value={settings.wilaya}
                onChange={(e) => setSettings({ ...settings, wilaya: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                Adresse exacte
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Téléphone Principal
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Numéro WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                Adresse Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                Horaires d'Ouverture
              </label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                Description de la concession
              </label>
              <textarea
                rows={3}
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Box 2: Configuration & Réseaux */}
        <div className="space-y-8">
          {/* Réseaux Sociaux */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Instagram className="w-4 h-4 text-red-500" />
              <span>Réseaux Sociaux</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Lien Profil Instagram
                </label>
                <input
                  type="text"
                  placeholder="https://instagram.com/votre_compte"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Lien Page Facebook
                </label>
                <input
                  type="text"
                  placeholder="https://facebook.com/votre_page"
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Preferences Affichage */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-500" />
              <span>Préférences d'Affichage & Boutons</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <div>
                  <span className="text-xs font-bold text-white block">Afficher les prix sur les cartes</span>
                  <span className="text-[10px] text-zinc-400">Masquer temporairement si sur demande</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showPrices}
                  onChange={(e) => setSettings({ ...settings, showPrices: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <div>
                  <span className="text-xs font-bold text-white block">Afficher les motos vendues</span>
                  <span className="text-[10px] text-zinc-400">Garder les véhicules vendus visibles dans le catalogue</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showSold}
                  onChange={(e) => setSettings({ ...settings, showSold: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Texte du Bouton WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.whatsappButtonText}
                  onChange={(e) => setSettings({ ...settings, whatsappButtonText: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
