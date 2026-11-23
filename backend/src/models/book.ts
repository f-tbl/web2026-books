import type { ObjectId } from "mongodb";
import { db } from "../lib/db";

export interface Book {
  _id?: ObjectId;
  title: string;
  author: string;
  pages: number;
  publishedAt: Date;
  available: boolean;
  ownerId?: string; // id del usuario de Better Auth que lo cargó (los libros viejos no tienen)
  createdAt: Date;
  updatedAt: Date;
}

export const books = db.collection<Book>("books");
