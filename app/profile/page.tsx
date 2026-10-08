"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../lib/supabase";

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("No hay sesión activa");
          setIsLoading(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError;
        }

        if (profileData) {
          setProfile(profileData);
        } else {
          setProfile({
            id: user.id,
            username: user.user_metadata?.username || "",
            avatar_url: null,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar perfil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
          <p className="text-foreground/60 text-sm">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center bg-card-bg p-6 rounded-2xl border border-border">
          <p className="text-red-500 mb-4 font-semibold">{error}</p>
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-red-700 transition-colors inline-block"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card-bg/95 backdrop-blur-md border-b-2 border-primary">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-black bg-gradient-to-r from-primary via-red-500 to-amber-400 bg-clip-text text-transparent">
            Mi Perfil
          </h1>
          <Link
            href="/profile/edit"
            className="text-xs font-bold text-primary hover:text-red-600 px-3 py-1 rounded-lg border border-primary/30 hover:bg-primary/10 transition-colors"
          >
            Editar
          </Link>
        </div>
      </header>

      {/* Contenido del perfil */}
      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6 bg-card-bg p-8 rounded-3xl border border-primary/30 shadow-xl relative overflow-hidden">
          {/* Avatar */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-primary shadow-xl bg-chivas-navy/20">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.username || "Avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-black text-primary bg-primary/10">
                {profile?.username?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Username */}
          <div className="text-center flex flex-col items-center gap-1">
            <h2 className="text-2xl font-black text-foreground">
              @{profile?.username || "usuario"}
            </h2>
          </div>

          {/* Botón editar */}
          <Link
            href="/profile/edit"
            className="w-full text-center py-3 px-6 rounded-2xl bg-gradient-to-r from-primary via-red-600 to-amber-500 text-white font-extrabold shadow-md hover:opacity-90 transition-opacity uppercase tracking-wider text-xs border border-amber-400/30"
          >
            Editar perfil
          </Link>
        </div>
      </main>
    </div>
  );
}