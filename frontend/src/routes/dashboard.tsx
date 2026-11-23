import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { AppSidebar } from '@/components/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { Badge } from '@/components/ui/badge'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

// Layout de /dashboard/*: exige sesión. La sidebar muestra el panel de admin solo a admins.
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

  return (
    <SidebarProvider>
      <AppSidebar userName={user.name} isAdmin={user.role === 'admin'} onSignOut={signOut} />
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
