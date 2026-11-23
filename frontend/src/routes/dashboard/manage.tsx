import { createFileRoute, Link } from '@tanstack/react-router'
import { booksApi, canEdit, parseListSearch } from '@/lib/api'
import { requireAdmin } from '@/lib/guards'
import { PaginatedBooks } from '@/components/paginated-books'
import { BookActions } from '@/components/book-actions'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/dashboard/manage')({
  beforeLoad: requireAdmin,
  validateSearch: parseListSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => booksApi.list(deps),
  component: ManageBooks,
})

function ManageBooks() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const { user } = Route.useRouteContext()
  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Administrar libros</h1>
        <Button asChild>
          <Link to="/dashboard/new">Agregar libro</Link>
        </Button>
      </div>
      <PaginatedBooks
        data={data}
        search={search}
        onSearch={(s) => navigate({ search: s })}
        actions={(book) => canEdit(book, user.id) && <BookActions book={book} />}
      />
    </main>
  )
}
