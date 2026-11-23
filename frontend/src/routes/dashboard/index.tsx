import { createFileRoute } from '@tanstack/react-router'
import { booksApi } from '@/lib/api'
import { BooksTable } from '@/components/books-table'

export const Route = createFileRoute('/dashboard/')({
  loader: () => booksApi.list(),
  component: BooksList,
})

function BooksList() {
  const books = Route.useLoaderData()
  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Libros</h1>
      <BooksTable books={books} />
    </main>
  )
}
