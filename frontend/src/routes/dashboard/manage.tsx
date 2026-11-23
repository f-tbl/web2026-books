import { useState } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { booksApi, type Book } from '@/lib/api'
import { requireAdmin } from '@/lib/guards'
import { BooksTable } from '@/components/books-table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export const Route = createFileRoute('/dashboard/manage')({
  beforeLoad: requireAdmin,
  loader: () => booksApi.list(),
  component: ManageBooks,
})

function ManageBooks() {
  const books = Route.useLoaderData()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function remove(book: Book) {
    setError(null)
    try {
      await booksApi.remove(book._id)
      await router.invalidate()
    } catch (err) {
      setError(`No se pudo eliminar “${book.title}”: ${(err as Error).message}`)
    }
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Administrar libros</h1>
        <Button asChild>
          <Link to="/dashboard/new">Agregar libro</Link>
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <BooksTable
        books={books}
        actions={(book) => (
          <>
            <Button size="sm" variant="outline" asChild>
              <Link to="/dashboard/$id/edit" params={{ id: book._id }}>
                Editar
              </Link>
            </Button>
            <DeleteButton book={book} onConfirm={() => remove(book)} />
          </>
        )}
      />
    </main>
  )
}

function DeleteButton({ book, onConfirm }: { book: Book; onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar “{book.title}”?</AlertDialogTitle>
          <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
