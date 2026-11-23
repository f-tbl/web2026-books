export type Book = {
  _id: string
  title: string
  author: string
  pages: number
  publishedAt: string
  available: boolean
  ownerId?: string
}

export type BookInput = Omit<Book, '_id' | 'ownerId'>

export type User = { _id: string; name: string; email: string; role: 'user' | 'admin' }

export const SORT_FIELDS = {
  createdAt: 'Fecha de carga',
  title: 'Título',
  author: 'Autor',
  pages: 'Páginas',
  publishedAt: 'Publicado',
} as const

// Todo opcional: lo que falta lo completa el backend con sus defaults (más reciente primero, página 1).
export type ListSearch = {
  q?: string
  sort?: keyof typeof SORT_FIELDS
  order?: 'asc' | 'desc'
  page?: number
}

export type Page<T> = { items: T[]; total: number; page: number; pages: number }

// validateSearch de las rutas con listado: la URL guarda búsqueda, orden y página.
export function parseListSearch(s: Record<string, unknown>): ListSearch {
  return {
    // String(): el router parsea ?q=1984 como número.
    q: s.q != null && s.q !== '' ? String(s.q) : undefined,
    sort: typeof s.sort === 'string' && s.sort in SORT_FIELDS ? (s.sort as ListSearch['sort']) : undefined,
    order: s.order === 'asc' || s.order === 'desc' ? s.order : undefined,
    page: Number(s.page) > 1 ? Math.floor(Number(s.page)) : undefined,
  }
}

type ApiErrorBody = { error?: string; details?: { field: string; message: string }[] }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const body: ApiErrorBody = await res.json().catch(() => ({}))
    const details = body.details?.map((d) => `${d.field}: ${d.message}`).join(' · ')
    throw new Error(details || body.error || `Error ${res.status}`)
  }
  return (res.status === 204 ? null : await res.json()) as T
}

const qs = (s: ListSearch) =>
  new URLSearchParams(Object.entries(s).flatMap(([k, v]) => (v === undefined ? [] : [[k, String(v)]])))

export const booksApi = {
  list: (s: ListSearch) => request<Page<Book>>(`/books?${qs(s)}`),
  mine: (s: ListSearch) => request<Page<Book>>(`/books/mine?${qs(s)}`),
  get: (id: string) => request<Book>(`/books/${id}`),
  create: (data: BookInput) => request<Book>('/books', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: BookInput) =>
    request<Book>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<null>(`/books/${id}`, { method: 'DELETE' }),
}

export const usersApi = {
  list: () => request<User[]>('/users'),
  setRole: (id: string, role: User['role']) =>
    request<User>(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
}
