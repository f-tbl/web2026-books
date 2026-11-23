import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'

// Sin baseURL: el backend está en el mismo origen (/api/auth, vía proxy de Vite en local).
export const authClient = createAuthClient({
  // Tipa el campo `role` que agrega el backend al usuario.
  plugins: [inferAdditionalFields({ user: { role: { type: 'string', input: false } } })],
})
