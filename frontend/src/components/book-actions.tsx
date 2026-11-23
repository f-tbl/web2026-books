import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { booksApi, type Book } from '@/lib/api'
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

// Botones Editar / Eliminar de una fila. Al borrar recarga el listado de la ruta actual.
export function BookActions({ book }: { book: Book }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function remove() {
    setError(null)
    try {
      await booksApi.remove(book._id)
      await router.invalidate()
    } catch (err) {
      setError(`No se pudo eliminar: ${(err as Error).message}`)
    }
  }

  return (
    <>
      {error && (
        <span role="alert" className="self-center text-xs text-destructive">
          {error}
        </span>
      )}
      <Button size="sm" variant="outline" asChild>
        <Link to="/dashboard/$id/edit" params={{ id: book._id }}>
          Editar
        </Link>
      </Button>
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
            <AlertDialogAction variant="destructive" onClick={remove}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
