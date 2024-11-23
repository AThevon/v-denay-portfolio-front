<template>
	<section class="w-full h-full max-w-[120rem] mx-auto">
		<!-- Galleries -->
		<ImageGallery
			v-if="showFirstGallery"
			title="Photos Color"
			folder="photos/photos-color"
			@open-viewer="openViewer"
		/>
		<ImageGallery
			v-if="showSecondGallery"
			title="Illusions Perdues"
			folder="photos/illusions-perdues"
			@open-viewer="openViewer"
		/>
		<ImageGallery
			v-if="showThirdGallery"
			title="Portraits"
			folder="photos/portraits"
			@open-viewer="openViewer"
		/>

		<!-- Viewer -->
		<div
			class="fixed inset-0 z-50 flex transition-all items-center justify-center bg-black bg-opacity-75"
			:class="{ 'opacity-0 pointer-events-none': !viewerOpen }"
			@click.self="closeViewer"
		>
			<button
				@click="closeViewer"
				class="absolute top-4 right-4 text-white text-xl z-50"
			>
				<X class="w-8 h-8" />
			</button>

			<!-- Loader -->
			<div
				v-if="viewerLoading"
				class="absolute inset-0 flex items-center justify-center"
			>
				<LoaderCircle class="w-24 h-24 animate-spin text-neutral-100" />
			</div>

			<!-- Image Viewer -->
			<NuxtImg
				v-if="viewerOpen && !viewerLoading && images[currentIndex]"
				:alt="images[currentIndex]?.alt || 'Image'"
				class="img-viewer md:h-full max-h-[90%] object-contain shadow"
				width="auto"
				height="auto"
				:src="images[currentIndex]?.src"
				@load="onViewerImageLoad"
			/>
		</div>
	</section>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue';
	import { X, LoaderCircle } from 'lucide-vue-next';

  definePageMeta({
    pageTransition: {
			name: 'slide-fade-x',
			mode: 'out-in',
		},
    title: 'Photographies - Victor Denay | Photographe',
    meta: [
      {
        name: 'description',
        content:
          'Découvrez les photographies de Victor Denay, un photographe passionné par les portraits et les éclairages.',
      },
      { property: 'og:image', content: '/images/photography.png' },
    ],
  });

	const viewerOpen = ref(false);
	const viewerLoading = ref(true);
	const currentIndex = ref(0);
	const images = ref([]);

	const showFirstGallery = ref(false);
	const showSecondGallery = ref(false);
	const showThirdGallery = ref(false);

	onMounted(() => {
		setTimeout(() => {
			showFirstGallery.value = true;
		}, 0);
		setTimeout(() => {
			showSecondGallery.value = true;
		}, 500);
		setTimeout(() => {
			showThirdGallery.value = true;
		}, 1000);

		// Gestion du bouton retour
		const handlePopState = () => {
			if (viewerOpen.value) {
				closeViewer();
				history.pushState(null, '', location.href);
			}
		};

		// Ajoute un état pour le viewer ouvert
		if (viewerOpen.value) {
			history.pushState(null, '', location.href);
		}

		// Écoute l'événement popstate
		window.addEventListener('popstate', handlePopState);

		onUnmounted(() => {
			window.removeEventListener('popstate', handlePopState);
		});
	});

	const openViewer = async ({ index, images: imgs }) => {
		viewerLoading.value = true;
		viewerOpen.value = true;

		if (!imgs || imgs.length === 0) {
			console.error('No images provided to open viewer');
			viewerLoading.value = false;
			return;
		}

		images.value = imgs;

		if (index < 0 || index >= images.value.length) {
			console.error(`Index ${index} out of bounds for images array`);
			viewerLoading.value = false;
			return;
		}

		currentIndex.value = index;
		viewerLoading.value = false;

		// Ajoute un état dans l'historique
		history.pushState(null, '', location.href);
	};

	const closeViewer = () => {
		viewerOpen.value = false;
	};

	const onViewerImageLoad = () => {
		viewerLoading.value = false;
	};
</script>
