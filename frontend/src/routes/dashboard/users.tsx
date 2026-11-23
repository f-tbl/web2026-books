import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { usersApi, type User } from '@/lib/api'
import { requireAdmin } from '@/lib/guards'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const Route = createFileRoute('/dashboard/users')({
  beforeLoad: requireAdmin,
  loader: () => usersApi.list(),
  component: ManageUsers,
})

function ManageUsers() {
  const users = Route.useLoaderData()
  const { user: me } = Route.useRouteContext()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  async function toggleRole(user: User) {
    setError(null)
    setBusy(user._id)
    try {
      await usersApi.setRole(user._id, user.role === 'admin' ? 'user' : 'admin')
      await router.invalidate()
    } catch (err) {
      setError(`No se pudo cambiar el rol de ${user.name}: ${(err as Error).message}`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Usuarios</h1>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>{user.role}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {user._id === me.id ? (
                  <span className="text-xs text-muted-foreground">Vos</span>
                ) : (
                  <Button size="sm" variant="outline" disabled={busy === user._id} onClick={() => toggleRole(user)}>
                    {user.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
