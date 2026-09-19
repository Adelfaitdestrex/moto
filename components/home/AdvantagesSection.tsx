import { ShieldCheck, Tag, UserCheck, Truck, Wrench, Sparkles } from "lucide-react";

export default function AdvantagesSection() {
  const advantages = [
    {
      icon: ShieldCheck,
      title: "Motos Sélectionnées & Contrôlées",
      description: "Chaque véhicule de notre catalogue subit une inspection rigoureuse avant mise en vente.",
    },
    {
      icon: Tag,
      title: "Prix Transparents en Dinars",
      description: "Pas de coûts cachés. Tous nos prix sont affichés en Dinars Algériens (DA) sans mauvaise surprise.",
    },
    {
      icon: UserCheck,
      title: "Accompagnement Personnalisé",
      description: "Nos conseillers passionnés vous guident pour choisir la moto adaptée à votre budget et votre usage.",
    },
    {
      icon: Truck,
      title: "Livraison Disponible",
      description: "Service d'expédition et de livraison sécurisé disponible vers plusieurs wilayas d'Algérie.",
    },
    {
      icon: Wrench,
      title: "Service Après-Vente Pro",
      description: "Assistance technique, conseils d'entretien et suivi personnalisé après votre achat.",
    },
  ];

  return (
    <section className="py-20 bg-zinc-900/60 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500">
            Pourquoi Nous Choisir
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Les Avantages Maison Moto
          </h2>
          <p className="text-zinc-400 text-sm">
            Une expérience d'achat professionnelle et transparente pour tous les passionnés de moto en Algérie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-zinc-900/90 border border-zinc-800/80 hover:border-red-500/40 p-6 rounded-2xl flex flex-col items-start transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/20 group"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors mb-4 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
