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
				{{ currentCategory?.title }}
			</h2>
			<UDivider size="sm" class="divider w-48 mx-auto mt-2">
				<component :is="currentCategory?.icon" class="w-6 h-6" />
			</UDivider>
		</div>
		<div class="flex flex-col space-y-6 pl-4">
			<ProjectCard
				v-for="(project, index) in filteredProjects"
				:key="index"
				:project="project"
				:index="index"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import {
		categories,
		projects,
		type Project,
		type Category,
	} from '~/data/projects';
	import { gsap } from 'gsap';
	import { ArrowLeft } from 'lucide-vue-next';

	definePageMeta({
		pageTransition: {
			name: 'slide-fade-y-reverse',
		},
	});

	const route = useRoute();
	const currentCategory: Category | undefined = categories.find(
		(category: Category) => category.title === route.params.category,
	);

	const filteredProjects: Project[] = projects.filter(
		(project: Project) => project.category === currentCategory?.title,
	);

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
