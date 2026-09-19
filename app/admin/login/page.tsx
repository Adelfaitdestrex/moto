"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { Bike, Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@maisonmoto.dz");
  const [password, setPassword] = useState("admin123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("admin_authenticated", "true");
        router.push("/admin");
        return;
      } catch (err: any) {
        console.warn("Firebase Auth login failed:", err.message);
        setError("Identifiants incorrects ou compte non configuré dans Firebase.");
      } finally {
        setLoading(false);
      }
    } else {
      // Local demo mode authentication
      if (email === "admin@maisonmoto.dz" && password === "admin123456") {
        localStorage.setItem("admin_authenticated", "true");
        router.push("/admin");
      } else {
        setError("Identifiants démo incorrects. Utilisez admin@maisonmoto.dz / admin123456");
        setLoading(false);
      }
    }
  };

  const handleDemoAccess = () => {
    localStorage.setItem("admin_authenticated", "true");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 selection:bg-red-600">
      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 mx-auto flex items-center justify-center shadow-lg shadow-red-950/50">
            <Bike className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Espace Administration
          </h1>
          <p className="text-xs text-zinc-400">
            Connectez-vous pour gérer le catalogue de votre concession moto.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                placeholder="admin@maisonmoto.dz"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-red-950/40 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <span>{loading ? "Connexion en cours..." : "Se connecter"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant One-Click Demo Mode Button */}
        <div className="pt-4 border-t border-zinc-800/80 text-center space-y-3">
          <p className="text-[11px] text-zinc-400">
            Mode démonstration rapide activé pour ce projet
          </p>
          <button
            onClick={handleDemoAccess}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Accès Administrateur Démo Immédiat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
