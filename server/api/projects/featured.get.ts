import { createClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createClient(event)

  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      image,
      url,
      date,
      client,
      featured,
      category:categories(id, title, image),
      roles:project_role(role:roles(id, name))
    `)
    .eq('featured', true)
    .single()

  if (error) {
    // Si aucun projet featured, retourner null plutôt qu'une erreur
    if (error.code === 'PGRST116') {
      return null
    }
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  // Transformer pour correspondre au format Laravel
  return {
    ...project,
    roles_list: project.roles?.map((r: any) => r.role?.name).filter(Boolean) || [],
    roles: undefined,
  }
})
