export type Book = {
  _id: string
  title: string
  author: string
  pages: number
  publishedAt: string
  available: boolean
}

export type BookInput = Omit<Book, '_id'>

type ApiErrorBody = { error?: string; details?: { field: string; message: string }[] }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/books${path}`, {
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

export const booksApi = {
  list: () => request<Book[]>(''),
  get: (id: string) => request<Book>(`/${id}`),
  create: (data: BookInput) => request<Book>('', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: BookInput) =>
    request<Book>(`/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<null>(`/${id}`, { method: 'DELETE' }),
}
