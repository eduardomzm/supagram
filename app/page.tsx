"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Post as initialPosts, type Post } from "./mocks/posts";
import { supabase } from "./lib/supabase";
import PostCard from "./components/PostCard"; 

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuthAndGetPosts() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Si no hay sesión iniciada, redirige a la pantalla de inicio de sesión por defecto
          router.replace("/auth/login");
          return;
        }

        setIsAuthenticated(true);
        setIsLoadingAuth(false);

        const { data: postsData } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .range(0, 11);

        if (postsData) {
          setPosts(postsData);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        router.replace("/auth/login");
      }
    }

    checkAuthAndGetPosts();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === "SIGNED_OUT") {
        router.replace("/auth/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

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

  if (isLoadingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-foreground/60 text-sm font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card-bg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Supagram
          </h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/auth/login");
            }}
            className="text-xs text-foreground/60 hover:text-red-500 transition-colors font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Feed de posts */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      </main>
    </div>
  );
}
