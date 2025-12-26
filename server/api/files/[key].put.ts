import { createClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createClient(event)
  const key = getRouterParam(event, 'key')
  const body = await readBody(event)

  // Vérifier si le fichier existe
  const { data: existing } = await supabase
    .from('files')
    .select('id')
    .eq('key', key)
    .single()

  if (existing) {
    // Mettre à jour
    const { data, error } = await supabase
      .from('files')
      .update({
        url: body.url,
        filename: body.filename,
        updated_at: new Date().toISOString(),
      })
      .eq('key', key)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: error.message,
      })
    }

    return data
  } else {
    // Créer
    const { data, error } = await supabase
      .from('files')
      .insert({
        key,
        url: body.url,
        filename: body.filename,
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        message: error.message,
      })
    }

    return data
  }
})
