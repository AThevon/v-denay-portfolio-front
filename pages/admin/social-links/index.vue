<template>
  <div class="px-6 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Liens sociaux</h1>
      <UButton @click="openCreateModal" icon="i-heroicons-plus">
        Nouveau lien
      </UButton>
    </div>

    <UCard>
      <UTable :columns="columns" :rows="socialLinks" :loading="loading">
        <template #platform-data="{ row }">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              :style="{ backgroundColor: row.color || '#3b82f6' }"
            >
              <img
                v-if="row.icon_url"
                :src="row.icon_url"
                :alt="row.platform"
                class="w-5 h-5 object-contain filter brightness-0 invert"
              />
              <UIcon
                v-else
                :name="getPlatformIcon(row.platform)"
                class="w-5 h-5 text-white"
              />
            </div>
            <span class="font-medium capitalize">{{ row.platform }}</span>
          </div>
        </template>

        <template #url-data="{ row }">
          <a
            :href="row.url"
            target="_blank"
            class="text-blue-500 hover:underline text-sm truncate block max-w-xs"
          >
            {{ row.url }}
          </a>
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
            {{ isEditing ? 'Modifier le lien' : 'Nouveau lien social' }}
          </h3>
        </template>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <UFormGroup label="Plateforme" required>
            <USelect
              v-model="selectedPlatform"
              :options="platformOptions"
              placeholder="Sélectionner une plateforme"
              @update:model-value="onPlatformChange"
            />
          </UFormGroup>

          <UFormGroup v-if="selectedPlatform === 'other'" label="Nom de la plateforme" required>
            <UInput
              v-model="form.platform"
              placeholder="Ex: Snapchat, Pinterest..."
            />
          </UFormGroup>

          <UFormGroup label="URL" required>
            <UInput v-model="form.url" placeholder="https://..." />
          </UFormGroup>

          <UFormGroup label="Description" required>
            <UInput v-model="form.description" placeholder="Suivez-moi sur..." />
          </UFormGroup>

          <UFormGroup label="Couleur">
            <div class="flex items-center gap-3">
              <input
                type="color"
                v-model="form.color"
                class="w-12 h-10 rounded cursor-pointer border-0"
              />
              <UInput v-model="form.color" placeholder="#3b82f6" class="flex-1" />
            </div>
            <template #hint>
              Couleur affichée au survol du lien
            </template>
          </UFormGroup>

          <UFormGroup label="Icône personnalisée">
            <div class="space-y-3">
              <div v-if="form.icon_url" class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: form.color }"
                >
                  <img
                    :src="form.icon_url"
                    alt="Icône"
                    class="w-7 h-7 object-contain filter brightness-0 invert"
                  />
                </div>
                <UButton
                  size="xs"
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  @click="form.icon_url = ''"
                >
                  Supprimer
                </UButton>
              </div>
              <div
                @click="triggerIconInput"
                class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors border-neutral-300 dark:border-neutral-600 hover:border-primary"
              >
                <input
                  ref="iconInput"
                  type="file"
                  accept="image/svg+xml,image/png"
                  class="hidden"
                  @change="handleIconUpload"
                />
                <UIcon name="i-heroicons-arrow-up-tray" class="w-6 h-6 mx-auto text-neutral-400 mb-1" />
                <p class="text-sm text-neutral-500">SVG ou PNG (fond transparent recommandé)</p>
              </div>
            </div>
            <template #hint>
              Laissez vide pour utiliser l'icône par défaut de la plateforme
            </template>
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
        <p>Êtes-vous sûr de vouloir supprimer le lien {{ linkToDelete?.platform }} ?</p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showDeleteModal = false">
              Annuler
            </UButton>
            <UButton color="red" @click="deleteLink" :loading="deleting">
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
const toast = useToast()

