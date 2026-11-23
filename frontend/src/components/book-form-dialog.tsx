import { useState, type FormEvent, type ReactNode } from 'react'
import type { Book, BookInput } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  book?: Book
  trigger: ReactNode
  onSubmit: (data: BookInput) => Promise<unknown>
}

export function BookFormDialog({ book, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        title: String(form.get('title')),
        author: String(form.get('author')),
        pages: Number(form.get('pages')),
        publishedAt: String(form.get('publishedAt')),
        available: form.get('available') === 'on',
      })
      setOpen(false)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        setError(null)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{book ? 'Editar libro' : 'Nuevo libro'}</DialogTitle>
          <DialogDescription>Todos los campos son obligatorios.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" required maxLength={200} defaultValue={book?.title} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="author">Autor</Label>
            <Input id="author" name="author" required maxLength={100} defaultValue={book?.author} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pages">Páginas</Label>
              <Input id="pages" name="pages" type="number" min={1} step={1} required defaultValue={book?.pages} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="publishedAt">Publicado</Label>
              <Input
                id="publishedAt"
                name="publishedAt"
                type="date"
                required
                defaultValue={book?.publishedAt.slice(0, 10)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="available" name="available" defaultChecked={book?.available ?? true} />
            <Label htmlFor="available">Disponible</Label>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
