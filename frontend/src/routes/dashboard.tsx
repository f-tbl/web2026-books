import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { AppSidebar } from '@/components/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

// Layout de /dashboard/*: exige sesión y, si es admin, muestra la sidebar.
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (!data) throw redirect({ to: '/' })
    return { user: data.user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()

  async function signOut() {
    await authClient.signOut()
    navigate({ to: '/' })
  }

  if (user.role !== 'admin') {
    return (
      <>
        <header className="flex items-center justify-between border-b px-6 py-3">
          <span className="font-semibold">Biblioteca</span>
          <div className="flex items-center gap-3 text-sm">
            {user.name} <Badge variant="secondary">{user.role}</Badge>
            <ModeToggle />
            <Button size="sm" variant="outline" onClick={signOut}>
              Cerrar sesión
            </Button>
          </div>
        </header>
        <Outlet />
      </>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar userName={user.name} onSignOut={signOut} />
      <SidebarInset>
        <header className="flex items-center gap-2 border-b px-4 py-3">
          <SidebarTrigger />
          <Badge variant="secondary">admin</Badge>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
