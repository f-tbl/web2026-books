import type { Request, Response } from "express";
import { toId } from "../lib/db";
import { books } from "../models/book";
import { listQuerySchema } from "../schemas/book";

type IdReq = Request<{ id: string }>;

const notFound = (res: Response) => res.status(404).json({ error: "Libro no encontrado" });

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function listBooks(req: Request, res: Response) {
  const { q, sort, order, page, limit } = listQuerySchema.parse(req.query);
  const rx = { $regex: escapeRegex(q), $options: "i" };
  const filter = {
    // En /mine authMiddleware dejó al usuario en res.locals; en el listado público no hay.
    ...(res.locals.user && { ownerId: res.locals.user.id as string }),
    ...(q && { $or: [{ title: rx }, { author: rx }] }),
  };
  const [items, total] = await Promise.all([
    books
      .find(filter)
      // _id como desempate para que las páginas no repitan ni salteen libros.
      .sort({ [sort]: order === "asc" ? 1 : -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    books.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
}

export async function getBook(req: IdReq, res: Response) {
  const _id = toId(req.params.id);
  const book = _id && (await books.findOne({ _id }));
  if (!book) return notFound(res);
  res.json(book);
}

export async function createBook(req: Request, res: Response) {
  const now = new Date();
  const doc = { ...req.body, ownerId: res.locals.user.id, createdAt: now, updatedAt: now };
  const { insertedId } = await books.insertOne(doc);
  res.status(201).json({ _id: insertedId, ...doc });
}

// Solo el dueño o un admin pueden modificar un libro. Responde 404/403 y devuelve null si no.
async function findEditable(req: IdReq, res: Response) {
  const _id = toId(req.params.id);
  const book = _id && (await books.findOne({ _id }));
  if (!book) {
    notFound(res);
    return null;
  }
  const user = res.locals.user;
  if (user.role !== "admin" && book.ownerId !== user.id) {
    res.status(403).json({ error: "Sin permisos" });
    return null;
  }
  return book;
}

export async function updateBook(req: IdReq, res: Response) {
  const book = await findEditable(req, res);
  if (!book) return;
  const updated = await books.findOneAndUpdate(
    { _id: book._id },
    { $set: { ...req.body, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  if (!updated) return notFound(res);
  res.json(updated);
}

export async function deleteBook(req: IdReq, res: Response) {
  const book = await findEditable(req, res);
  if (!book) return;
  await books.deleteOne({ _id: book._id });
  res.status(204).end();
}
