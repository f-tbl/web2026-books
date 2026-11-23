import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";

const AFTER_LOGIN = "/dashboard";

// Lucide 1.x ya no trae íconos de marcas: logo oficial de GitHub (Octicons, mark-github).
function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setLoading(true);
    setError(null);
    const { error } = isLogin
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({
          name: String(form.get("name")),
          email,
          password,
        });
    setLoading(false);
    if (error) return setError(error.message ?? "Ocurrió un error");
    navigate({ to: AFTER_LOGIN });
  }

  function withGithub() {
    authClient.signIn.social({ provider: "github", callbackURL: AFTER_LOGIN });
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center p-6">
      <div className="absolute top-3 right-3">
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          Books - Francisco Tabellione
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? "Iniciar sesión" : "Crear cuenta"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Ingresá con tu email o con GitHub."
                : "Registrate con tu email o con GitHub."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" required autoComplete="name" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Enviando…" : isLogin ? "Ingresar" : "Registrarme"}
              </Button>
            </form>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />o
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button variant="outline" onClick={withGithub}>
              <GithubIcon />
              Continuar con GitHub
            </Button>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}&nbsp;
            <Link to={isLogin ? "/register" : "/"} className="underline">
              {isLogin ? "Registrate" : "Iniciá sesión"}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
