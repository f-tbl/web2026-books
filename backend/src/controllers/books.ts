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
  const filter = q ? { $or: [{ title: rx }, { author: rx }] } : {};
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
  const doc = { ...req.body, createdAt: now, updatedAt: now };
  const { insertedId } = await books.insertOne(doc);
  res.status(201).json({ _id: insertedId, ...doc });
}

export async function updateBook(req: IdReq, res: Response) {
  const _id = toId(req.params.id);
  const updated =
    _id &&
    (await books.findOneAndUpdate(
      { _id },
      { $set: { ...req.body, updatedAt: new Date() } },
      { returnDocument: "after" },
    ));
  if (!updated) return notFound(res);
  res.json(updated);
}

export async function deleteBook(req: IdReq, res: Response) {
  const _id = toId(req.params.id);
  const { deletedCount } = _id ? await books.deleteOne({ _id }) : { deletedCount: 0 };
  if (!deletedCount) return notFound(res);
  res.status(204).end();
}
