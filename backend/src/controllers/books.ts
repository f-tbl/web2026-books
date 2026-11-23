import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { books } from "../models/book";

type IdReq = Request<{ id: string }>;

// Un id con formato inválido se trata igual que uno inexistente: 404.
const toId = (id: string) => (ObjectId.isValid(id) ? new ObjectId(id) : null);
const notFound = (res: Response) => res.status(404).json({ error: "Libro no encontrado" });

export async function listBooks(_req: Request, res: Response) {
  res.json(await books.find().sort({ createdAt: -1 }).toArray());
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
  const book =
    _id &&
    (await books.findOneAndUpdate(
      { _id },
      { $set: { ...req.body, updatedAt: new Date() } },
      { returnDocument: "after" },
    ));
  if (!book) return notFound(res);
  res.json(book);
}

export async function deleteBook(req: IdReq, res: Response) {
  const _id = toId(req.params.id);
  const result = _id && (await books.deleteOne({ _id }));
  if (!result || result.deletedCount === 0) return notFound(res);
  res.status(204).end();
}
