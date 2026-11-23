import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(200),
  author: z.string().trim().min(1, "El autor es obligatorio").max(100),
  pages: z.number().int().positive("Debe ser un entero mayor a 0"),
  publishedAt: z.coerce.date({ error: "Fecha inválida" }),
  available: z.boolean().default(true),
});

export type BookInput = z.infer<typeof bookSchema>;
