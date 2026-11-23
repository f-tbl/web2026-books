// Mensaje de error de un campo de react-hook-form (o el error general en errors.root).
export function FieldError({ error }: { error?: { message?: string } }) {
  if (!error?.message) return null
  return (
    <p role="alert" className="text-sm text-destructive">
      {error.message}
    </p>
  )
}
