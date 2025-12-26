import { createClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createClient(event)

  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, title, image')
    .order('id', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  return categories
})
