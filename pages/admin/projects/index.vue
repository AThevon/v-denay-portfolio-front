<template>
  <div class="px-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Projets</h1>
      <NuxtLink to="/admin/projects/create">
        <UButton icon="i-heroicons-plus">
          Nouveau projet
        </UButton>
      </NuxtLink>
    </div>

    <!-- Filtres -->
    <div class="flex gap-4 mb-6">
      <USelect
        v-model="selectedCategory"
        :options="categoryOptions"
        placeholder="Toutes les catégories"
        class="w-48"
      />
      <UInput
        v-model="search"
        placeholder="Rechercher..."
        icon="i-heroicons-magnifying-glass"
        class="flex-1 max-w-xs"
      />
    </div>

    <!-- Liste des projets -->
    <UCard>
      <UTable
        :columns="columns"
        :rows="filteredProjects"
        :loading="loading"
      >
        <template #image-data="{ row }">
          <img
            :src="row.image"
            :alt="row.title"
            class="w-16 h-10 object-cover rounded"
          />
        </template>

        <template #title-data="{ row }">
          <span class="block truncate max-w-[200px]" :title="row.title">
            {{ row.title }}
          </span>
        </template>

        <template #client-data="{ row }">
          <span class="block truncate max-w-[120px]" :title="row.client">
            {{ row.client || '-' }}
          </span>
        </template>

        <template #category-data="{ row }">
          <UBadge :color="getCategoryColor(row.category?.title)">
            {{ row.category?.title }}
          </UBadge>
        </template>

        <template #featured-data="{ row }">
          <UBadge v-if="row.featured" color="yellow">
            En vedette
          </UBadge>
          <span v-else class="text-neutral-400">-</span>
        </template>

        <template #date-data="{ row }">
          {{ formatDate(row.date) }}
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton
              v-if="!row.featured"
              @click="setFeatured(row.id)"
              icon="i-heroicons-star"
              size="xs"
              variant="ghost"
              title="Mettre en vedette"
            />
            <NuxtLink :to="`/admin/projects/${row.id}/edit`">
              <UButton
                icon="i-heroicons-pencil"
                size="xs"
                variant="ghost"
              />
            </NuxtLink>
            <UButton
              @click="confirmDelete(row)"
              icon="i-heroicons-trash"
              size="xs"
              color="red"
              variant="ghost"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Modal de confirmation suppression -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Confirmer la suppression</h3>
        </template>
        <p>Êtes-vous sûr de vouloir supprimer le projet "{{ projectToDelete?.title }}" ?</p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showDeleteModal = false">
              Annuler
            </UButton>
            <UButton color="red" @click="deleteProject" :loading="deleting">
              Supprimer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
  pageTransition: false,
})

const supabase = useSupabase()

const loading = ref(true)
const projects = ref<any[]>([])
const categories = ref<any[]>([])
const selectedCategory = ref('')
const search = ref('')
const showDeleteModal = ref(false)
const projectToDelete = ref<any>(null)
const deleting = ref(false)

const columns = [
  { key: 'image', label: 'Image' },
  { key: 'title', label: 'Titre', class: 'max-w-[200px]' },
  { key: 'category', label: 'Catégorie' },
  { key: 'client', label: 'Client', class: 'max-w-[120px]' },
  { key: 'date', label: 'Date' },
  { key: 'featured', label: 'Vedette' },
  { key: 'actions', label: '' },
]

const categoryOptions = computed(() => [
  { label: 'Toutes', value: '' },
  ...categories.value.map(c => ({ label: c.title, value: c.title })),
])

const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    const matchCategory = !selectedCategory.value || p.category?.title === selectedCategory.value
    const matchSearch = !search.value || p.title.toLowerCase().includes(search.value.toLowerCase())
    return matchCategory && matchSearch
  })
})

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    musique: 'blue',
    corporate: 'green',
    fiction: 'purple',
  }
  return colors[category] || 'gray'
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
  })
}

const loadData = async () => {
  loading.value = true

  const [projectsRes, categoriesRes] = await Promise.all([
    supabase
      .from('projects')
      .select(`
        id, title, image, url, date, client, featured,
        category:categories(id, title),
        roles:project_role(role:roles(name))
      `)
      .order('date', { ascending: false }),
    supabase.from('categories').select('id, title'),
  ])

  if (projectsRes.data) {
    projects.value = projectsRes.data.map(p => ({
      ...p,
      roles_list: p.roles?.map((r: any) => r.role?.name).filter(Boolean) || [],
    }))
  }

  if (categoriesRes.data) {
    categories.value = categoriesRes.data
  }

  loading.value = false
}

const setFeatured = async (projectId: number) => {
  // Retirer featured de tous les projets
  await supabase.from('projects').update({ featured: false }).neq('id', 0)
  // Mettre featured sur le projet sélectionné
  await supabase.from('projects').update({ featured: true }).eq('id', projectId)
  await loadData()
}

const confirmDelete = (project: any) => {
  projectToDelete.value = project
  showDeleteModal.value = true
}

const deleteProject = async () => {
  if (!projectToDelete.value) return

  deleting.value = true

  // Supprimer les associations project_role
  await supabase.from('project_role').delete().eq('project_id', projectToDelete.value.id)
  // Supprimer le projet
  await supabase.from('projects').delete().eq('id', projectToDelete.value.id)

  showDeleteModal.value = false
  projectToDelete.value = null
  deleting.value = false

  await loadData()
}

onMounted(loadData)
</script>
