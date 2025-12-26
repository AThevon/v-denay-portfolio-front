import { createClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createClient(event)
  const key = getRouterParam(event, 'key')

  const { data, error } = await supabase
    .from('files')
    .select('id, key, url, filename, updated_at')
    .eq('key', key)
    .single()

  if (error) {
    // Si le fichier n'existe pas, retourner null au lieu d'une erreur
    if (error.code === 'PGRST116') {
      return null
    }
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  return data
})
