import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { booksApi } from '@/lib/api'
import { BookForm } from '@/components/book-form'

export const Route = createFileRoute('/dashboard/$id/edit')({
  loader: async ({ params, context: { user } }) => {
    const book = await booksApi.get(params.id)
    // Solo el dueño o un admin; el backend igual responde 403.
    if (user.role !== 'admin' && book.ownerId !== user.id) throw redirect({ to: '/dashboard/mine' })
    return book
  },
  errorComponent: () => <p className="p-6 text-muted-foreground">No se encontró el libro.</p>,
  component: EditBook,
})

function EditBook() {
  const book = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Editar “{book.title}”</h1>
      <BookForm
        book={book}
        onSubmit={async (data) => {
          await booksApi.update(book._id, data)
          await navigate({ to: user.role === 'admin' ? '/dashboard/manage' : '/dashboard/mine' })
        }}
      />
    </main>
  )
}
