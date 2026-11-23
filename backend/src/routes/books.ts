import { Router } from "express";
import { authMiddleware, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { bookSchema } from "../schemas/book";
import { createBook, deleteBook, getBook, listBooks, updateBook } from "../controllers/books";

export const booksRouter = Router();

booksRouter.get("/", listBooks);
booksRouter.get("/:id", getBook);
// Los `user` solo leen: toda escritura exige rol admin.
const adminOnly = [authMiddleware, requireRole("admin")];
booksRouter.post("/", ...adminOnly, validate(bookSchema), createBook);
booksRouter.put("/:id", ...adminOnly, validate(bookSchema), updateBook);
booksRouter.delete("/:id", ...adminOnly, deleteBook);
