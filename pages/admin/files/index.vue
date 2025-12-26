<template>
  <div class="px-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Fichiers</h1>

    <div class="space-y-6">
      <!-- CV -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg font-semibold">CV</h2>
              <p class="text-sm text-neutral-500">PDF du curriculum vitae</p>
            </div>
            <a
              v-if="files.cv?.url"
              :href="files.cv.url"
              target="_blank"
              class="text-primary hover:underline text-sm"
            >
              Voir le fichier actuel
            </a>
          </div>
        </template>

        <div class="space-y-4">
          <div v-if="files.cv?.url" class="flex items-center gap-3 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-red-500" />
            <div class="flex-1">
              <p class="font-medium">{{ files.cv.filename }}</p>
              <p class="text-xs text-neutral-500">
                Mis à jour le {{ formatDate(files.cv.updated_at) }}
              </p>
            </div>
          </div>

          <FileUpload
            accept=".pdf"
            folder="misc"
            :uploading="uploadingCv"
            @upload="uploadCv"
          />
        </div>
      </UCard>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
    </div>
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
const uploadingCv = ref(false)

interface FileRecord {
  id: number
  key: string
  url: string
  filename: string
  updated_at: string
}

const files = ref<Record<string, FileRecord | null>>({
  cv: null,
})

const loadFiles = async () => {
  loading.value = true

  const { data } = await supabase
    .from('files')
    .select('*')
    .in('key', ['cv'])

  if (data) {
    for (const file of data) {
      files.value[file.key] = file
    }
  }

  loading.value = false
}

const uploadCv = async (file: File) => {
  uploadingCv.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'misc')

    const response = await $fetch<{ url: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    })

    // Sauvegarder en base
    await $fetch(`/api/files/cv`, {
      method: 'PUT',
      body: {
        url: response.url,
        filename: file.name,
      },
    })

    await loadFiles()
  } catch (e: any) {
    console.error('Erreur upload CV:', e)
  } finally {
    uploadingCv.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(loadFiles)
</script>
