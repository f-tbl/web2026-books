import { useEffect } from 'react'
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { AppSidebar } from '@/components/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { Badge } from '@/components/ui/badge'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

// Layout de /dashboard/*: beforeLoad exige sesión al entrar; useSession la mantiene al día después.
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (!data) throw redirect({ to: '/' })
    return { user: data.user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user: initialUser } = Route.useRouteContext()
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  // useSession se actualiza solo (signOut, sesión vencida, cierre en otra pestaña): sin sesión, al login.
  useEffect(() => {
    if (!isPending && !session) navigate({ to: '/' })
  }, [isPending, session, navigate])

  const user = session?.user ?? initialUser

  return (
    <SidebarProvider>
      <AppSidebar userName={user.name} isAdmin={user.role === 'admin'} onSignOut={() => authClient.signOut()} />
      <SidebarInset>
        <header className="flex items-center gap-2 border-b px-4 py-3">
          <SidebarTrigger />
          <Badge variant="secondary">{user.role}</Badge>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
