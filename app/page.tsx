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
          <div className="w-10 h-10 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
          <p className="text-foreground/70 text-sm font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card-bg/95 backdrop-blur-md border-b-2 border-primary shadow-md">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-red-500 to-amber-400 bg-clip-text text-transparent">
            Supagram
          </h1>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/auth/login");
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Feed de posts */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-card-bg rounded-2xl border border-border p-6 shadow-sm">
            <p className="text-foreground font-bold">Aún no hay publicaciones</p>
            <p className="text-xs text-foreground/60 mt-1">¡Sé el primero en compartir una foto!</p>
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
