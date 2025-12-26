<template>
  <div class="px-6 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Rôles</h1>
      <UButton @click="openCreateModal" icon="i-heroicons-plus">
        Nouveau rôle
      </UButton>
    </div>

    <UCard>
      <UTable :columns="columns" :rows="roles" :loading="loading">
        <template #name-data="{ row }">
          <span class="font-medium">{{ row.name }}</span>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton
              @click="openEditModal(row)"
              icon="i-heroicons-pencil"
              size="xs"
              variant="ghost"
            />
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

    <!-- Modal création/édition -->
    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ isEditing ? 'Modifier le rôle' : 'Nouveau rôle' }}
          </h3>
        </template>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <UFormGroup label="Nom du rôle" required>
            <UInput v-model="form.name" placeholder="Ex: Monteur, Réalisateur..." />
          </UFormGroup>

          <UAlert v-if="error" color="red" :title="error" />
        </form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showModal = false">
              Annuler
            </UButton>
            <UButton @click="handleSubmit" :loading="submitting">
              {{ isEditing ? 'Enregistrer' : 'Créer' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal de suppression -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Confirmer la suppression</h3>
        </template>
        <p>Êtes-vous sûr de vouloir supprimer le rôle "{{ roleToDelete?.name }}" ?</p>
        <p class="text-sm text-neutral-500 mt-2">
          Ce rôle sera retiré de tous les projets associés.
        </p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showDeleteModal = false">
              Annuler
            </UButton>
            <UButton color="red" @click="deleteRole" :loading="deleting">
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
const roles = ref<any[]>([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const form = ref({ id: 0, name: '' })
const roleToDelete = ref<any>(null)
const submitting = ref(false)
const deleting = ref(false)
const error = ref('')

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'actions', label: '' },
]

const loadRoles = async () => {
  loading.value = true
  const { data } = await supabase
    .from('roles')
    .select('*')
    .order('name')

  if (data) roles.value = data
  loading.value = false
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = { id: 0, name: '' }
  error.value = ''
  showModal.value = true
}

const openEditModal = (role: any) => {
  isEditing.value = true
  form.value = { ...role }
  error.value = ''
  showModal.value = true
}

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    error.value = 'Le nom est requis'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    if (isEditing.value) {
      const { error: updateError } = await supabase
        .from('roles')
        .update({
          name: form.value.name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', form.value.id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from('roles')
        .insert({ name: form.value.name })

      if (insertError) throw insertError
    }

    showModal.value = false
    await loadRoles()
  } catch (e: any) {
    error.value = e.message || 'Erreur'
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (role: any) => {
  roleToDelete.value = role
  showDeleteModal.value = true
}

const deleteRole = async () => {
  if (!roleToDelete.value) return

  deleting.value = true

  // Supprimer les associations
  await supabase.from('project_role').delete().eq('role_id', roleToDelete.value.id)
  // Supprimer le rôle
  await supabase.from('roles').delete().eq('id', roleToDelete.value.id)

  showDeleteModal.value = false
  roleToDelete.value = null
  deleting.value = false

  await loadRoles()
}

onMounted(loadRoles)
</script>
