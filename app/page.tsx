"use client";

import { useEffect, useState } from "react";
import PostCard from "./components/PostCard";
import { supabase } from "./lib/supabase";
import { Post } from "./types";


export default function Home() {

  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleLike = (postId: number | string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          }
          : post
      )
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      // 1. Obtener posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error al obtener los posts:", postsError);
        setError(
          postsError.message === "Invalid API key"
            ? "La clave API de Supabase es inválida o no está configurada. Agrega tu clave anon en el archivo .env.local."
            : postsError.message
        );
        return;
      }

      // 2. Obtener IDs únicos de usuarios
      const userIds = [...new Set(postsData.map((p) => p.user_id))];

      // 3. Buscar profiles de esos usuarios
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      // 4. Crear mapa de profiles por ID
      const profilesMap = new Map(
        profilesData?.map((p) => [p.id, { username: p.username, avatar_url: p.avatar_url }]) || []
      );

      // 5. Combinar posts con profiles
      const postsWithProfiles = postsData.map((post) => ({
        ...post,
        profile: profilesMap.get(post.user_id),
      }));

      setPosts(postsWithProfiles);
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card-bg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-center">
          <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Supagram
          </h1>
        </div>
      </header>

      {/* Feed de posts */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {error ? (
          <div className="bg-card-bg border border-border rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-foreground">Falta configurar Supabase</h2>
            <p className="text-sm text-foreground/60 mt-1">{error}</p>
            <div className="mt-4 p-3 bg-foreground/5 rounded-xl text-xs text-foreground/70 font-mono text-left overflow-x-auto">
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_aqui</code>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}