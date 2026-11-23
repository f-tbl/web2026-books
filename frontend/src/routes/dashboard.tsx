import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { booksApi, type Book } from '@/lib/api'
import { BookFormDialog } from '@/components/book-form-dialog'
import { Badge } from '@/components/ui/badge'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (!data) throw redirect({ to: '/' })
    return { user: data.user }
  },
  loader: () => booksApi.list(),
  component: Dashboard,
})

// Fechas guardadas a medianoche UTC: se muestran en UTC para no correr un día.
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-AR', { timeZone: 'UTC' })

function Dashboard() {
  const { user } = Route.useRouteContext()
  const books = Route.useLoaderData()
  const router = useRouter()
  const navigate = useNavigate()
  const isAdmin = user.role === 'admin'

  // Después de cada cambio se vuelve a correr el loader.
  const refresh = () => router.invalidate()

  async function signOut() {
    await authClient.signOut()
    navigate({ to: '/' })
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Libros</h1>
          <p className="text-sm text-muted-foreground">
            {user.name} · <Badge variant="secondary">{user.role}</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <BookFormDialog
              trigger={<Button>Nuevo libro</Button>}
              onSubmit={(data) => booksApi.create(data).then(refresh)}
            />
          )}
          <Button variant="outline" onClick={signOut}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      {books.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">Todavía no hay libros cargados.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead className="text-right">Páginas</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead>Estado</TableHead>
              {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell className="text-right">{book.pages}</TableCell>
                <TableCell>{formatDate(book.publishedAt)}</TableCell>
                <TableCell>
                  <Badge variant={book.available ? 'default' : 'outline'}>
                    {book.available ? 'Disponible' : 'No disponible'}
                  </Badge>
                </TableCell>
                {isAdmin && (
                  <TableCell className="flex justify-end gap-2">
                    <BookFormDialog
                      book={book}
                      trigger={
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                      }
                      onSubmit={(data) => booksApi.update(book._id, data).then(refresh)}
                    />
                    <DeleteButton book={book} onConfirm={() => booksApi.remove(book._id).then(refresh)} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  )
}

function DeleteButton({ book, onConfirm }: { book: Book; onConfirm: () => Promise<unknown> }) {
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
