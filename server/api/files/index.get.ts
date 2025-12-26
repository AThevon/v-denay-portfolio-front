import { createClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createClient(event)

  const { data, error } = await supabase
    .from('files')
    .select('id, key, url, filename, updated_at')
    .order('key')

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  return data
})
