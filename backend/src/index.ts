import express from "express";
import path from "node:path";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

// Better Auth va antes de express.json(): lee el body por su cuenta.
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use(express.json());

// En producción Express sirve el build de React (mismo origen, sin CORS).
// En local el frontend corre en Vite y redirige /api acá con su proxy.
const dist = path.resolve(import.meta.dir, "../../frontend/dist");
app.use(express.static(dist));
app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, "index.html")));

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
