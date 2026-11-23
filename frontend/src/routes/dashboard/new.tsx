import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { booksApi } from '@/lib/api'
import { BookForm } from '@/components/book-form'

export const Route = createFileRoute('/dashboard/new')({
  component: NewBook,
})

function NewBook() {
  const navigate = useNavigate()
  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Agregar libro</h1>
      <BookForm
        onSubmit={async (data) => {
          await booksApi.create(data)
          await navigate({ to: '/dashboard/mine' })
        }}
      />
    </main>
  )
}
