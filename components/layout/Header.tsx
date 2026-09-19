"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, Phone, Menu, X, ShieldCheck, MapPin } from "lucide-react";
import { SiteSettings } from "@/types";

interface HeaderProps {
  settings: SiteSettings;
}

export default function Header({ settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Catalogue Motos", href: "/motos" },
    { name: "Notre Concession", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl py-3"
          : "bg-gradient-to-b from-zinc-950/90 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform duration-300">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                {settings.name || "MAISON MOTO"}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-red-500" />
                {settings.wilaya || "Algérie"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-white font-semibold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-red-500"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sm font-medium text-zinc-200 hover:text-white transition-all duration-200"
            >
              <Phone className="w-4 h-4 text-red-500 animate-pulse" />
              <span>{settings.phone}</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
              title="Espace Admin"
            >
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href={`tel:${settings.phone}`}
              className="p-2.5 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30"
              aria-label="Appeler la concession"
            >
              <Phone className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-6 px-4 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-red-600/20 text-red-400 font-bold border-l-4 border-red-500"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-zinc-800 my-1" />

            <Link
              href={`tel:${settings.phone}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-3 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm shadow-lg shadow-red-900/40"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler ({settings.phone})</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Accès Espace Administrateur</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
