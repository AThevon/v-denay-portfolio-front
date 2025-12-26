<template>
	<div class="h-full">
		<div class="relative py-8 xl:py-12">
			<NuxtLink
				to="/projects"
				class="nuxtlink-back absolute left-16 top-12 xl:top-16 transition-transform hover:scale-[1.05] active:scale-90 z-50 hidden md:block"
			>
				<NuxtImg
					src="/images/arrow-back.svg"
					alt="Retour"
					class="rotate-180 w-10 h-10 xl:w-14 xl:h-14 dark:invert"
				/>
			</NuxtLink>
			<h2
				class="text-3xl text-center font-bold font-second tracking-widest capitalize"
			>
				{{ categoryTitle }}
			</h2>
			<UDivider size="sm" class="divider w-48 mx-auto mt-2">
				<component :is="categoryIcon" class="w-6 h-6" />
			</UDivider>
		</div>
		<div
			class="hidden md:flex flex-col space-y-6 pl-4 pb-14 ml-auto max-w-[150rem]"
		>
			<ProjectCard
				v-for="(project, index) in projects"
				:key="index"
				:project="project"
				:index="index"
			/>
		</div>
		<div class="flex flex-col space-y-6 md:hidden">
			<ProjectCardMobile
				v-for="(project, index) in projects"
				:key="index"
				:project="project"
				:index="index"
			/>
		</div>
		<div v-if="projects.length !== 0" class="text-center">
			<button
				v-if="nextPageUrl"
				@click="loadMoreProjects"
				class="mt-8 md:mt-0 mb-12 w-[18rem] text-center mx-auto text-xl font-second tracking-widest px-8 py-4 bg-neutral-300 text-neutral-800 rounded-lg hover:text-neutral-100 hover:bg-neutral-800 transition-all active:scale-95"
				:disabled="loadingMore"
			>
				{{ loadingMore ? 'Chargement...' : 'Voir plus' }}
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { ref, onMounted } from 'vue';
	import { useRoute } from 'vue-router';
	import { AudioLines, Briefcase, Film, Loader } from 'lucide-vue-next';
	import type { Project } from '~/types';
	import { gsap } from 'gsap';

	// Routes
	const route = useRoute();
	const currentCategoryTitle = route.params.category as string;

	// États locaux
	const projects = ref<Project[]>([]);
	const categoryTitle = ref('');
	const categoryIcon = ref<any>('');
	const nextPageUrl = ref<string | null>(
		`/api/projects/${currentCategoryTitle}`,
	);
	const loadingMore = ref(false);

	// Icônes des catégories
	const categoryIcons: { [key: string]: any } = {
		musique: AudioLines,
		corporate: Briefcase,
		fiction: Film,
	};

	// Charger les projets (fonction réutilisable)
	const fetchProjects = async (url: string) => {
		loadingMore.value = true;

		try {
			const response = await $fetch<any>(url);

			// Extraire les projets et la prochaine URL
			const newProjects = response.data; // Vérifiez bien ici que `data` contient les projets
			const nextPage = response.next_page_url;

			projects.value.push(...newProjects);

			// Mettre à jour l'URL pour la prochaine page
			nextPageUrl.value = nextPage;

			// Initialiser les informations de catégorie (au premier chargement uniquement)
			if (projects.value.length > 0 && !categoryTitle.value) {
				categoryTitle.value = projects.value[0].category.title;
				categoryIcon.value =
					categoryIcons[categoryTitle.value.toLowerCase()] || null;
			}
		} catch (error) {
			console.error('Erreur lors du chargement des projets :', error);
			nextPageUrl.value = null; // Si erreur, pas de page suivante
		} finally {
			loadingMore.value = false;
		}
	};

	// Charger plus de projets
	const loadMoreProjects = async () => {
		if (nextPageUrl.value) await fetchProjects(nextPageUrl.value);
	};

	// Animation avec GSAP
	onMounted(() => {
		if (nextPageUrl.value) fetchProjects(nextPageUrl.value);

		const timeline = gsap.timeline();
		timeline.from('.divider', {
			scaleX: 0,
			transformOrigin: 'center',
			opacity: 0,
			duration: 0.7,
			delay: 0.5,
			ease: 'power2.inOut',
		});
		timeline.from('.nuxtlink-back', {
			opacity: 0,
			duration: 0.5,
			ease: 'power2.out',
		});
		timeline.from(
			'.card',
			{
				y: 100,
				opacity: 0,
				stagger: 0.2,
				duration: 0.6,
				ease: 'power1.inOut(.9)',
			},
			'-=0.9',
		);
	});
</script>
