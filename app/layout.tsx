import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison Moto Algérie | Motos neuves et d'occasion",
  description: "Concessionnaire officiel spécialiste de la moto neuve et d'occasion en Algérie.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
