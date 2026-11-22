import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173", credentials: true }));
// Better Auth va antes de express.json(): lee el body por su cuenta.
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