const loading = ref(true)
const socialLinks = ref<any[]>([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const form = ref({ id: 0, platform: '', url: '', description: '', color: '#3b82f6', icon_url: '' })
const selectedPlatform = ref('')
const linkToDelete = ref<any>(null)
const submitting = ref(false)
const deleting = ref(false)
const error = ref('')
const iconInput = ref<HTMLInputElement | null>(null)
const uploadingIcon = ref(false)

const columns = [
  { key: 'platform', label: 'Plateforme' },
  { key: 'description', label: 'Description' },
  { key: 'url', label: 'URL' },
  { key: 'actions', label: '' },
]

const platformOptions = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Twitter/X', value: 'twitter' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Vimeo', value: 'vimeo' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Behance', value: 'behance' },
  { label: 'Dribbble', value: 'dribbble' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Autre', value: 'other' },
]

const platformColors: Record<string, string> = {
  instagram: '#dc2743', // Couleur centrale du gradient Instagram
  linkedin: '#0072b1', // Couleur du gradient LinkedIn
  twitter: '#1DA1F2',
  youtube: '#FF0000',
  vimeo: '#1AB7EA',
  tiktok: '#000000',
  behance: '#1769FF',
  dribbble: '#EA4C89',
  facebook: '#1877F2',
  other: '#3b82f6',
}

const getPlatformIcon = (platform: string) => {
  const icons: Record<string, string> = {
    instagram: 'i-heroicons-camera',
    linkedin: 'i-heroicons-briefcase',
    twitter: 'i-heroicons-chat-bubble-left',
    youtube: 'i-heroicons-play',
    vimeo: 'i-heroicons-video-camera',
    tiktok: 'i-heroicons-musical-note',
    behance: 'i-heroicons-square-3-stack-3d',
    dribbble: 'i-heroicons-sparkles',
    facebook: 'i-heroicons-user-group',
    other: 'i-heroicons-link',
  }
  return icons[platform] || 'i-heroicons-link'
}

const onPlatformChange = (platform: string) => {
  // Si c'est une plateforme prédéfinie (pas "other"), on met le nom directement
  if (platform !== 'other') {
    form.value.platform = platform
  } else {
    // Si "Autre" est sélectionné, on vide le champ pour que l'utilisateur entre un nom
    form.value.platform = ''
  }
  // Auto-set la couleur par défaut de la plateforme
  if (!isEditing.value || !form.value.color) {
    form.value.color = platformColors[platform] || '#3b82f6'
  }
}

const triggerIconInput = () => {
  iconInput.value?.click()
}

const handleIconUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploadingIcon.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'icons')

    const response = await $fetch<{ url: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    })

    form.value.icon_url = response.url
    toast.add({
      title: 'Icône uploadée',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
  } catch (e: any) {
    toast.add({
      title: 'Erreur upload',
      description: e.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  } finally {
    uploadingIcon.value = false
    if (target) target.value = ''
  }
}

const loadLinks = async () => {
  loading.value = true
  const { data } = await supabase
    .from('social_links')
    .select('*')
    .order('id')

  if (data) socialLinks.value = data
  loading.value = false
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = { id: 0, platform: '', url: '', description: '', color: '#3b82f6', icon_url: '' }
  selectedPlatform.value = ''
  error.value = ''
  showModal.value = true
}

const openEditModal = (link: any) => {
  isEditing.value = true
  // Vérifier si la plateforme est dans la liste prédéfinie
  const knownPlatforms = platformOptions.map(p => p.value).filter(v => v !== 'other')
  const isKnownPlatform = knownPlatforms.includes(link.platform)

  selectedPlatform.value = isKnownPlatform ? link.platform : 'other'
  form.value = {
    id: link.id,
    platform: link.platform,
    url: link.url,
    description: link.description,
    color: link.color || platformColors[link.platform] || '#3b82f6',
    icon_url: link.icon_url || '',
  }
  error.value = ''
  showModal.value = true
}

const handleSubmit = async () => {
  if (!selectedPlatform.value || !form.value.platform || !form.value.url || !form.value.description) {
    error.value = 'Tous les champs sont requis'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    if (isEditing.value) {
      const { error: updateError } = await supabase
        .from('social_links')
        .update({
          platform: form.value.platform,
          url: form.value.url,
          description: form.value.description,
          color: form.value.color,
          icon_url: form.value.icon_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', form.value.id)

      if (updateError) throw updateError
      toast.add({ title: 'Lien modifié', icon: 'i-heroicons-check-circle', color: 'green' })
    } else {
      const { error: insertError } = await supabase
        .from('social_links')
        .insert({
          platform: form.value.platform,
          url: form.value.url,
          description: form.value.description,
          color: form.value.color,
          icon_url: form.value.icon_url || null,
        })

      if (insertError) throw insertError
      toast.add({ title: 'Lien créé', icon: 'i-heroicons-check-circle', color: 'green' })
    }

    showModal.value = false
    await loadLinks()
  } catch (e: any) {
    error.value = e.message || 'Erreur'
    toast.add({ title: 'Erreur', description: e.message, icon: 'i-heroicons-exclamation-circle', color: 'red' })
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (link: any) => {
  linkToDelete.value = link
  showDeleteModal.value = true
}

const deleteLink = async () => {
  if (!linkToDelete.value) return

  deleting.value = true
  const deletedPlatform = linkToDelete.value.platform

  await supabase.from('social_links').delete().eq('id', linkToDelete.value.id)

  showDeleteModal.value = false
  linkToDelete.value = null
  deleting.value = false

  await loadLinks()
  toast.add({
    title: 'Lien supprimé',
    description: `Le lien ${deletedPlatform} a été supprimé`,
    icon: 'i-heroicons-trash',
    color: 'green',
  })
}

onMounted(loadLinks)
</script>
