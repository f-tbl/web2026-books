import { Router } from "express";
import { authMiddleware, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { bookSchema } from "../schemas/book";
import { createBook, deleteBook, getBook, listBooks, updateBook } from "../controllers/books";

export const booksRouter = Router();
const admin = [authMiddleware, requireRole("admin")];

booksRouter.get("/", listBooks);
booksRouter.get("/:id", getBook);
booksRouter.post("/", ...admin, validate(bookSchema), createBook);
booksRouter.put("/:id", ...admin, validate(bookSchema), updateBook);
booksRouter.delete("/:id", ...admin, deleteBook);
