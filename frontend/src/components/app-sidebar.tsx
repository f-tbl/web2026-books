import { Link, useLocation } from '@tanstack/react-router'
import { BookPlus, Library, LogOut, Settings2, Users } from 'lucide-react'
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

const groups = [
  {
    label: 'Biblioteca',
    adminOnly: false,
    items: [
      { to: '/dashboard', label: 'Libros', icon: Library },
    ],
  },
  {
    label: 'Panel de admin',
    adminOnly: true,
    items: [
      { to: '/dashboard/manage', label: 'Administrar libros', icon: Settings2 },
      { to: '/dashboard/new', label: 'Agregar libro', icon: BookPlus },
      { to: '/dashboard/users', label: 'Usuarios', icon: Users },
    ],
  },
] as const

type Props = { userName: string; isAdmin: boolean; onSignOut: () => void }

export function AppSidebar({ userName, isAdmin, onSignOut }: Props) {
  const pathname = useLocation({ select: (l) => l.pathname })
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3 font-semibold">Biblioteca</SidebarHeader>
      <SidebarContent>
        {groups
          .filter((g) => isAdmin || !g.adminOnly)
          .map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(({ to, label, icon: Icon }) => (
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
          ))}
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
