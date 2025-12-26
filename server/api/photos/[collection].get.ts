import { createClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createClient(event)
  const collectionSlug = getRouterParam(event, 'collection')

  // Récupérer la collection par son slug
  const { data: collection, error: collectionError } = await supabase
    .from('photo_collections')
    .select('id, name, slug')
    .eq('slug', collectionSlug)
    .single()

  if (collectionError || !collection) {
    throw createError({
      statusCode: 404,
      message: 'Collection not found',
    })
  }

  // Récupérer les photos de cette collection
  const { data: photos, error: photosError } = await supabase
    .from('photos')
    .select('id, url, alt, display_order')
    .eq('collection_id', collection.id)
    .order('display_order', { ascending: true })

  if (photosError) {
    throw createError({
      statusCode: 500,
      message: photosError.message,
    })
  }

  return {
    collection,
    photos: photos || [],
  }
})
