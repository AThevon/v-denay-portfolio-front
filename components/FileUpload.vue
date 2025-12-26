<template>
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
      :accept="accept"
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
        Cliquez ou glissez un fichier ici
      </span>
      <span class="text-xs text-neutral-400">
        {{ acceptLabel }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  accept?: string
  folder?: string
  uploading?: boolean
}>()

const emit = defineEmits<{
  upload: [file: File]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const acceptLabel = computed(() => {
  if (props.accept === '.pdf') return 'PDF uniquement'
  if (props.accept?.includes('image')) return 'Images uniquement'
  return 'Tous les fichiers'
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('upload', file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    emit('upload', file)
  }
}
</script>
