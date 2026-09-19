import { Phone, MessageSquare, MapPin, Clock, Mail, Instagram, Facebook } from "lucide-react";
import { SiteSettings } from "@/types";
import { generateWhatsAppLink } from "@/lib/utils";

interface ContactSectionProps {
  settings: SiteSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const whatsappUrl = generateWhatsAppLink(
    settings.whatsapp || settings.phone,
    `Bonjour ${settings.name || "Maison Moto"}, je souhaite demander des informations sur la concession.`
  );

  return (
    <section id="contact" className="py-20 bg-zinc-950 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Info & Action Buttons */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                Contact & Localisation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                Rendez-nous visite en concession
              </h2>
              <p className="mt-3 text-zinc-400 text-sm leading-relaxed">
                Notre équipe vous accueille pour vous faire découvrir nos motos, répondre à vos questions et vous conseiller dans votre achat.
              </p>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/60 transition-all flex items-center gap-4 group shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                    Contact Rapide
                  </span>
                  <span className="text-base font-bold text-white">Discuter sur WhatsApp</span>
                </div>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-4 group shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-red-400 font-semibold uppercase tracking-wider block">
                    Appel Direct
                  </span>
                  <span className="text-base font-bold text-white">{settings.phone}</span>
                </div>
              </a>
            </div>

            {/* Detailed Info Cards */}
            <div className="bg-zinc-900/80 border border-zinc-800/80 p-6 rounded-2xl space-y-4 text-sm text-zinc-300">
              <div className="flex items-start gap-4 pb-4 border-b border-zinc-800/60">
                <MapPin className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">Adresse de la Concession</h4>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {settings.address}, Wilaya de <strong className="text-white">{settings.wilaya}</strong>, Algérie
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-4 border-b border-zinc-800/60">
                <Clock className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">Horaires d'Ouverture</h4>
                  <p className="text-zinc-400 text-xs mt-0.5">{settings.openingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">Adresse Électronique</h4>
                  <p className="text-zinc-400 text-xs mt-0.5">{settings.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed Card */}
          <div className="h-full min-h-[380px] bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-between">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Localisation : {settings.wilaya}, Algérie</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                Ouvert Actuellement
              </span>
            </div>

            {/* Responsive Map Frame */}
            <div className="w-full flex-1 min-h-[300px] relative">
              <iframe
                title="Localisation Concession Moto"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  settings.address + ", " + settings.wilaya + ", Algeria"
                )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 filter grayscale contrast-125 opacity-85 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
