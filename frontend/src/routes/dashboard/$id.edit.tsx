import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { booksApi, canEdit } from '@/lib/api'
import { requireAdmin } from '@/lib/guards'
import { BookForm } from '@/components/book-form'

export const Route = createFileRoute('/dashboard/$id/edit')({
  beforeLoad: requireAdmin,
  loader: async ({ params, context: { user } }) => {
    const book = await booksApi.get(params.id)
    // El backend igual responde 403 si no es suyo.
    if (!canEdit(book, user.id)) throw redirect({ to: '/dashboard/manage' })
    return book
  },
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
