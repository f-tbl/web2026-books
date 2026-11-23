import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-svh">
      <header className="flex gap-4 border-b px-6 py-3">
        <Link to="/" className="font-semibold">
          Biblioteca
        </Link>
      </header>
      <Outlet />
    </div>
  ),
})
