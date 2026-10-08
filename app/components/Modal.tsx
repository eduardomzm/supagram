import Image from "next/image";
import { Post } from "../mocks/posts";
import { getTimeAgo } from "../utils/time";
import HeartIcon from "./HeartIcon";

export default function Modal({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-card-bg border-2 border-primary/40 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white hover:bg-red-700 transition-colors shadow-md"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header con usuario */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary bg-chivas-navy/20">
            <Image
              src={post.user?.avatar || 'https://zjrkhyvcebchjfebpbiw.supabase.co/storage/v1/object/public/supagram/profiles/847591592417500868.jpg'}
              alt={post.user?.username || 'Chivano'}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">@{post.user?.username || 'chivano_oficial'}</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                🔴⚪
              </span>
            </div>
            <span className="text-xs text-foreground/50">{getTimeAgo(post.created_at)}</span>
          </div>
        </div>

        {/* Imagen */}
        <div className="relative w-full aspect-square bg-slate-950">
          <Image
            src={post.image_url}
            alt={`Post de ${post.user?.username || 'Chivano'}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Likes y caption */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <HeartIcon filled={true} />
            <span className="text-base font-extrabold text-foreground">
              {post.likes.toLocaleString()} <span className="text-foreground/70 font-normal text-sm">me gusta</span>
            </span>
          </div>
          <p className="mt-2.5 text-sm text-foreground">
            <span className="font-extrabold text-primary">@{post.user?.username || 'chivano_oficial'}</span>{" "}
            <span className="text-foreground/90">{post.caption}</span>
          </p>
        </div>
      </div>
    </div>
  );
}