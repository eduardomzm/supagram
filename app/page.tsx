"use client";

import { useState, useEffect } from "react";
import { Post, Comment } from "./types";
import { supabase } from "./lib/supabase";
import PostCard from "./components/PostCard";


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener usuario autenticado
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLike = async (postId: number | string) => {
    if (!currentUserId) return;

    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost) return;

    const wasLiked = !!targetPost.isLiked;

    // Actualización optimista en la interfaz
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !wasLiked,
              likes_count: wasLiked
                ? Math.max(0, post.likes_count - 1)
                : post.likes_count + 1,
            }
          : post
      )
    );

    try {
      if (wasLiked) {
        const { error: deleteError } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", currentUserId);

        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase
          .from("likes")
          .insert({
            post_id: postId,
            user_id: currentUserId,
          });

        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error("Error al actualizar like:", err);
      // Revertir en caso de error
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: wasLiked,
                likes_count: targetPost.likes_count,
              }
            : post
        )
      );
    }
  };

  const handleComment = async (postId: number | string, body: string) => {
    if (!currentUserId || !body.trim()) return;

    try {
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: currentUserId,
          body: body.trim(),
        })
        .select("id, user_id, post_id, body, created_at")
        .single();

      if (commentError) throw commentError;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", currentUserId)
        .single();

      const newComment: Comment = {
        ...commentData,
        profile: profileData || undefined,
      };

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment],
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error al publicar comentario:", err);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

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
        setIsLoading(false);
        return;
      }

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setIsLoading(false);
        return;
      }

      const postIds = postsData.map((p) => p.id);
      const userIds = [...new Set(postsData.map((p) => p.user_id))];

      // 2. Obtener profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      const profilesMap = new Map(
        profilesData?.map((p) => [p.id, { username: p.username, avatar_url: p.avatar_url }]) || []
      );

      // 3. Contar likes por post
      const { data: likesCountData } = await supabase
        .from("likes")
        .select("post_id")
        .in("post_id", postIds);

      const likesCountMap = new Map<string | number, number>();
      likesCountData?.forEach((like) => {
        const count = likesCountMap.get(like.post_id) || 0;
        likesCountMap.set(like.post_id, count + 1);
      });

      // 4. Verificar likes del usuario actual
      let userLikesSet = new Set<string | number>();
      if (currentUserId) {
        const { data: userLikesData } = await supabase
          .from("likes")
          .select("post_id")
          .eq("user_id", currentUserId)
          .in("post_id", postIds);

        userLikesSet = new Set(userLikesData?.map((l) => l.post_id) || []);
      }

      // 5. Obtener comentarios
      const { data: commentsData } = await supabase
        .from("comments")
        .select("id, user_id, post_id, body, created_at")
        .in("post_id", postIds)
        .order("created_at", { ascending: true });

      // Obtener profiles de comentadores
      const commenterIds = [...new Set(commentsData?.map((c) => c.user_id) || [])];
      let commenterProfilesMap = new Map<string, { username: string; avatar_url: string | null }>();
      if (commenterIds.length > 0) {
        const { data: commenterProfiles } = await supabase
          .from("profiles")
          .select("id, username, avatar_url")
          .in("id", commenterIds);

        commenterProfilesMap = new Map(
          commenterProfiles?.map((p) => [p.id, { username: p.username, avatar_url: p.avatar_url }]) || []
        );
      }

      // Agrupar comentarios por post
      const commentsMap = new Map<string | number, Comment[]>();
      commentsData?.forEach((comment) => {
        const postComments = commentsMap.get(comment.post_id) || [];
        postComments.push({
          ...comment,
          profile: commenterProfilesMap.get(comment.user_id),
        });
        commentsMap.set(comment.post_id, postComments);
      });

      // 6. Combinar todo
      const postsWithData: Post[] = postsData.map((post) => ({
        ...post,
        profile: profilesMap.get(post.user_id),
        likes_count: likesCountMap.get(post.id) || 0,
        isLiked: userLikesSet.has(post.id),
        comments: commentsMap.get(post.id) || [],
      }));

      setPosts(postsWithData);
      setIsLoading(false);
    };

    fetchPosts();
  }, [currentUserId]);

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
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12 text-foreground/50">
            Cargando posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-foreground/50">
            No hay posts aún. ¡Sé el primero en compartir!
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}