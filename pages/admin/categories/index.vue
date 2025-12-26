<template>
  <div class="px-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Catégories</h1>

    <UCard>
      <UTable :columns="columns" :rows="categories" :loading="loading">
        <template #image-data="{ row }">
          <img
            :src="row.image"
            :alt="row.title"
            class="w-24 h-16 object-cover rounded"
          />
        </template>

        <template #title-data="{ row }">
          <span class="font-medium capitalize">{{ row.title }}</span>
        </template>

        <template #actions-data="{ row }">
          <UButton
            @click="openEditModal(row)"
            icon="i-heroicons-pencil"
            size="xs"
            variant="ghost"
          />
        </template>
      </UTable>
    </UCard>

    <!-- Modal d'édition -->
    <UModal v-model="showEditModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Modifier la catégorie</h3>
        </template>

        <form @submit.prevent="handleUpdate" class="space-y-4">
          <UFormGroup label="Titre">
            <UInput v-model="editForm.title" disabled />
            <template #hint>Le titre ne peut pas être modifié</template>
          </UFormGroup>

          <UFormGroup label="Image">
            <ImageUpload v-model="editForm.image" folder="categories" />
          </UFormGroup>

          <UAlert v-if="error" color="red" :title="error" />
        </form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showEditModal = false">
              Annuler
            </UButton>
            <UButton @click="handleUpdate" :loading="submitting">
              Enregistrer
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
const categories = ref<any[]>([])
const showEditModal = ref(false)
const editForm = ref({ id: 0, title: '', image: '' })
const submitting = ref(false)
const error = ref('')

const columns = [
  { key: 'image', label: 'Image' },
  { key: 'title', label: 'Titre' },
  { key: 'actions', label: '' },
]

const loadCategories = async () => {
  loading.value = true
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('id')

  if (data) categories.value = data
  loading.value = false
}

const openEditModal = (category: any) => {
  editForm.value = { ...category }
  showEditModal.value = true
  error.value = ''
}

const handleUpdate = async () => {
  submitting.value = true
  error.value = ''

  try {
    const { error: updateError } = await supabase
      .from('categories')
      .update({
        image: editForm.value.image,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editForm.value.id)

    if (updateError) throw updateError

    showEditModal.value = false
    await loadCategories()
  } catch (e: any) {
    error.value = e.message || 'Erreur lors de la mise à jour'
  } finally {
    submitting.value = false
  }
}

onMounted(loadCategories)
</script>
