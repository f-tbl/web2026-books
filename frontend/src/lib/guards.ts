import { redirect } from '@tanstack/react-router'

// Para beforeLoad de las páginas de admin; el backend igual valida con 403.
export function requireAdmin({ context }: { context: { user: { role?: string | null } } }) {
  if (context.user.role !== 'admin') throw redirect({ to: '/dashboard' })
}
