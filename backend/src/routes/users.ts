import { Router } from "express";
import { authMiddleware, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { roleSchema } from "../schemas/user";
import { listUsers, setRole } from "../controllers/users";

export const usersRouter = Router();
usersRouter.use(authMiddleware, requireRole("admin"));

usersRouter.get("/", listUsers);
usersRouter.patch("/:id/role", validate(roleSchema), setRole);
