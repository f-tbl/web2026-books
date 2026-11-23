import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { booksApi } from '@/lib/api'
import { requireAdmin } from '@/lib/guards'
import { BookForm } from '@/components/book-form'

export const Route = createFileRoute('/dashboard/$id/edit')({
  beforeLoad: requireAdmin,
  loader: ({ params }) => booksApi.get(params.id),
  errorComponent: () => <p className="p-6 text-muted-foreground">No se encontró el libro.</p>,
  component: EditBook,
})

function EditBook() {
  const book = Route.useLoaderData()
  const navigate = useNavigate()
  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Editar “{book.title}”</h1>
      <BookForm
        book={book}
        onSubmit={async (data) => {
          await booksApi.update(book._id, data)
          await navigate({ to: '/dashboard/manage' })
        }}
      />
    </main>
  )
}
