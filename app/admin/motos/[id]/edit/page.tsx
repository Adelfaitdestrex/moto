"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Moto } from "@/types";
import { getMotoById } from "@/lib/store";
import MotoForm from "@/components/admin/MotoForm";
import { Loader2 } from "lucide-react";

export default function EditMotoPage() {
  const params = useParams();
  const id = params?.id as string;
  const [moto, setMoto] = useState<Moto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMoto() {
      if (!id) return;
      try {
        const data = await getMotoById(id);
        setMoto(data);
      } catch (err) {
        console.error("Error fetching moto for edit:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMoto();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-zinc-400 space-y-3">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-xs">Chargement de la moto à modifier...</p>
      </div>
    );
  }

  if (!moto) {
    return (
      <div className="py-24 text-center text-zinc-400 space-y-2">
        <h2 className="text-xl font-bold text-white">Moto introuvable</h2>
        <p className="text-xs">Impossible de charger la moto demandée.</p>
      </div>
    );
  }

  return <MotoForm initialMoto={moto} isEditing={true} />;
}
