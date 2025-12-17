"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SemanticSearch } from "../ai/semantic-search";

export function Navbar() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <h1 className="font-bold">Smart Task Manager</h1>
      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
      <SemanticSearch />

    </nav>
  );
}
