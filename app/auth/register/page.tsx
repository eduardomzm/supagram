"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

function UserIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function MailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

function LockIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}

function EyeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function EyeOffIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

function AlertCircleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function SpinnerIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [usernameError, setUsernameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validateUsername = (value: string) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!value) {
      return "El nombre de usuario es requerido";
    }
    if (value.length < 3) {
      return "Mínimo 3 caracteres";
    }
    if (value.length > 20) {
      return "Máximo 20 caracteres";
    }
    if (!regex.test(value)) {
      return "Solo letras, números y guión bajo (_)";
    }
    return "";
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().trim();
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const checkUsernameAvailable = async (uname: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", uname)
        .maybeSingle();

      if (error) {
        const { data: userData } = await supabase
          .from("users")
          .select("username")
          .eq("username", uname)
          .maybeSingle();
        return !userData;
      }
      return !data;
    } catch {
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const uValidation = validateUsername(username);
    if (uValidation) {
      setMessage({ type: "error", text: uValidation });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres" });
      setIsLoading(false);
      return;
    }

    const isAvailable = await checkUsernameAvailable(username);
    if (!isAvailable) {
      setMessage({ type: "error", text: "Este nombre de usuario ya está registrado" });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username,
            role: "user",
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            username: username,
            avatar_url: null,
            updated_at: new Date().toISOString(),
          });
        } catch {
          // Trigger fallback
        }
      }

      setMessage({
        type: "success",
        text: "¡Registro exitoso! Revisa tu correo o inicia sesión.",
      });

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error al registrar tu cuenta",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden chivas-stripes">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary/25 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-red-500 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
            Supagram
          </h1>
          <p className="text-foreground/70 text-sm mt-2 font-medium">
            Crea tu cuenta gratis
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card-bg/95 backdrop-blur-md border-2 border-primary/40 shadow-2xl rounded-3xl p-6 sm:p-8 transition-all">
          {/* Segmented Control / Tabs */}
          <div className="flex bg-background/90 p-1 rounded-2xl border border-border mb-6">
            <Link
              href="/auth/login"
              className="flex-1 py-2.5 text-sm font-semibold text-foreground/60 hover:text-foreground rounded-xl transition-all text-center"
            >
              Iniciar sesión
            </Link>
            <button
              type="button"
              className="flex-1 py-2.5 text-sm font-extrabold rounded-xl bg-primary text-white shadow-md transition-all text-center"
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* 1. Nombre de usuario */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-username" className="text-xs font-bold uppercase tracking-wider text-primary px-1">
                Nombre de usuario
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-primary/60 pointer-events-none">
                  <UserIcon />
                </div>
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="ej. usuario_123"
                  required
                  minLength={3}
                  maxLength={20}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl bg-background border text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-medium ${
                    usernameError ? "border-red-500/80 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
                />
              </div>
              {usernameError && (
                <span className="text-red-500 text-xs px-1 font-semibold">{usernameError}</span>
              )}
            </div>

            {/* 2. Correo electrónico */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-wider text-primary px-1">
                Correo electrónico
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-primary/60 pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@ejemplo.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-background border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* 3. Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-xs font-bold uppercase tracking-wider text-primary px-1">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-primary/60 pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-background border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-foreground/40 hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* 4. Repetir contraseña */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-confirm-password" className="text-xs font-bold uppercase tracking-wider text-primary px-1">
                Repetir contraseña
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-primary/60 pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu contraseña"
                  required
                  minLength={6}
                  className={`w-full pl-11 pr-11 py-3 rounded-2xl bg-background border text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-medium ${
                    passwordsDontMatch
                      ? "border-red-500/80 focus:border-red-500"
                      : passwordsMatch
                      ? "border-green-500/80 focus:border-green-500"
                      : "border-border focus:border-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-foreground/40 hover:text-foreground transition-colors p-1"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Confirm Indicator */}
              {passwordsMatch && (
                <span className="text-green-500 text-xs px-1 font-bold flex items-center gap-1">
                  <CheckCircleIcon className="w-3.5 h-3.5" /> Las contraseñas coinciden
                </span>
              )}
              {passwordsDontMatch && (
                <span className="text-red-500 text-xs px-1 font-bold flex items-center gap-1">
                  <AlertCircleIcon className="w-3.5 h-3.5" /> Las contraseñas no coinciden
                </span>
              )}
            </div>

            {/* Mensaje de estado */}
            {message && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all mt-1 ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircleIcon className="w-5 h-5 shrink-0 text-green-500" />
                ) : (
                  <AlertCircleIcon className="w-5 h-5 shrink-0 text-red-500" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary via-red-600 to-amber-500 hover:from-red-600 hover:to-primary text-white font-extrabold shadow-lg shadow-primary/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm border border-amber-400/30"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-5 h-5" />
                  <span>Registrando...</span>
                </>
              ) : (
                <span>Crear cuenta</span>
              )}
            </button>
          </form>

          {/* Footer Card Navigation */}
          <div className="mt-6 pt-6 border-t border-border/60 text-center">
            <p className="text-xs text-foreground/80 font-medium">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="font-extrabold text-primary hover:text-red-500 underline decoration-2 underline-offset-4 transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}