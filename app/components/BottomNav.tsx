"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.06l8.69-8.689z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function RankIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385c.116.488-.415.871-.84.62l-4.757-2.617a.562.562 0 0 0-.54 0l-4.757 2.617c-.425.251-.956-.132-.84-.62l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card-bg/95 backdrop-blur-md border-t-2 border-primary/30 shadow-2xl">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-all ${
            pathname === "/" ? "text-primary scale-105 font-bold" : "text-foreground/60 hover:text-primary"
          }`}
        >
          <HomeIcon active={pathname === "/"} />
          <span className="text-[11px]">Inicio</span>
        </Link>

        <Link
          href="/post"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-primary via-red-600 to-amber-500 text-white shadow-lg shadow-primary/40 hover:scale-110 active:scale-95 transition-all ring-2 ring-accent/50"
          aria-label="Crear publicación"
        >
          <PlusIcon />
        </Link>

        <Link
          href="/rank"
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${
            pathname === "/rank" ? "text-accent scale-105 font-bold" : "text-foreground/60 hover:text-accent"
          }`}
        >
          <RankIcon active={pathname === "/rank"} />
          <span className="text-[11px]">Ranking</span>
        </Link>
      </div>
    </nav>
  );
}
