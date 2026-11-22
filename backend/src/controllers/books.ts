import type { Request, Response } from "express";

// shortcut: stubs que devuelven 501, se completan en el próximo paso.
const notImplemented = (_req: Request, res: Response) => res.status(501).json({ error: "No implementado" });

export const listBooks = notImplemented;
export const getBook = notImplemented;
export const createBook = notImplemented;
export const updateBook = notImplemented;
export const deleteBook = notImplemented;
