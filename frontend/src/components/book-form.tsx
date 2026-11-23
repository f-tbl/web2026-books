import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Book, BookInput } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldError } from '@/components/field-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Mismas reglas que bookSchema del backend, para avisar antes de enviar.
const schema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio').max(200, 'Máximo 200 caracteres'),
  author: z.string().trim().min(1, 'El autor es obligatorio').max(100, 'Máximo 100 caracteres'),
  pages: z.number({ error: 'Ingresá un número' }).int('Debe ser un entero').positive('Debe ser mayor a 0'),
  publishedAt: z.iso.date({ error: 'Fecha inválida' }),
  available: z.boolean(),
}) satisfies z.ZodType<BookInput>

type Props = {
  book?: Book
  onSubmit: (data: BookInput) => Promise<unknown>
}

export function BookForm({ book, onSubmit }: Props) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BookInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: book?.title ?? '',
      author: book?.author ?? '',
      pages: book?.pages,
      publishedAt: book?.publishedAt.slice(0, 10) ?? '',
      available: book?.available ?? true,
    },
  })

  async function submit(data: BookInput) {
    try {
      await onSubmit(data)
    } catch (err) {
      setError('root', { message: (err as Error).message })
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" aria-invalid={!!errors.title} {...register('title')} />
        <FieldError error={errors.title} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="author">Autor</Label>
        <Input id="author" aria-invalid={!!errors.author} {...register('author')} />
        <FieldError error={errors.author} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="pages">Páginas</Label>
          <Input
            id="pages"
            type="number"
            min={1}
            step={1}
            aria-invalid={!!errors.pages}
            {...register('pages', { valueAsNumber: true })}
          />
          <FieldError error={errors.pages} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="publishedAt">Publicado</Label>
          <Input id="publishedAt" type="date" aria-invalid={!!errors.publishedAt} {...register('publishedAt')} />
          <FieldError error={errors.publishedAt} />
        </div>
      </div>
      <Controller
        control={control}
        name="available"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox id="available" checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
            <Label htmlFor="available">Disponible</Label>
          </div>
        )}
      />
      <FieldError error={errors.root} />
      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? 'Guardando…' : 'Guardar'}
      </Button>
    </form>
  )
}
