import type { ObjectId } from "mongodb";
import { db } from "../lib/db";

export interface Book {
  _id?: ObjectId;
  title: string;
  author: string;
  pages: number;
  publishedAt: Date;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const books = db.collection<Book>("books");
