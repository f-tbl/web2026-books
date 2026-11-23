import type { Request, Response } from "express";
import { db, toId } from "../lib/db";

// Colección que crea Better Auth (adapter de Mongo, nombre por defecto).
const users = db.collection("user");
const projection = { name: 1, email: 1, role: 1 };

// shortcut: sin paginar, alcanza para la cantidad de usuarios del TP; paginar como /api/books si crece.
export async function listUsers(_req: Request, res: Response) {
  res.json(await users.find({}, { projection }).sort({ createdAt: 1 }).toArray());
}

export async function setRole(req: Request<{ id: string }>, res: Response) {
  // Evita que el último admin se saque el rol a sí mismo y nadie pueda volver a dárselo.
  if (req.params.id === res.locals.user.id) return res.status(400).json({ error: "No podés cambiar tu propio rol" });
  const _id = toId(req.params.id);
  const user =
    _id &&
    (await users.findOneAndUpdate(
      { _id },
      { $set: { role: req.body.role, updatedAt: new Date() } },
      { returnDocument: "after", projection },
    ));
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
}
