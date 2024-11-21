<template>
	<div
		class="grid sm:grid-cols-2 xl:grid-cols-3 h-full w-full grid-flow-row auto-rows-fr"
	>
		<div v-if="error" class="col-span-full text-center text-red-500">
			Une erreur est survenue : {{ error.message }}
		</div>

		<div
			v-else-if="status === 'pending'"
			class="col-span-full text-center text-gray-500"
		>
			Chargement des catégories...
		</div>

		<div
			v-for="(category, index) in categories"
			:key="index"
			class="group relative cursor-pointer overflow-hidden"
			:class="{
				'sm:col-span-2 xl:col-span-1':
					index === 0 && categories.length % 2 !== 0,
			}"
			ref="categoryDivs"
			@click="handleNavigation(index, category.title)"
		>
			<div
				class="absolute top-0 left-0 bottom-0 right-0 w-full h-full z-10 bg-neutral-900 opacity-50 transition-opacity duration-300 group-hover:opacity-20 pointer-events-none"
			></div>
			<NuxtImg
				class="h-full w-full object-cover -z-10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
				:src="category.image"
				:alt="category.title"
			/>
			<div
				class="absolute top-0 left-0 bottom-0 right-0 w-full h-full z-20 flex items-center justify-center"
			>
				<h2 class="text-3xl text-white font-bold capitalize">
					{{ category.title }}
				</h2>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { onMounted, ref, computed } from 'vue';
	import gsap from 'gsap';
	import type { Category } from '~/types';

	definePageMeta({
		title: 'Projets Vidéo - Victor Denay | Monteur Vidéo',
		meta: [
			{
				name: 'description',
				content:
					'Découvrez les projets vidéo de Victor Denay, un expert en montage vidéo créatif, travaillant sur des clips, interviews, publicités et courts-métrages.',
			},
			{ property: 'og:image', content: '/images/video-projects.png' },
		],
	});

	const router = useRouter();
	const config = useRuntimeConfig();
	const apiUrl = config.public.API_URL;

	// Référence pour les divs des catégories
	const categoryDivs = ref<(HTMLElement | null)[]>([]);

	// Utilisation de useFetch pour récupérer les catégories
	const {
		data: categoriesData,
		status,
		error,
	} = await useFetch<Category[]>(`${apiUrl}/categories`);

	// Gestion des catégories récupérées
	const categories = computed(() => categoriesData.value || []);

	// Animation GSAP à l'affichage
	onMounted(() => {
		gsap.from(categoryDivs.value, {
			y: 100,
			opacity: 0,
			stagger: 0.2,
			duration: 0.6,
			ease: 'power1.inOut(.5)',
		});
	});

	// Navigation avec animation
	const handleNavigation = (index: number, category: string) => {
		const tl = gsap.timeline({
			onComplete: () => {
				router.push({ name: 'projects-category', params: { category } });
			},
		});

		tl.to(categoryDivs.value[index], {
			scale: 0.7,
			opacity: 0,
			duration: 0.3,
			ease: 'power1.out',
		});

		tl.to(
			categoryDivs.value.filter((_, i) => i !== index),
			{
				opacity: 0,
				duration: 0.2,
				ease: 'power1.in',
			},
			'-=0.07',
		);
	};
</script>
