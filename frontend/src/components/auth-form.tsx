import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const AFTER_LOGIN = '/dashboard'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isLogin = mode === 'login'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))
    setLoading(true)
    setError(null)
    const { error } = isLogin
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ name: String(form.get('name')), email, password })
    setLoading(false)
    if (error) return setError(error.message ?? 'Ocurrió un error')
    navigate({ to: AFTER_LOGIN })
  }

  function withGithub() {
    authClient.signIn.social({ provider: 'github', callbackURL: AFTER_LOGIN })
  }

  return (
    <main className="flex justify-center p-6 pt-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Ingresá con tu email o con GitHub.' : 'Registrate con tu email o con GitHub.'}
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
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando…' : isLogin ? 'Ingresar' : 'Registrarme'}
            </Button>
          </form>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />o<span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" onClick={withGithub}>
            Continuar con GitHub
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}&nbsp;
          <Link to={isLogin ? '/register' : '/'} className="underline">
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
