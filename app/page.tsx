import { getMotos, getSettings } from "@/lib/store";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import FeaturedMotos from "@/components/home/FeaturedMotos";
import AdvantagesSection from "@/components/home/AdvantagesSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: `${settings.name || "Maison Moto"} | Motos neuves et d'occasion en Algérie (${settings.wilaya || "Tlemcen"})`,
    description: settings.description || "Découvrez notre catalogue de motos neuves et occasion en Algérie. Les meilleures marques au meilleur prix.",
  };
}

export default async function HomePage() {
  const motos = await getMotos();
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-600 selection:text-white">
      <Header settings={settings} />
      <main>
        <HeroSection settings={settings} />
        <FeaturedMotos motos={motos} settings={settings} />
        <AdvantagesSection />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </div>
  );
}
