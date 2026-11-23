import { createAuthClient } from 'better-auth/react'

// Sin baseURL: el backend está en el mismo origen (/api/auth, vía proxy de Vite en local).
export const authClient = createAuthClient()
