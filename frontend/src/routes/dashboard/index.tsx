import { createFileRoute } from '@tanstack/react-router'
import { booksApi, parseListSearch } from '@/lib/api'
import { PaginatedBooks } from '@/components/paginated-books'

export const Route = createFileRoute('/dashboard/')({
  validateSearch: parseListSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => booksApi.list(deps),
  component: BooksList,
})

function BooksList() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Libros</h1>
      <PaginatedBooks data={data} search={search} onSearch={(s) => navigate({ search: s })} />
    </main>
  )
}
