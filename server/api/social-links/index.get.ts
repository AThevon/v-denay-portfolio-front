import { createClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createClient(event)

  const { data: socialLinks, error } = await supabase
    .from('social_links')
    .select('id, platform, url, description, color, icon_url, display_order')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  return socialLinks
})
