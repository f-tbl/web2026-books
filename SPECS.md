# SPECS — Trabajo Práctico Web 2026

> Entidad elegida: **libros** (`/api/books`). Si se cambia la entidad, reemplazar `books`/`Book` en todo el documento.

## 1. Repositorio

- Repo en GitHub con la estructura:
  ```
  /
  ├── backend/     # Express + TypeScript + MongoDB
  ├── frontend/
  ├── README.md
  └── SPECS.md
  ```
- `backend/.env.example` con **todas** las variables, sin valores reales.
- **Ningún secreto commiteado** (ni en el historial): `.env`, `BETTER_AUTH_SECRET`, secret de GitHub OAuth, URI de Mongo con contraseña.
  - `.env` en `.gitignore` desde el primer commit.
- Commits chicos con prefijos convencionales: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`. Nada de un único commit final.

### README.md (raíz) debe incluir

- [ ] Descripción de la app y de la entidad elegida.
- [ ] URL del frontend y del backend en Render.
- [ ] Cómo correrlo en local (comandos y variables de entorno).
- [ ] Tabla de endpoints (método, ruta, rol requerido).
- [ ] Dos usuarios de prueba (email + contraseña): uno `admin` y uno `user`.

## 2. Backend

**Stack:** Express + TypeScript + MongoDB + Zod + Better Auth.

### 2.1 Entidad `Book`

Mínimo 4 campos, al menos 3 tipos distintos.

| Campo         | Tipo      | Requerido | Validación (Zod)                 |
|---------------|-----------|-----------|----------------------------------|
| `title`       | string    | sí        | no vacío, máx. 200               |
| `author`      | string    | sí        | no vacío, máx. 100               |
| `pages`       | number    | sí        | entero, > 0                      |
| `publishedAt` | Date      | sí        | fecha válida (`z.coerce.date()`) |
| `available`   | boolean   | no        | default `true`                   |

Mongo agrega `_id`, `createdAt`, `updatedAt`.

### 2.2 API REST — `/api/books`

| Método | Ruta              | Rol requerido | Éxito | Errores               |
|--------|-------------------|---------------|-------|-----------------------|
| GET    | `/api/books`      | público       | 200   | —                     |
| GET    | `/api/books/:id`  | público       | 200   | 404                   |
| POST   | `/api/books`      | `admin`       | 201   | 400, 401, 403         |
| PUT    | `/api/books/:id`  | `admin`       | 200   | 400, 401, 403, 404    |
| DELETE | `/api/books/:id`  | `admin`       | 204   | 401, 403, 404         |

Rutas de autenticación: `/api/auth/*` (manejadas por Better Auth).

### 2.3 Validación

- Zod en **crear** (schema completo) y **editar** (`schema.partial()` si se usa PATCH; completo si PUT).
- Error de validación → `400` con cuerpo claro, por ejemplo:
  ```json
  { "error": "Validation error", "details": [{ "field": "pages", "message": "Expected number, received string" }] }
  ```
- `:id` inválido (no es ObjectId) → `404` (o `400`, pero consistente).

### 2.4 Códigos HTTP

| Situación                   | Código |
|-----------------------------|--------|
| Creado                      | 201    |
| Body inválido               | 400    |
| Sin sesión                  | 401    |
| Sesión sin rol suficiente   | 403    |
| Recurso inexistente         | 404    |

### 2.5 Autenticación (Better Auth)

- Proveedores: **email/contraseña** y **GitHub OAuth**.
- Usuarios y sesiones persistidos en **MongoDB** (adapter de Mongo de Better Auth).
- Campo `role` en el usuario:
  - `user` (**default** al registrarse): solo lectura.
  - `admin`: crear, editar, eliminar.
  - El rol no puede ser seteado por el cliente al registrarse (`input: false`).
- Middlewares:
  - `authMiddleware`: obtiene la sesión; sin sesión → `401`.
  - `requireRole("admin")`: rol distinto → `403`.
- Escrituras: `router.post/put/delete(..., authMiddleware, requireRole("admin"), handler)`.

### 2.6 Variables de entorno (`backend/.env.example`)

```env
PORT=3000
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## 3. Deploy

- Backend y frontend desplegados en **Render**.
- Variables de entorno configuradas en el panel de Render (no en el repo).
- CORS habilitado solo para `FRONTEND_URL`, con `credentials: true`.
- Callback de GitHub OAuth apuntando a la URL de Render del backend.

## 4. Checklist de entrega

- [ ] CRUD completo funcionando en `/api/books`.
- [ ] Zod en POST y PUT/PATCH con 400 claros.
- [ ] Códigos 201 / 400 / 401 / 403 / 404 correctos.
- [ ] Login con email/contraseña y con GitHub.
- [ ] Usuarios nuevos con rol `user`; escrituras solo para `admin`.
- [ ] README completo con URLs de Render y usuarios de prueba.
- [ ] `backend/.env.example` presente; sin secretos en el historial (`git log -p | grep -i secret`).
- [ ] Historial con commits chicos y descriptivos.
