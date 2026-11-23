import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(200),
  author: z.string().trim().min(1, "El autor es obligatorio").max(100),
  pages: z.number().int().positive("Debe ser un entero mayor a 0"),
  publishedAt: z.coerce.date({ error: "Fecha inválida" }),
  available: z.boolean().default(true),
});

export type BookInput = z.infer<typeof bookSchema>;

// Query de GET /api/books: valores inválidos caen al default en vez de dar 400.
export const SORT_FIELDS = ["title", "author", "pages", "publishedAt", "createdAt"] as const;
export const listQuerySchema = z.object({
  q: z.string().trim().max(100).catch(""),
  sort: z.enum(SORT_FIELDS).catch("createdAt"),
  order: z.enum(["asc", "desc"]).catch("desc"),
  page: z.coerce.number().int().min(1).catch(1),
  limit: z.coerce.number().int().min(1).max(50).catch(10),
});
