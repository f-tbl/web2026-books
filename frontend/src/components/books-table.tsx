import type { ReactNode } from 'react'
import type { Book } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Fechas guardadas a medianoche UTC: se muestran en UTC para no correr un día.
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-AR', { timeZone: 'UTC' })

export function BooksTable({ books, actions }: { books: Book[]; actions?: (book: Book) => ReactNode }) {
  if (books.length === 0) {
    return <p className="py-10 text-center text-muted-foreground">Todavía no hay libros cargados.</p>
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead className="text-right">Páginas</TableHead>
          <TableHead>Publicado</TableHead>
          <TableHead>Estado</TableHead>
          {actions && <TableHead className="text-right">Acciones</TableHead>}
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
            {actions && <TableCell className="flex justify-end gap-2">{actions(book)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
