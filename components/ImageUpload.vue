<template>
  <div class="space-y-3">
    <!-- Preview de l'image actuelle -->
    <div v-if="modelValue" class="relative inline-block">
      <img
        :src="modelValue"
        alt="Preview"
        class="w-48 h-32 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
      />
      <UButton
        @click="removeImage"
        icon="i-heroicons-x-mark"
        size="xs"
        color="red"
        variant="solid"
        class="absolute -top-2 -right-2"
      />
    </div>

    <!-- Zone d'upload -->
    <div
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
      :class="{
        'border-primary bg-primary/5': isDragging,
        'border-neutral-300 dark:border-neutral-600 hover:border-primary': !isDragging,
      }"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        class="hidden"
        @change="handleFileSelect"
      />

      <div v-if="uploading" class="flex flex-col items-center gap-2">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
        <span class="text-sm text-neutral-500">Upload en cours...</span>
      </div>

      <div v-else class="flex flex-col items-center gap-2">
        <UIcon name="i-heroicons-cloud-arrow-up" class="w-8 h-8 text-neutral-400" />
        <span class="text-sm text-neutral-500">
          Cliquez ou glissez une image ici
        </span>
        <span class="text-xs text-neutral-400">
          JPG, PNG, WebP ou GIF (max 10Mo)
        </span>
      </div>
    </div>

    <!-- Message d'erreur -->
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  folder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const isDragging = ref(false)
const error = ref('')

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    uploadFile(file)
  }
}

const uploadFile = async (file: File) => {
  // Vérifier la taille (max 10Mo)
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'Le fichier est trop volumineux (max 10Mo)'
    return
  }

  // Vérifier le type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Type de fichier non autorisé'
    return
  }

  uploading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', props.folder || 'projects')

    const response = await $fetch<{ url: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    })

    emit('update:modelValue', response.url)
  } catch (e: any) {
    error.value = e.data?.message || 'Erreur lors de l\'upload'
  } finally {
    uploading.value = false
  }
}

const removeImage = () => {
  emit('update:modelValue', '')
}
</script>
