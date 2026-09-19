"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import {
  LayoutDashboard,
  Bike,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // If on login route, don't enforce layout auth check
    if (pathname === "/admin/login") {
      setAuthenticated(true);
      return;
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user || localStorage.getItem("admin_authenticated") === "true") {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.push("/admin/login");
        }
      });
      return () => unsubscribe();
    } else {
      // Local fallback auth check
      const localAuth = localStorage.getItem("admin_authenticated");
      if (localAuth === "true") {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        router.push("/admin/login");
      }
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Firebase logout error:", err);
      }
    }
    localStorage.removeItem("admin_authenticated");
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-medium">Vérification de l'accès admin...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
    { name: "Catalogue Motos", href: "/admin/motos", icon: Bike },
    { name: "Ajouter une moto", href: "/admin/motos/new", icon: PlusCircle },
    { name: "Paramètres Concession", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row selection:bg-red-600">
      {/* Mobile Top Nav */}
      <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
            <Bike className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-white">Admin Concession</span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-zinc-800 text-zinc-300"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`${
          mobileSidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-zinc-900/90 border-r border-zinc-800 shrink-0 p-6 flex flex-col justify-between z-30 sticky top-0 h-auto md:h-screen`}
      >
        <div className="space-y-8">
          {/* Logo Header */}
          <div className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-lg shadow-red-950/40">
                <Bike className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-white tracking-tight">
                  ADMINISTRATION
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">Maison Moto Algérie</span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-zinc-800/80 mt-6 md:mt-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
          >
            <span>Voir le site public</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
