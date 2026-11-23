import { Link, useLocation } from '@tanstack/react-router'
import { BookPlus, Library, LogOut, Settings2 } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const items = [
  { to: '/dashboard', label: 'Libros', icon: Library },
  { to: '/dashboard/new', label: 'Agregar libro', icon: BookPlus },
  { to: '/dashboard/manage', label: 'Administrar', icon: Settings2 },
] as const

export function AppSidebar({ userName, onSignOut }: { userName: string; onSignOut: () => void }) {
  const pathname = useLocation({ select: (l) => l.pathname })
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3 font-semibold">Biblioteca</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Panel de admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={pathname === to}>
                    <Link to={to}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <p className="truncate px-2 pb-1 text-xs text-muted-foreground">{userName}</p>
            <SidebarMenuButton onClick={onSignOut}>
              <LogOut />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
