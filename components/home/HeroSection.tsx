import Link from "next/link";
import { ArrowRight, Phone, ShieldCheck, Award, MapPin, ChevronDown } from "lucide-react";
import { SiteSettings } from "@/types";

interface HeroSectionProps {
  settings: SiteSettings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-zinc-950">
      {/* Background Image Layer with Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-35 filter scale-105 transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1920&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/60" />
      <div className="absolute inset-0 z-0 bg-radial-glow opacity-80" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="max-w-3xl space-y-6">
          {/* Badge top */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-zinc-300 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-zinc-400">Concessionnaire Officiel à</span>
            <span className="text-white font-bold">{settings.wilaya || "Algérie"}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Votre prochaine moto <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-zinc-200 to-red-500 bg-clip-text text-transparent">
              commence ici.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed font-normal">
            Découvrez notre sélection exclusive de motos neuves et d'occasion contrôlées. Trouvez la machine parfaite disponible immédiatement en Algérie.
          </p>

          {/* Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/motos"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-red-950/50 hover:shadow-red-600/30 group"
            >
              <span>Voir nos motos</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white font-semibold text-base flex items-center justify-center gap-3 transition-all duration-200"
            >
              <Phone className="w-5 h-5 text-red-500" />
              <span>Nous contacter</span>
            </Link>
          </div>

          {/* Key trust badges */}
          <div className="pt-8 border-t border-zinc-900 grid grid-cols-3 gap-4 max-w-xl text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
              <span>Garantie & Contrôle</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-red-500 shrink-0" />
              <span>Motos Sélectionnées</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500 shrink-0" />
              <span>Disponible en Wilaya</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-zinc-500 animate-bounce">
        <span className="text-[10px] uppercase tracking-widest font-semibold">Découvrir</span>
        <ChevronDown className="w-4 h-4 text-red-500" />
      </div>
    </section>
  );
}
