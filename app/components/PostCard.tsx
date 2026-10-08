import Image from "next/image";
import { Post } from "../mocks/posts";
import { getTimeAgo } from "../utils/time";
import HeartIcon from "./HeartIcon";

export default function PostCard({ post, onLike }: { post: Post; onLike: (id: number | string) => void }) {
  return (
    <article className="bg-card-bg border border-border rounded-2xl overflow-hidden shadow-md transition-all hover:border-primary/40">
      {/* Header con usuario y avatar */}
      <div className="flex items-center justify-between p-3.5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary bg-chivas-navy/20">
            <Image
              src={post.user?.avatar || 'https://zjrkhyvcebchjfebpbiw.supabase.co/storage/v1/object/public/supagram/profiles/847591592417500868.jpg'}
              alt={post.user?.username || 'Usuario'}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm">@{post.user?.username || 'usuario'}</span>
            <span className="text-[11px] text-foreground/50">{getTimeAgo(post.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Imagen del post */}
      <div className="relative w-full aspect-square bg-slate-950">
        <Image
          src={post.image_url}
          alt={`Post de ${post.user?.username || 'usuario'}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Acciones y caption */}
      <div className="p-4">
        {/* Botón de like con contador */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onLike(post.id)}
            className="hover:scale-115 transition-transform active:scale-90 p-1"
            aria-label={post.isLiked ? "Quitar me gusta" : "Dar me gusta"}
          >
            <HeartIcon filled={post.isLiked} />
          </button>
          <span className="font-bold text-sm text-foreground">
            {post.likes.toLocaleString()} <span className="text-foreground/70 font-normal">me gusta</span>
          </span>
        </div>

        {/* Caption */}
        <p className="mt-2.5 text-sm text-foreground leading-relaxed">
          <span className="font-extrabold text-primary">@{post.user?.username || 'usuario'}</span>{" "}
          <span className="text-foreground/90">{post.caption}</span>
        </p>
      </div>
    </article>
  );
}