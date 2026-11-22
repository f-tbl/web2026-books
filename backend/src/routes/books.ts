import { Router } from "express";
import { authMiddleware, requireRole } from "../middlewares/auth";
import { createBook, deleteBook, getBook, listBooks, updateBook } from "../controllers/books";

export const booksRouter = Router();
const admin = [authMiddleware, requireRole("admin")];

booksRouter.get("/", listBooks);
booksRouter.get("/:id", getBook);
booksRouter.post("/", ...admin, createBook);
booksRouter.put("/:id", ...admin, updateBook);
booksRouter.delete("/:id", ...admin, deleteBook);
