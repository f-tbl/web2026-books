import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) return res.status(401).json({ error: "No autenticado" });
  res.locals.user = session.user;
  next();
}

export function requireRole(role: string) {
  return (_req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user?.role !== role) return res.status(403).json({ error: "Sin permisos" });
    next();
  };
}
