import type { FormEvent, ReactNode } from 'react'
import { ArrowDownWideNarrow, ArrowUpNarrowWide, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { SORT_FIELDS, type Book, type ListSearch, type Page } from '@/lib/api'
import { BooksTable } from '@/components/books-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  data: Page<Book>
  search: ListSearch
  onSearch: (search: ListSearch) => void
  actions?: (book: Book) => ReactNode
}

// Búsqueda + orden + tabla + paginación. El estado vive en la URL (search params de la ruta).
export function PaginatedBooks({ data, search, onSearch, actions }: Props) {
  const { q = '', sort = 'createdAt', order = 'desc' } = search
  // Cualquier cambio de búsqueda u orden vuelve a la página 1.
  const set = (patch: ListSearch) => onSearch({ ...search, page: undefined, ...patch })

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    set({ q: String(new FormData(e.currentTarget).get('q')).trim() || undefined })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <form onSubmit={submit} role="search" className="flex min-w-56 flex-1 gap-2">
          <Input
            key={q}
            name="q"
            type="search"
            aria-label="Buscar por título o autor"
            placeholder="Buscar por título o autor…"
            defaultValue={q}
          />
          <Button type="submit" variant="outline">
            <Search />
            Buscar
          </Button>
        </form>
        <select
          aria-label="Ordenar por"
          value={sort}
          onChange={(e) => set({ sort: e.target.value as ListSearch['sort'] })}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm dark:bg-input/30"
        >
          {Object.entries(SORT_FIELDS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          onClick={() => set({ order: order === 'asc' ? 'desc' : 'asc' })}
          aria-label={order === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
          title={order === 'asc' ? 'Ascendente' : 'Descendente'}
        >
          {order === 'asc' ? <ArrowUpNarrowWide /> : <ArrowDownWideNarrow />}
        </Button>
      </div>

      <BooksTable
        books={data.items}
        actions={actions}
        emptyText={q ? `No hay resultados para “${q}”.` : undefined}
      />

      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          {data.total} {data.total === 1 ? 'libro' : 'libros'}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={data.page <= 1}
            onClick={() => onSearch({ ...search, page: data.page - 1 })}
          >
            <ChevronLeft />
            Anterior
          </Button>
          <span>
            Página {data.page} de {data.pages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={data.page >= data.pages}
            onClick={() => onSearch({ ...search, page: data.page + 1 })}
          >
            Siguiente
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
