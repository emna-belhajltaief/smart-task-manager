"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Simulation délai réseau
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validations
    if (!email.includes("@")) {
      setError("Veuillez entrer une adresse email valide");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    // ✅ Simulation de création de compte réussie
    setSuccess("✅ Compte créé avec succès ! Redirection vers la connexion...");
    setLoading(false);

    // Optionnel : Stocker temporairement les infos du nouvel utilisateur
    if (typeof window !== 'undefined') {
      const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      mockUsers.push({ email, password, createdAt: new Date().toISOString() });
      localStorage.setItem('mock_users', JSON.stringify(mockUsers));
    }

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  const handleGoogleSignup = () => {
    alert("🔵 Google signup (mock) - Cette fonctionnalité n'est pas disponible en mode démo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-800">
            Créer un compte 🚀
          </CardTitle>
          <p className="text-center text-sm text-gray-500 mt-2">
            Mode démo - Inscription fictive
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Info box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs text-purple-900">
              💡 <strong>Mode démo :</strong> Vous pouvez créer un compte fictif ou utiliser directement{" "}
              <code className="bg-white px-1 rounded">admin@test.com</code>
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
              {success}
            </div>
          )}

          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              className="transition-all focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />

            <Input
              type="password"
              placeholder="Mot de passe (min 6 caractères)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              className="transition-all focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />

            <Input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              className="transition-all focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleSignup}
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Création du compte...
              </span>
            ) : (
              "Créer mon compte"
            )}
          </Button>

          <div className="relative text-center text-sm text-gray-500">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative bg-white px-4">OU</div>
          </div>

          <Button
            variant="outline"
            className="w-full hover:bg-gray-50 transition-colors"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </Button>

          <p className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-purple-600 underline hover:text-purple-700 font-medium">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}