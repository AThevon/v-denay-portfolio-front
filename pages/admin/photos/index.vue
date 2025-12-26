<template>
  <div class="px-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Photos</h1>
      <UButton @click="openCollectionModal()" icon="i-heroicons-plus">
        Nouvelle collection
      </UButton>
    </div>

    <!-- Collections -->
    <div class="space-y-8">
      <UCard v-for="collection in collections" :key="collection.id">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg font-semibold">{{ collection.name }}</h2>
              <p class="text-sm text-neutral-500">{{ collection.photos?.length || 0 }} photos</p>
            </div>
            <div class="flex gap-2">
              <UButton
                @click="openUploadModal(collection)"
                icon="i-heroicons-cloud-arrow-up"
                size="sm"
              >
                Ajouter des photos
              </UButton>
              <UButton
                @click="openCollectionModal(collection)"
                icon="i-heroicons-pencil"
                size="sm"
                variant="ghost"
              />
              <UButton
                @click="confirmDeleteCollection(collection)"
                icon="i-heroicons-trash"
                size="sm"
                color="red"
                variant="ghost"
              />
            </div>
          </div>
        </template>

        <!-- Grille de photos -->
        <div v-if="collection.photos?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="photo in collection.photos"
            :key="photo.id"
            class="group relative aspect-[3/4] overflow-hidden"
          >
            <img
              :src="photo.url"
              :alt="photo.alt"
              class="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <UButton
                @click="confirmDeletePhoto(photo, collection)"
                icon="i-heroicons-trash"
                size="xs"
                color="red"
              />
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-neutral-500">
          Aucune photo dans cette collection
        </div>
      </UCard>

      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
      </div>

      <div v-if="!loading && collections.length === 0" class="text-center py-12">
        <p class="text-neutral-500 mb-4">Aucune collection créée</p>
        <UButton @click="openCollectionModal()" icon="i-heroicons-plus">
          Créer une collection
        </UButton>
      </div>
    </div>

    <!-- Modal Collection (créer/modifier) -->
    <UModal v-model="showCollectionModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ editingCollection ? 'Modifier la collection' : 'Nouvelle collection' }}
          </h3>
        </template>

        <form @submit.prevent="saveCollection" class="space-y-4">
          <UFormGroup label="Nom" required>
            <UInput v-model="collectionForm.name" placeholder="Ex: Portraits" />
          </UFormGroup>

          <UFormGroup label="Description">
            <UTextarea v-model="collectionForm.description" placeholder="Description optionnelle" />
          </UFormGroup>

          <UFormGroup label="Position">
            <USelect
              v-model="collectionForm.display_order"
              :options="positionOptions"
              value-attribute="value"
              option-attribute="label"
            />
            <template #hint>
              1 = première position (en haut de la page)
            </template>
          </UFormGroup>

          <UAlert v-if="collectionError" color="red" :title="collectionError" />
        </form>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showCollectionModal = false">
              Annuler
            </UButton>
            <UButton @click="saveCollection" :loading="savingCollection">
              {{ editingCollection ? 'Enregistrer' : 'Créer' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal Upload Photos -->
    <UModal v-model="showUploadModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            Ajouter des photos à "{{ uploadCollection?.name }}"
          </h3>
        </template>

        <div class="space-y-4">
          <!-- Zone d'upload multiple -->
          <div
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
            :class="{
              'border-primary bg-primary/5': isDragging,
              'border-neutral-300 dark:border-neutral-600 hover:border-primary': !isDragging,
            }"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              class="hidden"
              @change="handleFileSelect"
            />

            <UIcon name="i-heroicons-cloud-arrow-up" class="w-12 h-12 mx-auto text-neutral-400 mb-2" />
            <p class="text-neutral-600 dark:text-neutral-400">
              Cliquez ou glissez des images ici
            </p>
            <p class="text-sm text-neutral-400">
              JPG, PNG ou WebP (plusieurs fichiers possibles)
            </p>
          </div>

          <!-- Liste des fichiers en cours d'upload -->
          <div v-if="uploadQueue.length" class="space-y-2">
            <div
              v-for="(item, index) in uploadQueue"
              :key="index"
              class="flex items-center gap-3 p-2 bg-neutral-100 dark:bg-neutral-800 rounded"
            >
              <img
                v-if="item.preview"
                :src="item.preview"
                class="w-12 h-12 object-cover rounded"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm truncate">{{ item.file.name }}</p>
                <div v-if="item.uploading" class="flex items-center gap-2">
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                  <span class="text-xs text-neutral-500">Upload en cours...</span>
                </div>
                <span v-else-if="item.done" class="text-xs text-green-500">Uploadé</span>
                <span v-else-if="item.error" class="text-xs text-red-500">{{ item.error }}</span>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="closeUploadModal">
              Fermer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal confirmation suppression collection -->
    <UModal v-model="showDeleteCollectionModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Supprimer la collection</h3>
        </template>
        <p>Êtes-vous sûr de vouloir supprimer "{{ collectionToDelete?.name }}" ?</p>
        <p class="text-sm text-neutral-500 mt-2">
          Toutes les photos de cette collection seront également supprimées.
        </p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showDeleteCollectionModal = false">
              Annuler
            </UButton>
            <UButton color="red" @click="deleteCollection" :loading="deletingCollection">
              Supprimer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal confirmation suppression photo -->
    <UModal v-model="showDeletePhotoModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Supprimer la photo</h3>
        </template>
        <p>Êtes-vous sûr de vouloir supprimer cette photo ?</p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showDeletePhotoModal = false">
              Annuler
            </UButton>
            <UButton color="red" @click="deletePhoto" :loading="deletingPhoto">
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
const collections = ref<any[]>([])

// Collection modal
const showCollectionModal = ref(false)
const editingCollection = ref<any>(null)
const collectionForm = ref({ name: '', description: '', display_order: 0 })
const savingCollection = ref(false)
const collectionError = ref('')

// Upload modal
const showUploadModal = ref(false)
const uploadCollection = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploadQueue = ref<any[]>([])

// Delete modals
const showDeleteCollectionModal = ref(false)
const collectionToDelete = ref<any>(null)
const deletingCollection = ref(false)

const showDeletePhotoModal = ref(false)
const photoToDelete = ref<{ photo: any; collection: any } | null>(null)
const deletingPhoto = ref(false)

const loadCollections = async () => {
  loading.value = true
  const { data } = await supabase
    .from('photo_collections')
    .select(`
      id, name, slug, description, display_order,
      photos:photos(id, url, alt, display_order)
    `)
    .order('display_order', { ascending: true })

  if (data) {
    collections.value = data.map(c => ({
      ...c,
      photos: c.photos?.sort((a: any, b: any) => a.display_order - b.display_order) || [],
    }))
  }
  loading.value = false
}

// Position options pour le select
const positionOptions = computed(() => {
  const maxPosition = collections.value.length + 1
  return Array.from({ length: maxPosition }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}${i === 0 ? ' (Premier)' : i === maxPosition - 1 ? ' (Dernier)' : ''}`,
  }))
})

// Collection CRUD
const openCollectionModal = (collection?: any) => {
  editingCollection.value = collection || null
  collectionForm.value = collection
    ? { name: collection.name, description: collection.description, display_order: collection.display_order }
    : { name: '', description: '', display_order: 1 }
  collectionError.value = ''
  showCollectionModal.value = true
}

const saveCollection = async () => {
  if (!collectionForm.value.name) {
    collectionError.value = 'Le nom est requis'
    return
  }

  // Auto-générer le slug depuis le nom
  const generatedSlug = collectionForm.value.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-') // Éviter les tirets multiples
    .replace(/^-|-$/g, '') // Supprimer les tirets en début/fin

  savingCollection.value = true
  collectionError.value = ''

  const newPosition = collectionForm.value.display_order
  const currentId = editingCollection.value?.id
  const oldPosition = editingCollection.value?.display_order

  try {
    // Réorganiser les positions des autres collections
    if (editingCollection.value && oldPosition !== newPosition) {
      // Édition avec changement de position
      if (newPosition < oldPosition) {
        // Déplace vers le haut : décaler les éléments entre newPosition et oldPosition vers le bas
        const toShift = collections.value.filter(
          c => c.id !== currentId && c.display_order >= newPosition && c.display_order < oldPosition
        )
        for (const c of toShift) {
          await supabase.from('photo_collections').update({ display_order: c.display_order + 1 }).eq('id', c.id)
        }
      } else {
        // Déplace vers le bas : décaler les éléments entre oldPosition et newPosition vers le haut
        const toShift = collections.value.filter(
          c => c.id !== currentId && c.display_order > oldPosition && c.display_order <= newPosition
        )
        for (const c of toShift) {
          await supabase.from('photo_collections').update({ display_order: c.display_order - 1 }).eq('id', c.id)
        }
      }
    } else if (!editingCollection.value) {
      // Nouvelle collection : décaler tous les éléments >= newPosition vers le bas
      for (const c of collections.value.filter(c => c.display_order >= newPosition)) {
        await supabase.from('photo_collections').update({ display_order: c.display_order + 1 }).eq('id', c.id)
      }
    }

    if (editingCollection.value) {
      const { error } = await supabase
        .from('photo_collections')
        .update({
          name: collectionForm.value.name,
          slug: generatedSlug,
          description: collectionForm.value.description,
          display_order: newPosition,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingCollection.value.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('photo_collections')
        .insert({
          name: collectionForm.value.name,
          slug: generatedSlug,
          description: collectionForm.value.description,
          display_order: newPosition,
        })

      if (error) throw error
    }

    showCollectionModal.value = false
    await loadCollections()
    toast.add({
      title: editingCollection.value ? 'Collection modifiée' : 'Collection créée',
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
  } catch (e: any) {
    collectionError.value = e.message || 'Erreur'
    toast.add({
      title: 'Erreur',
      description: e.message || 'Une erreur est survenue',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  } finally {
    savingCollection.value = false
  }
}

const confirmDeleteCollection = (collection: any) => {
  collectionToDelete.value = collection
  showDeleteCollectionModal.value = true
}

const deleteCollection = async () => {
  if (!collectionToDelete.value) return
  deletingCollection.value = true

  // Supprimer les fichiers S3 de toutes les photos de la collection
  const photos = collectionToDelete.value.photos || []
  for (const photo of photos) {
    await $fetch('/api/delete-file', {
      method: 'POST',
      body: { url: photo.url },
    }).catch(() => {}) // Ignorer les erreurs S3
  }

  // Supprimer en base
  await supabase.from('photos').delete().eq('collection_id', collectionToDelete.value.id)
  await supabase.from('photo_collections').delete().eq('id', collectionToDelete.value.id)

  showDeleteCollectionModal.value = false
  const deletedName = collectionToDelete.value.name
  collectionToDelete.value = null
  deletingCollection.value = false
  await loadCollections()
  toast.add({
    title: 'Collection supprimée',
    description: `"${deletedName}" a été supprimée`,
    icon: 'i-heroicons-trash',
    color: 'green',
  })
}

// Upload photos
const openUploadModal = (collection: any) => {
  uploadCollection.value = collection
  uploadQueue.value = []
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  uploadQueue.value = []
  loadCollections()
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    processFiles(Array.from(files))
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files) {
    processFiles(Array.from(files))
  }
}

const processFiles = async (files: File[]) => {
  for (const file of files) {
    // Vérifier le type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      continue
    }

    // Créer preview
    const preview = URL.createObjectURL(file)
    const item = reactive({
      file,
      preview,
      uploading: true,
      done: false,
      error: '',
    })
    uploadQueue.value.push(item)

    // Upload
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', `photos/${uploadCollection.value.slug}`)

      const response = await $fetch<{ url: string }>('/api/upload', {
        method: 'POST',
        body: formData,
      })

      // Sauvegarder en base
      const { error } = await supabase.from('photos').insert({
        collection_id: uploadCollection.value.id,
        url: response.url,
        alt: file.name.replace(/\.[^/.]+$/, ''),
        display_order: (uploadCollection.value.photos?.length || 0) + uploadQueue.value.indexOf(item),
      })

      if (error) throw error

      item.uploading = false
      item.done = true
    } catch (e: any) {
      item.uploading = false
      item.error = e.message || 'Erreur upload'
    }
  }
}

// Delete photo
const confirmDeletePhoto = (photo: any, collection: any) => {
  photoToDelete.value = { photo, collection }
  showDeletePhotoModal.value = true
}

const deletePhoto = async () => {
  if (!photoToDelete.value) return
  deletingPhoto.value = true

  // Supprimer le fichier S3
  await $fetch('/api/delete-file', {
    method: 'POST',
    body: { url: photoToDelete.value.photo.url },
  }).catch(() => {}) // Ignorer les erreurs S3

  // Supprimer en base
  await supabase.from('photos').delete().eq('id', photoToDelete.value.photo.id)

  showDeletePhotoModal.value = false
  photoToDelete.value = null
  deletingPhoto.value = false
  await loadCollections()
  toast.add({
    title: 'Photo supprimée',
    icon: 'i-heroicons-trash',
    color: 'green',
  })
}

onMounted(loadCollections)
</script>
