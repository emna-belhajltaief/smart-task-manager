"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VALID_EMAIL = "admin@test.com";
const VALID_PASSWORD = "password123";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Délai de 1 seconde
    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        // ✅ SUCCESS - Redirection immédiate
        alert("✅ Connexion réussie ! Vous allez être redirigé...");
        window.location.replace("/dashboard");
      } else {
        setError("❌ Email ou mot de passe incorrect");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-6 rounded-xl border-2 bg-white p-8 shadow-2xl">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
          <p className="text-sm text-gray-600">Mode Démo - Smart Task Manager</p>
        </div>

        {/* CREDENTIALS BOX */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4">
          <p className="text-xs font-bold text-blue-900 mb-2">🔑 IDENTIFIANTS DE TEST :</p>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-700">📧</span>
              <code className="bg-white px-3 py-1 rounded border">admin@test.com</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-700">🔒</span>
              <code className="bg-white px-3 py-1 rounded border">password123</code>
            </div>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="p-4 text-sm font-semibold text-red-700 bg-red-50 border-2 border-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <Input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-12 text-base"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Mot de passe</label>
            <Input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-12 text-base"
            />
          </div>

          <Button 
            onClick={handleLogin} 
            className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                Connexion en cours...
              </span>
            ) : (
              "Se connecter"
            )}
          </Button>
        </div>

        {/* FOOTER */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            Pas de compte ?{" "}
            <a href="/signup" className="text-blue-600 font-semibold hover:underline">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}