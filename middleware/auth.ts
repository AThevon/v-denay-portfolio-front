export default defineNuxtRouteMiddleware(async (to) => {
  // Ne pas appliquer sur les routes non-admin
  if (!to.path.startsWith('/admin')) {
    return
  }

  // Côté serveur, on ne peut pas vérifier l'auth client
  if (import.meta.server) {
    return
  }

  const supabase = useSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return navigateTo('/login')
  }
})
