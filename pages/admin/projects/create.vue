<template>
  <div class="px-6 max-w-3xl mx-auto">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/projects">
        <UButton variant="ghost" icon="i-heroicons-arrow-left" />
      </NuxtLink>
      <h1 class="text-2xl font-bold">Nouveau projet</h1>
    </div>

    <UCard>
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
          <template #hint>
            Utiliser l'URL embed (ex: https://www.youtube.com/embed/xxxxx)
          </template>
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
            Créer le projet
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

const router = useRouter()
const supabase = useSupabase()

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
    // Si ce projet est featured, retirer featured des autres
    if (form.value.featured) {
      await supabase.from('projects').update({ featured: false }).neq('id', 0)
    }

    // Créer le projet
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: form.value.title,
        category_id: Number(form.value.category_id),
        client: form.value.client || null,
        date: form.value.date || null,
        url: form.value.url || null,
        image: form.value.image || null,
        featured: form.value.featured,
      })
      .select()
      .single()

    if (projectError) throw projectError

    // Ajouter les rôles
    if (form.value.roles.length > 0 && project) {
      const roleInserts = form.value.roles.map(roleId => ({
        project_id: project.id,
        role_id: roleId,
      }))
      await supabase.from('project_role').insert(roleInserts)
    }

    await router.push('/admin/projects')
  } catch (e: any) {
    error.value = e.message || 'Erreur lors de la création'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const [categoriesRes, rolesRes] = await Promise.all([
    supabase.from('categories').select('id, title'),
    supabase.from('roles').select('id, name').order('name'),
  ])

  if (categoriesRes.data) categories.value = categoriesRes.data
  if (rolesRes.data) roles.value = rolesRes.data
})
</script>
