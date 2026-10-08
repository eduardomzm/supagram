"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getTimeAgo } from "../utils/time";

import type { Post } from "../mocks/posts";
import { supabase } from "../lib/supabase";
import Modal from "../components/Modal";

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-red-500"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

export default function RankPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    async function getPosts() {
      const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .order('likes', { ascending: false });
      
      if (posts) {
        setPosts(posts);
      }
    }
    
    getPosts();
  }, []);
  
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card-bg/95 backdrop-blur-md border-b-2 border-primary">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-black bg-gradient-to-r from-amber-400 via-red-500 to-primary bg-clip-text text-transparent flex items-center gap-2">
            <span>🏆</span> Ranking de Publicaciones
          </h1>
          <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            Top Fotos ⭐
          </span>
        </div>
      </header>

      {/* Grid de posts */}
      <main className="max-w-2xl mx-auto p-3">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-card-bg rounded-2xl border border-border p-6 shadow-sm">
            <span className="text-4xl">🏆</span>
            <p className="text-foreground font-bold mt-2">Cargando las mejores publicaciones...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {[...posts].sort((a, b) => b.likes - a.likes).map((post, idx) => (
              <button
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="relative aspect-square overflow-hidden rounded-xl group border border-border/50 shadow-sm"
              >
                <Image
                  src={post.image_url}
                  alt={`Post con ${post.likes} me gusta`}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                
                {/* Crown / Trophy badge for Top 3 */}
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 z-10 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-md">
                    🥇 #1
                  </span>
                )}
                {idx === 1 && (
                  <span className="absolute top-1.5 left-1.5 z-10 bg-slate-300 text-black text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-md">
                    🥈 #2
                  </span>
                )}
                {idx === 2 && (
                  <span className="absolute top-1.5 left-1.5 z-10 bg-amber-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-md">
                    🥉 #3
                  </span>
                )}

                {/* Overlay con likes al hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                  <HeartIcon />
                  <span className="text-white font-extrabold text-xs">
                    {post.likes.toLocaleString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedPost && (
        <Modal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}
