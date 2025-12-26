import { createBrowserClient } from '@supabase/ssr'

export const useSupabase = () => {
  const config = useRuntimeConfig()

  const client = createBrowserClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )

  return client
}
