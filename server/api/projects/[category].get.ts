import { createClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createClient(event)
  const categorySlug = getRouterParam(event, 'category')
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const perPage = 5

  // Récupérer la catégorie par son titre (slug)
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, title, image')
    .eq('title', categorySlug)
    .single()

  if (categoryError || !category) {
    throw createError({
      statusCode: 404,
      message: 'Category not found',
    })
  }

  // Calculer l'offset pour la pagination
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Récupérer les projets de cette catégorie avec pagination
  const { data: projects, error: projectsError, count } = await supabase
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
    `, { count: 'exact' })
    .eq('category_id', category.id)
    .order('date', { ascending: false })
    .range(from, to)

  if (projectsError) {
    throw createError({
      statusCode: 500,
      message: projectsError.message,
    })
  }

  // Transformer les données pour correspondre au format Laravel
  const transformedProjects = projects?.map(project => ({
    ...project,
    roles_list: project.roles?.map((r: any) => r.role?.name).filter(Boolean) || [],
    roles: undefined, // Retirer la structure imbriquée
  }))

  // Calculer les informations de pagination
  const totalPages = Math.ceil((count || 0) / perPage)
  const hasNextPage = page < totalPages

  return {
    data: transformedProjects,
    current_page: page,
    per_page: perPage,
    total: count,
    last_page: totalPages,
    next_page_url: hasNextPage ? `/api/projects/${categorySlug}?page=${page + 1}` : null,
  }
})
