"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabase";

export default function CreatePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadAndCreatePost = async (file: File) => {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || "11111111-1111-1111-1111-111111111111";

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("supagram")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Error al subir imagen:", uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from("supagram")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        image_url: publicUrl,
        caption: caption,
        likes: 0,
      })
      .select("*");

    if (postError) {
      console.error("❌ Error creando el post:", postError);
      throw postError;
    }

    return {
      uploadedImageUrl: publicUrl,
      newPost: postData,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setMessage({ type: "error", text: "Por favor selecciona una foto" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await uploadAndCreatePost(imageFile);

      setMessage({ type: "success", text: "¡Publicación creada exitosamente!" });
      setImageFile(null);
      setImagePreview(null);
      setCaption("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error al crear la publicación",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card-bg/95 backdrop-blur-md border-b-2 border-primary">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-black bg-gradient-to-r from-primary via-red-500 to-amber-400 bg-clip-text text-transparent">
            Crear publicación
          </h1>
        </div>
      </header>

      {/* Formulario */}
      <main className="max-w-lg mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Área de carga de imagen */}
          <div className="flex flex-col gap-2">
            {imagePreview ? (
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-card-bg border-2 border-primary/40 shadow-lg">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white hover:bg-red-700 transition-colors shadow-md"
                  aria-label="Eliminar imagen"
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
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center gap-3 aspect-square w-full rounded-2xl border-2 border-dashed border-primary/40 bg-card-bg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all shadow-sm group"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-4xl">📸</span>
                </div>
                <span className="text-foreground font-bold text-sm">
                  Haz clic para seleccionar una foto
                </span>
                <span className="text-foreground/50 text-xs">
                  Formatos JPG, PNG, WEBP permitidos
                </span>
              </label>
            )}
            
            <input
              ref={fileInputRef}
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Caption */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-primary tracking-wider px-1">
              Descripción
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escribe una descripción para tu foto..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-card-bg border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none text-sm font-medium"
            />
          </div>

          {/* Mensaje de estado */}
          {message && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Botón de enviar */}
          <button
            type="submit"
            disabled={isLoading || !imageFile}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary via-red-600 to-amber-500 text-white font-extrabold shadow-lg shadow-primary/30 hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm border border-amber-400/30"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Publicando...
              </>
            ) : (
              "Publicar"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}