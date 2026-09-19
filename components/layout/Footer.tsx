import Link from "next/link";
import { Bike, Phone, MapPin, Mail, Clock, Instagram, Facebook, ShieldCheck } from "lucide-react";
import { SiteSettings } from "@/types";

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/30">
                <Bike className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                {settings.name || "MAISON MOTO"}
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {settings.description || "Votre concessionnaire spécialiste de la moto neuve et d'occasion en Algérie. Les meilleures marques au meilleur prix."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Rapide */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold tracking-wide uppercase text-xs text-zinc-300">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-red-400 transition-colors">
                  Page d'accueil
                </Link>
              </li>
              <li>
                <Link href="/motos" className="hover:text-red-400 transition-colors">
                  Catalogue complet des motos
                </Link>
              </li>
              <li>
                <Link href="/motos?category=Sportive" className="hover:text-red-400 transition-colors">
                  Motos Sportives
                </Link>
              </li>
              <li>
                <Link href="/motos?category=Naked" className="hover:text-red-400 transition-colors">
                  Roadsters & Naked
                </Link>
              </li>
              <li>
                <Link href="/motos?category=Scooter" className="hover:text-red-400 transition-colors">
                  Scooters Urbains
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold tracking-wide uppercase text-xs text-zinc-300">
              Coordonnées
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.wilaya}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-500 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{settings.openingHours}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Espace Admin & Infos */}
          <div className="space-y-4 bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-2xl">
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              <span>Espace Propriétaire</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Gérez votre catalogue de motos, modifiez les prix et paramètres en toute simplicité.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs border border-zinc-700 transition-all shadow-md"
            >
              Connexion Administration
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.name || "Maison Moto"}. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5 text-zinc-400">
            <span>Concessionnaire Moto Agréé -</span>
            <span className="text-red-500 font-semibold">{settings.wilaya || "Algérie"}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
