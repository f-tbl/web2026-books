import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { bookSchema } from "../schemas/book";
import { createBook, deleteBook, getBook, listBooks, updateBook } from "../controllers/books";

export const booksRouter = Router();

booksRouter.get("/", listBooks);
booksRouter.get("/mine", authMiddleware, listBooks); // antes de /:id
booksRouter.get("/:id", getBook);
// Cualquier usuario logueado crea; editar/borrar lo controla findEditable (dueño o admin).
booksRouter.post("/", authMiddleware, validate(bookSchema), createBook);
booksRouter.put("/:id", authMiddleware, validate(bookSchema), updateBook);
booksRouter.delete("/:id", authMiddleware, deleteBook);
