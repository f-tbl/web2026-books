import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

// shortcut: página mínima a donde redirige el login; el listado de libros viene después.
export const Route = createFileRoute('/books')({
  component: Books,
})

function Books() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return null

  async function signOut() {
    await authClient.signOut()
    navigate({ to: '/' })
  }

  return (
    <main className="flex flex-col items-center gap-4 p-10">
      <p>{session ? `Hola, ${session.user.name}` : 'No iniciaste sesión.'}</p>
      {session && (
        <Button variant="outline" onClick={signOut}>
          Cerrar sesión
        </Button>
      )}
    </main>
  )
}
