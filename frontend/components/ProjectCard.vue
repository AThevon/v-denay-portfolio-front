<template>
	<div
		class="card bg-neutral-300/30 dark:bg-neutral-700/30 backdrop-blur-md rounded-s-2xl border border-neutral-300/10 dark:border-neutral-700/10 md:translate-x-10 lg:px-10 py-10 md:py-20 relative overflow-hidden"
		ref="cardElement"
	>
		<NuxtImg
			:src="project.image"
			:alt="project.title"
			class="absolute inset-0 -z-20 object-cover w-full h-full blur-[3px]"
		/>
		<div
			class="-z-10 absolute inset-0 bg-gradient-to-r from-neutral-900/20 to-neutral-950"
		></div>
		<div class="grid xl:grid-cols-[620px_1fr] h-full">
			<p
				class="md:absolute md:top-8 xl:top-10 md:right-16 font-second tracking-widest text-gray-400 w-full text-center md:text-end mb-6 text-xl"
			>
				{{ formatDate(project.date) }}
			</p>
			<iframe
				class="rounded-lg w-full md:w-[80%] lg:w-[620px] aspect-video place-self-center"
				:src="project.url"
				width="620"
				height="400"
				title="Video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
			<div class="pl-8 pr-4 mt-20 text-neutral-100">
				<div class="h-full flex flex-col gap-8 items-center xl:items-start">
					<div class="flex flex-col items-center xl:items-start">
						<h3 class="text-4xl font-bold">
							{{ project.title }}
						</h3>
						<p class="w-fit font-second text-2xl tracking-widest text-gray-300">
							<span
								class="block h-[1.5px] bg-neutral-400 -translate-x-[12.5%] xl:translate-x-0 w-[125%] my-2 rounded"
							/>
							{{ project.client }}
						</p>
					</div>
					<div class="text-lg font-light text-gray-300">
						Rôle :
						<span
							class="font-bold text-neutral-100"
							v-for="(role, index) in project.roles"
							:key="role"
						>
							{{ role
							}}<span
								class="font-normal"
								v-if="index < project.roles.length - 1"
								>,
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { type Project } from '~/data/projects';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('fr-FR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}).format(date);
	};

	onMounted(() => {
		setTimeout(() => {
			if (cardElement.value) {
				// Une seule animation gsap avec tous les effets
				gsap.to(cardElement.value, {
					translateX: 10, // Réinitialise la translation
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
