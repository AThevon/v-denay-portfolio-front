<template>
  <section>
    <h2 v-if="images.length" class="text-3xl text-center font-bold pt-2 md:pt-12 xl:pt-24">
      {{ title }}
    </h2>
    <div
      v-if="images.length"
      class="p-2 md:p-12 md:columns-2 xl:columns-3 gap-4 mx-auto space-y-4 w-full"
    >
      <div v-for="(image, index) in images" :key="index" class="relative">
        <!-- Skeleton loader while the image is loading -->
        <USkeleton
          v-if="image.loading"
          class="absolute rounded inset-0 w-full h-full"
        />
        <NuxtImg
          v-if="!image.loading"
          :src="image.lowResSrc"
          :alt="`Image ${index}`"
          class="object-contain rounded shadow transition-all md:hover:scale-[1.03] cursor-pointer"
          width="auto"
          quality="20"
          @click="openViewer(index)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Emits to parent component when an image is clicked to open the viewer
const emit = defineEmits(['open-viewer']);
const props = defineProps({
  title: String,
  folder: String,
});

const images = ref([]);

// Fetch images from the new API endpoint using S3
onMounted(async () => {
  try {
    const response = await fetch(`/api/s3-bucket/${props.folder}`);
    if (!response.ok) {
      console.error('Error fetching images:', response.statusText);
      return;
    }
    const imageList = await response.json();

    // Initialize images with a loading state
    images.value = imageList.map((image) => ({
      ...image,
      loading: true, // Start with loading: true
      lowResSrc: `${image.src}?quality=30`, // Load low quality first
    }));

    // Asynchronously load each image and update the state individually
    imageList.forEach((image, index) => {
      const img = new Image();
      img.src = image.lowResSrc;
      img.onload = () => {
        images.value[index].loading = false; // Set loading to false after the image is loaded
      };
    });
  } catch (error) {
    console.error('Error fetching images:', error);
  }
});

// Open image viewer by emitting event to parent
const openViewer = (index) => {
  emit('open-viewer', { index, images: images.value });
};
</script>