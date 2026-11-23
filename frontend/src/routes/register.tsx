import { createFileRoute, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { AuthForm } from '@/components/auth-form'

export const Route = createFileRoute('/register')({
  // Con sesión iniciada no tiene sentido ver el registro.
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (data) throw redirect({ to: '/dashboard' })
  },
  component: () => <AuthForm mode="register" />,
})
