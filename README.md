# Web 2026 — Biblioteca de libros

Aplicación web full stack para gestionar un catálogo de **libros**. Cualquiera puede ver el listado (paginado, con búsqueda y orden) y el detalle de cada libro; los usuarios con rol `admin` pueden crear, editar y eliminar libros, y cambiar el rol de otros usuarios. Cada admin solo puede editar y eliminar los libros que cargó.

## Entidad elegida: `Book`

| Campo         | Tipo    | Requerido | Validación (Zod)                 |
|---------------|---------|-----------|----------------------------------|
| `title`       | string  | sí        | no vacío, máx. 200               |
| `author`      | string  | sí        | no vacío, máx. 100               |
| `pages`       | number  | sí        | entero, > 0                      |
| `publishedAt` | Date    | sí        | fecha válida                     |
| `available`   | boolean | no        | default `true`                   |

MongoDB agrega `_id`, `createdAt` y `updatedAt`. El backend guarda además `ownerId` (el admin que cargó el libro).

## Stack

- **Backend:** Bun + Express + TypeScript + MongoDB + Zod + Better Auth (email/contraseña y GitHub OAuth).
- **Frontend:** React + Vite + TanStack Router + Tailwind/shadcn + react-hook-form + Zod.

## Deploy en Render

- **Frontend:** https://web2026-books.onrender.com
- **Backend:** https://web2026-books-backend.onrender.com

> El plan gratuito de Render apaga los servicios inactivos: la primera petición puede tardar unos segundos.

## Cómo correrlo en local

Requisitos: [Bun](https://bun.sh) y una instancia de MongoDB.

### 1. Backend

```sh
cd backend
bun install
cp .env.example .env   # completar las variables (ver abajo)
bun run dev            # http://localhost:3000
```

Variables de entorno (`backend/.env`):

| Variable               | Descripción                                                               |
|------------------------|---------------------------------------------------------------------------|
| `PORT`                 | Puerto del backend (default `3000`).                                      |
| `MONGODB_URI`          | URI de conexión a MongoDB (ej. `mongodb://localhost:27017`).              |
| `BETTER_AUTH_SECRET`   | Secreto de Better Auth (generar con `openssl rand -base64 32`).           |
| `BETTER_AUTH_URL`      | URL pública desde donde se usa la app. En local: `http://localhost:5173`. |
| `GITHUB_CLIENT_ID`     | Client ID de la GitHub OAuth App.                                         |
| `GITHUB_CLIENT_SECRET` | Client secret de la GitHub OAuth App.                                     |

El callback de la GitHub OAuth App debe ser `<BETTER_AUTH_URL>/api/auth/callback/github`.

### 2. Frontend

```sh
cd frontend
bun install
bun run dev            # http://localhost:5173
```

En local, Vite redirige `/api` al backend (`http://localhost:3000`) con su proxy, así que no hace falta configurar CORS ni variables extra.

### Build de producción

```sh
cd frontend && bun run build   # genera frontend/dist
cd ../backend && bun run start # Express sirve también frontend/dist
```

## Endpoints de la API

| Método | Ruta                  | Rol requerido             | Descripción                                                                  |
|--------|-----------------------|---------------------------|------------------------------------------------------------------------------|
| GET    | `/api/books`          | público                   | Lista paginada. Query: `q`, `sort`, `order` (`asc`/`desc`), `page`, `limit`. |
| GET    | `/api/books/:id`      | público                   | Detalle de un libro.                                                         |
| POST   | `/api/books`          | `admin`                   | Crea un libro.                                                               |
| PUT    | `/api/books/:id`      | `admin` (dueño del libro) | Edita un libro.                                                              |
| DELETE | `/api/books/:id`      | `admin` (dueño del libro) | Elimina un libro.                                                            |
| GET    | `/api/users`          | `admin`                   | Lista los usuarios.                                                          |
| PATCH  | `/api/users/:id/role` | `admin`                   | Cambia el rol de un usuario (`user` / `admin`).                              |
| *      | `/api/auth/*`         | público                   | Registro, login, logout y sesión (Better Auth).                              |

Códigos de respuesta: `201` creado, `400` body inválido, `401` sin sesión, `403` rol insuficiente o libro de otro admin, `404` recurso inexistente.
