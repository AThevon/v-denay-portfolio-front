<template>
	<div
		class="card bg-neutral-300/30 dark:bg-neutral-700/30 backdrop-blur-md rounded-s-2xl border border-neutral-300/10 dark:border-neutral-700/10 p-8 translate-x-10 pb-[8rem] relative overflow-hidden"
		ref="cardElement"
	>
		<!-- <div :class="['flex', { 'flex-row-reverse': index % 2 !== 0 }]"> -->
		<div class="grid grid-cols-[660px_1fr]">
			<iframe
				class="rounded-lg aspect-video"
				:src="project.url"
				width="660"
				height="415"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
			<div class="px-8">
				<div class="mt-5 flex justify-between items-start">
					<h3 class="text-3xl font-bold">
						{{ project.title }}
					</h3>
					<p class="font-second tracking-widest opacity-60 text-lg">
						{{ project.date }}
					</p>
				</div>
				<div v-if="project.client" class="">
					<p class="font-second text-xl tracking-widest opacity-80">
						{{
							(project.category = CategoryTitle.MUSIQUE ? 'Artiste' : 'Client')
						}}
						: {{ project.client }}
					</p>
				</div>
			</div>
		</div>
		<!-- <p class="mt-4 mb-[4rem]">{{ project.description }}</p> -->
	</div>
</template>

<script lang="ts" setup>
	import { CategoryTitle, type Project } from '~/data/projects';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Category from '~/pages/projects/[category].vue';

	// Enregistre le plugin ScrollTrigger
	gsap.registerPlugin(ScrollTrigger);

	const props = defineProps({
		project: {
			type: Object as PropType<Project>,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
	});

	const cardElement = ref<HTMLElement | null>(null);

	onMounted(() => {
		setTimeout(() => {
			if (cardElement.value) {
				// Une seule animation gsap avec tous les effets
				gsap.to(cardElement.value, {
					translateX: 0, // Réinitialise la translation
					boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
					scrollTrigger: {
						trigger: cardElement.value,
						start: 'top 50%',
						end: 'bottom 50%',
						toggleActions: 'play reverse play reverse', // Animation se rejoue dans les deux sens
						markers: false, // Désactive les marqueurs
					},
					duration: 0.6, // Durée de l'animation
					ease: 'power2.inOut', // Transition fluide
				});
			}
		}, 1000); // Attendre 1 seconde avant d'initialiser l'animation
	});
</script>
