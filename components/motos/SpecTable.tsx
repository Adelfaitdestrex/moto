import { Moto } from "@/types";
import { Gauge, Zap, Calendar, Fuel, Cog, Palette, ShieldCheck, Activity } from "lucide-react";

interface SpecTableProps {
  moto: Moto;
}

export default function SpecTable({ moto }: SpecTableProps) {
  const specs = [
    { label: "Cylindrée", value: moto.engine, icon: Gauge },
    { label: "Puissance", value: moto.power, icon: Zap },
    { label: "Année modèle", value: moto.year.toString(), icon: Calendar },
    { label: "Kilométrage", value: `${moto.mileage.toLocaleString("fr-FR")} km`, icon: Activity },
    { label: "Transmission", value: moto.transmission, icon: Cog },
    { label: "Carburant", value: moto.fuel, icon: Fuel },
    { label: "Couleur", value: moto.color, icon: Palette },
    { label: "Condition", value: moto.condition === "new" ? "Neuve (0 km)" : "Occasion", icon: ShieldCheck },
  ];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
      <h3 className="text-base font-bold text-white tracking-tight border-b border-zinc-800 pb-3 flex items-center justify-between">
        <span>Caractéristiques Techniques</span>
        <span className="text-xs font-normal text-zinc-400">Fiche Constructeur</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/50">
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-red-500 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-white">
                  {item.value || "Non spécifié"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
