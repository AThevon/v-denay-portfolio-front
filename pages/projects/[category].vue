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
				v-for="(project, index) in sortedProjects"
				:key="index"
				:project="project"
				:index="index"
			/>
		</div>
		<div class="flex flex-col space-y-6 md:hidden">
			<ProjectCardMobile
				v-for="(project, index) in sortedProjects"
				:key="index"
				:project="project"
				:index="index"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { ref, watchEffect } from 'vue';
	import { useRoute } from 'vue-router';
	import { useFetch, useRuntimeConfig } from '#imports';
	import { AudioLines, Briefcase, Film } from 'lucide-vue-next';
	import { gsap } from 'gsap';
	import type { Project } from '~/types';

	definePageMeta({
		pageTransition: {
			name: 'slide-fade-y-reverse',
		},
	});

	// Récupération des variables d'environnement
	const config = useRuntimeConfig();
	const apiUrl = config.public.API_URL;

	// Route et catégorie actuelle
	const route = useRoute();
	const currentCategoryTitle = route.params.category as string;

	// État des projets
	const projects = ref<Project[]>([]);
	const categoryTitle = ref('');
	const categoryIcon = ref<any>('');

	// Fetch des projets via l'API
	const { data, error } = useFetch<Project[]>(
		`${apiUrl}/projects/${currentCategoryTitle}`,
	);

	const categoryIcons: { [key: string]: any } = {
		musique: AudioLines,
		corporate: Briefcase,
		fiction: Film,
	};

	// Gestion des données fetchées
	watchEffect(() => {
		if (data.value) {
			projects.value = data.value;
			// On suppose que tous les projets ont le même champ `category`
			if (projects.value.length > 0) {
				categoryTitle.value = projects.value[0].category.title;
				categoryIcon.value =
					categoryIcons[categoryTitle.value.toLowerCase()] || null;
			}
		}
	});

	// Tri des projets par date
	const sortedProjects = computed(() =>
		projects.value.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		),
	);

	// Animation avec GSAP
	onMounted(() => {
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
