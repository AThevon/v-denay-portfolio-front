import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import type { H3Event } from 'h3'

export function createClient(event: H3Event) {
  const config = useRuntimeConfig()

  return createServerClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey,
    {
      cookies: {
        getAll() {
          const cookieHeader = getHeader(event, 'cookie') ?? ''
          return parseCookieHeader(cookieHeader)
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            appendHeader(event, 'set-cookie', serializeCookieHeader(name, value, options))
          })
        },
      },
    }
  )
}

// Client avec anon key pour les opérations publiques (respecte RLS)
export function createAnonClient(event: H3Event) {
  const config = useRuntimeConfig()

  return createServerClient(
    config.supabaseUrl,
    config.public.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          const cookieHeader = getHeader(event, 'cookie') ?? ''
          return parseCookieHeader(cookieHeader)
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            appendHeader(event, 'set-cookie', serializeCookieHeader(name, value, options))
          })
        },
      },
    }
  )
}
