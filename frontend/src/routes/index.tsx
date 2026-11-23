import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="flex flex-col items-center gap-4 p-10">
      <h1 className="text-2xl font-semibold">Biblioteca</h1>
      <Button>Funciona shadcn</Button>
    </main>
  )
}
