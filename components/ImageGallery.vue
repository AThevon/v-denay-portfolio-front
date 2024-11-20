<template>
	<section>
		<h2
			v-show="images.length"
			ref="titleRef"
			class="text-3xl text-center font-bold pt-2 md:pt-12 xl:pt-24 opacity-0"
		>
			{{ title }}
		</h2>
		<div
			v-if="images.length"
			class="p-2 md:p-12 md:columns-2 xl:columns-3 min-[2200px]:columns-4 gap-4 mx-auto space-y-4 w-full"
		>
			<div
				v-for="(image, index) in images"
				:key="index"
				ref="imageRefs"
				class="relative overflow-hidden rounded transition-transform duration-300 ease-in-out hover:scale-[1.03] cursor-pointer"
			>
				<!-- Placeholder / Skeleton loader -->
				<USkeleton
					v-if="!image.loaded"
					class="absolute inset-0 w-full h-full rounded"
				/>
				<!-- Low-resolution image (progressive loading) -->
				<NuxtImg
					v-if="!image.loaded"
					:src="image.lowResSrc"
					:alt="`Image ${index}`"
					class="object-cover w-full h-full blur-md scale-110 transition"
					width="auto"
					quality="20"
				/>

				<!-- Full-resolution image -->
				<NuxtImg
					v-if="image.loaded"
					:src="image.src"
					:alt="`Image ${index}`"
					class="object-cover w-full h-full rounded"
					width="auto"
					@click="openViewer(index)"
				/>
			</div>
		</div>
	</section>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import { gsap } from 'gsap';

	// Props
	const emit = defineEmits(['open-viewer']);
	const props = defineProps({
		title: String,
		folder: String,
	});

	const images = ref([]);
	const titleRef = ref(null);
	const apiUrl = `/api/s3-bucket?folder=${props.folder}`;

	// Fetch images on mounted
	onMounted(async () => {
		// Title animation
		gsap.fromTo(
			titleRef.value,
			{ opacity: 0, y: -20 }, // Start state
			{
				opacity: 1,
				y: 0,
				duration: 1,
				delay: 0.5, // Delay of 1 second
				ease: 'power2.out',
			}, // End state
		);

		try {
			const response = await fetch(apiUrl);
			if (!response.ok) {
				console.error('Error fetching images:', response.statusText);
				return;
			}
			const imageList = await response.json();

			// Initialize image data with low-res and loading state
			images.value = imageList.map((image) => ({
				...image,
				loaded: false, // Full-res not yet loaded
				lowResSrc: `${image.src}?quality=10`, // Low-quality version
			}));

			// Load each image progressively
			imageList.forEach((image, index) => {
				const img = new Image();
				img.src = image.src; // High-resolution image
				img.onload = () => {
					images.value[index].loaded = true; // Full-res loaded
				};
			});
		} catch (error) {
			console.error('Error fetching images:', error);
		}
	});

	const openViewer = (index) => {
		emit('open-viewer', { index, images: images.value });
	};
</script>
