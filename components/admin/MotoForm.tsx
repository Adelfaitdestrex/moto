"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Moto, Category, MotoCondition, MotoStatus } from "@/types";
import { createMoto, updateMoto, uploadImage } from "@/lib/store";
import {
  Bike,
  Upload,
  Trash2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Star,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

interface MotoFormProps {
  initialMoto?: Moto;
  isEditing?: boolean;
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

export default function MotoForm({ initialMoto, isEditing = false }: MotoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [brand, setBrand] = useState(initialMoto?.brand || "");
  const [model, setModel] = useState(initialMoto?.model || "");
  const [category, setCategory] = useState<Category>(initialMoto?.category || "Naked");
  const [year, setYear] = useState<number>(initialMoto?.year || new Date().getFullYear());
  const [price, setPrice] = useState<number>(initialMoto?.price || 1500000);
  const [currency, setCurrency] = useState(initialMoto?.currency || "DA");
  const [condition, setCondition] = useState<MotoCondition>(initialMoto?.condition || "new");
  const [status, setStatus] = useState<MotoStatus>(initialMoto?.status || "available");

  const [engine, setEngine] = useState(initialMoto?.engine || "");
  const [power, setPower] = useState(initialMoto?.power || "");
  const [mileage, setMileage] = useState<number>(initialMoto?.mileage || 0);
  const [transmission, setTransmission] = useState(initialMoto?.transmission || "Manuelle 6 vitesses");
  const [fuel, setFuel] = useState(initialMoto?.fuel || "Essence");
  const [color, setColor] = useState(initialMoto?.color || "Noir");

  const [description, setDescription] = useState(initialMoto?.description || "");
  const [images, setImages] = useState<string[]>(initialMoto?.images || []);
  const [featured, setFeatured] = useState<boolean>(initialMoto?.featured || false);

  // Image Upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const newImageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i]);
        newImageUrls.push(url);
      }
      setImages((prev) => [...prev, ...newImageUrls]);
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const motoData = {
      brand: brand.trim(),
      model: model.trim(),
      category,
      year: Number(year),
      price: Number(price),
      currency,
      condition,
      status,
      engine: engine.trim(),
      power: power.trim(),
      mileage: Number(mileage),
      transmission: transmission.trim(),
      fuel: fuel.trim(),
      color: color.trim(),
      description: description.trim(),
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop"],
      featured,
    };

    try {
      if (isEditing && initialMoto) {
        await updateMoto(initialMoto.id, motoData);
      } else {
        await createMoto(motoData);
      }
      router.push("/admin/motos");
    } catch (err) {
      console.error("Failed to save moto:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-900/90 p-6 rounded-3xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {isEditing ? `Modifier ${initialMoto?.brand} ${initialMoto?.model}` : "Ajouter une Nouvelle Moto"}
            </h1>
            <p className="text-xs text-zinc-400">
              Renseignez les caractéristiques et uploadez les photos de votre moto.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xl shadow-red-950/50 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? "Enregistrer les modifications" : "Publier la moto"}</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Info & Characteristics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Informations Générales */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
              <Bike className="w-4 h-4 text-red-500" />
              <span>Informations Générales</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Marque *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Yamaha, Honda, Kawasaki"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Modèle *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: MT-07, PCX 160"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Catégorie *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Année Modèle *
                </label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Prix de Vente (en Dinars DA) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="ex: 1850000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  État du Véhicule
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as MotoCondition)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="new">Moto Neuve (0 km)</option>
                  <option value="used">Moto d'Occasion</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Spécifications & Caractéristiques */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              Fiche Technique
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Cylindrée Moteur
                </label>
                <input
                  type="text"
                  placeholder="ex: 689 cc"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Puissance
                </label>
                <input
                  type="text"
                  placeholder="ex: 73.4 ch"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Kilométrage (km)
                </label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Transmission
                </label>
                <input
                  type="text"
                  placeholder="ex: Manuelle 6 vitesses"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Carburant
                </label>
                <input
                  type="text"
                  placeholder="ex: Essence"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Couleur
                </label>
                <input
                  type="text"
                  placeholder="ex: Noir Mat"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Description textarea */}
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                Description Complète
              </label>
              <textarea
                rows={5}
                placeholder="Rédigez la description détaillée de la moto, équipements et état..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Photo Manager & Status Flags */}
        <div className="space-y-8">
          {/* Status & Featured Box */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              Statut & Visibilité
            </h3>

            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                Statut de Disponibilité
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MotoStatus)}
                className={`w-full bg-zinc-950 border rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none ${
                  status === "available"
                    ? "text-emerald-400 border-emerald-800"
                    : status === "reserved"
                    ? "text-orange-400 border-orange-800"
                    : "text-zinc-400 border-zinc-800"
                }`}
              >
                <option value="available">🟢 Disponible en concession</option>
                <option value="reserved">🟠 Réservée</option>
                <option value="sold">⚫ Vendue</option>
              </select>
            </div>

            {/* Featured toggle checkbox */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between cursor-pointer" onClick={() => setFeatured(!featured)}>
              <div className="flex items-center gap-3">
                <Star className={`w-5 h-5 ${featured ? "text-amber-400 fill-current" : "text-zinc-500"}`} />
                <div>
                  <span className="text-xs font-bold text-white block">Mettre en avant</span>
                  <span className="text-[10px] text-zinc-400">Afficher sur la page d'accueil</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Photo Uploader & Gallery Manager */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-red-500" />
                <span>Photos ({images.length})</span>
              </h3>
              <span className="text-[10px] text-zinc-400">La 1ère est l'image principale</span>
            </div>

            {/* Upload Button */}
            <label className="w-full py-4 border-2 border-dashed border-zinc-800 hover:border-red-500/60 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-zinc-950/60 hover:bg-zinc-900 transition-all">
              <Upload className="w-6 h-6 text-red-500 mb-1" />
              <span className="text-xs font-bold text-white">Ajouter des photos</span>
              <span className="text-[10px] text-zinc-400 mt-0.5">JPG, PNG, WebP (Plusieurs fichiers acceptés)</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </label>

            {uploadingImage && (
              <div className="flex items-center justify-center gap-2 text-xs text-red-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Chargement de la photo...</span>
              </div>
            )}

            {/* Photo List & Order Buttons */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                      <Image src={img} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-300">
                      {idx === 0 ? "★ Image Principale" : `Photo #${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveImageUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30"
                      title="Monter"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImageDown(idx)}
                      disabled={idx === images.length - 1}
                      className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30"
                      title="Descendre"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 rounded bg-red-950/40 text-red-400 hover:bg-red-900/60"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
