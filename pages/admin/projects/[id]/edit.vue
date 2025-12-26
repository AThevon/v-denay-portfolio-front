<template>
  <div class="px-6 max-w-3xl mx-auto">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/projects">
        <UButton variant="ghost" icon="i-heroicons-arrow-left" />
      </NuxtLink>
      <h1 class="text-2xl font-bold">Modifier le projet</h1>
    </div>

    <USkeleton v-if="loading" class="h-96" />

    <UCard v-else>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <UFormGroup label="Titre" required>
          <UInput v-model="form.title" placeholder="Titre du projet" />
        </UFormGroup>

        <UFormGroup label="Catégorie" required>
          <USelect
            v-model="form.category_id"
            :options="categoryOptions"
            placeholder="Sélectionner une catégorie"
          />
        </UFormGroup>

        <UFormGroup label="Client">
          <UInput v-model="form.client" placeholder="Nom du client" />
        </UFormGroup>

        <UFormGroup label="Date">
          <UInput v-model="form.date" type="date" />
        </UFormGroup>

        <UFormGroup label="URL de la vidéo">
          <UInput v-model="form.url" placeholder="https://www.youtube.com/embed/..." />
        </UFormGroup>

        <UFormGroup label="Image">
          <ImageUpload v-model="form.image" folder="projects" />
        </UFormGroup>

        <UFormGroup label="Rôles">
          <div class="flex flex-wrap gap-2">
            <UCheckbox
              v-for="role in roles"
              :key="role.id"
              :model-value="form.roles.includes(role.id)"
              @update:model-value="toggleRole(role.id)"
              :label="role.name"
            />
          </div>
        </UFormGroup>

        <UFormGroup label="Projet en vedette">
          <UCheckbox v-model="form.featured" label="Afficher en page d'accueil" />
        </UFormGroup>

        <UAlert v-if="error" color="red" :title="error" />

        <div class="flex justify-end gap-2">
          <NuxtLink to="/admin/projects">
            <UButton variant="ghost">Annuler</UButton>
          </NuxtLink>
          <UButton type="submit" :loading="submitting">
            Enregistrer
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
  pageTransition: false,
})

const route = useRoute()
const router = useRouter()
const supabase = useSupabase()

const projectId = Number(route.params.id)

const loading = ref(true)
const categories = ref<any[]>([])
const roles = ref<any[]>([])
const submitting = ref(false)
const error = ref('')

const form = ref({
  title: '',
  category_id: '',
  client: '',
  date: '',
  url: '',
  image: '',
  featured: false,
  roles: [] as number[],
})

const categoryOptions = computed(() =>
  categories.value.map(c => ({ label: c.title, value: c.id }))
)

const toggleRole = (roleId: number) => {
  const index = form.value.roles.indexOf(roleId)
  if (index === -1) {
    form.value.roles.push(roleId)
  } else {
    form.value.roles.splice(index, 1)
  }
}

const handleSubmit = async () => {
  if (!form.value.title || !form.value.category_id) {
    error.value = 'Le titre et la catégorie sont requis'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    // Si ce projet devient featured, retirer featured des autres
    if (form.value.featured) {
      await supabase.from('projects').update({ featured: false }).neq('id', projectId)
    }

    // Mettre à jour le projet
    const { error: projectError } = await supabase
      .from('projects')
      .update({
        title: form.value.title,
        category_id: Number(form.value.category_id),
        client: form.value.client || null,
        date: form.value.date || null,
        url: form.value.url || null,
        image: form.value.image || null,
        featured: form.value.featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)

    if (projectError) throw projectError

    // Supprimer les anciens rôles et ajouter les nouveaux
    await supabase.from('project_role').delete().eq('project_id', projectId)

    if (form.value.roles.length > 0) {
      const roleInserts = form.value.roles.map(roleId => ({
        project_id: projectId,
        role_id: roleId,
      }))
      await supabase.from('project_role').insert(roleInserts)
    }

    await router.push('/admin/projects')
  } catch (e: any) {
    error.value = e.message || 'Erreur lors de la mise à jour'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const [projectRes, categoriesRes, rolesRes, projectRolesRes] = await Promise.all([
    supabase.from('projects').select('*').eq('id', projectId).single(),
    supabase.from('categories').select('id, title'),
    supabase.from('roles').select('id, name').order('name'),
    supabase.from('project_role').select('role_id').eq('project_id', projectId),
  ])

  if (projectRes.data) {
    const p = projectRes.data
    form.value = {
      title: p.title || '',
      category_id: p.category_id?.toString() || '',
      client: p.client || '',
      date: p.date || '',
      url: p.url || '',
      image: p.image || '',
      featured: p.featured || false,
      roles: projectRolesRes.data?.map(r => r.role_id) || [],
    }
  }

  if (categoriesRes.data) categories.value = categoriesRes.data
  if (rolesRes.data) roles.value = rolesRes.data

  loading.value = false
})
</script>
