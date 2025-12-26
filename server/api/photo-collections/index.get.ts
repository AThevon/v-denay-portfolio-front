import { createClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createClient(event)

  const { data, error } = await supabase
    .from('photo_collections')
    .select(`
      id,
      name,
      slug,
      description,
      display_order,
      photos:photos(id, url, alt, display_order)
    `)
    .order('display_order', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  // Trier les photos par display_order dans chaque collection
  const collections = data?.map(collection => ({
    ...collection,
    photos: collection.photos?.sort((a: any, b: any) => a.display_order - b.display_order) || [],
  }))

  return collections
})
