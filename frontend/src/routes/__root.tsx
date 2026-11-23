import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TooltipProvider } from '@/components/ui/tooltip'

export const Route = createRootRoute({
  component: () => (
    <TooltipProvider>
      <div className="min-h-svh">
        <Outlet />
      </div>
    </TooltipProvider>
  ),
})
