<template>
	<div>
		<div class="relative md:h-screen overflow-hidden w-full">
			<div
				class="flex flex-col lg:flex-row h-[40vh] md:h-[95vh] justify-center items-center"
			>
				<div class="hidden md:block w-[30rem] h-[30rem] -ml-10">
					<TresCanvas shadows alpha >
						<TresPerspectiveCamera
							:position="[2, 0.6, -1]"
							:scale="[1, 1, 1.5]"
						/>
						<OrbitControls :enablePan="false" :enableZoom="false" />
						<Suspense>
							<ThreeModel />
						</Suspense>
						<TresDirectionalLight :intensity="20" :position="[3, 3, 3]" />
						<TresAmbientLight :intensity="20" />
					</TresCanvas>
				</div>
				<div class="flex flex-col mb-16">
					<h2
						ref="titleRef"
						class="title text-4xl text-center md:text-6xl opacity-0"
					>
						Victor<span
							class="ml-2 md:ml-4 font-bold font-second tracking-widest"
							>Denay</span
						>
					</h2>
					<h3
						ref="subtitleRef"
						class="text-lg md:text-2xl text-neutral-500 dark:text-neutral-400 text-center min-h-[2rem]"
					></h3>
					<div ref="buttonContainerRef" class="mt-4 flex flex-col gap-2">
						<NuxtLink
							v-for="(button, index) in buttons"
							:key="index"
							:to="button.link"
							class="opacity-0 w-[18rem] text-center mx-auto text-xl font-second tracking-widest px-4 py-3 bg-neutral-300 text-neutral-800 rounded-lg hover:text-neutral-100 hover:bg-neutral-800 active:scale-95"
						>
							{{ button.label }}
						</NuxtLink>
					</div>
				</div>
			</div>
			<div
				ref="arrowContainerRef"
				class="md:absolute bottom-0 w-full py-4 hover:scale-105 active:scale-95 transition-transform duration-300 ease-in-out cursor-pointer opacity-0"
				@click="handleScrollTo('#project')"
			>
				<p
					class="text-center font-second tracking-widest text-lg md:text-xl lg:text-2xl"
				>
					Mon dernier projet
				</p>
				<ArrowBigDown ref="arrowRef" class="mx-auto w-6 h-6 md:w-12 md:h-12" />
			</div>
		</div>
		<div class="h-screen md:p-8" id="project">
			<FeaturedProject />
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { onMounted, ref } from 'vue';
	import { gsap } from 'gsap';
	import { TextPlugin } from 'gsap/TextPlugin';
	import { ArrowBigDown } from 'lucide-vue-next';

	gsap.registerPlugin(TextPlugin);

	// Références pour le titre et le sous-titre
	const titleRef = ref(null);
	const subtitleRef = ref(null);
	const arrowContainerRef = ref(null);
	const arrowRef = ref(null);

	const buttons = [
		{ label: 'Projets vidéo', link: '/projects' },
		{ label: 'Mes photographies', link: '/photos' },
	];

	// Références pour les boutons
	const buttonContainerRef = ref();

	const handleScrollTo = (selector: string) => {
		const element = document.querySelector(selector);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	onMounted(async () => {
		await nextTick(); // Attendre que toutes les références soient collectées

		// Animation du titre
		gsap.to(titleRef.value, {
			opacity: 1,
			duration: 1,
			ease: 'power2.out',
			onComplete: () => {
				// Animation du sous-titre après le titre
				gsap.to(subtitleRef.value, {
					text: 'Monteur / Photographe',
					duration: 1.5,
					ease: 'power1.inOut',
				});
			},
		});

		const buttons = Array.from(buttonContainerRef.value.children); // Convertir en tableau
		gsap.fromTo(
			buttons,
			{
				y: 50,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				stagger: 0.4,
				duration: 1.5,
				ease: 'power3.out',
				delay: 2.2,
			},
		);

		// Animation de la flèche
		gsap.to(arrowContainerRef.value, {
			opacity: 1,
			duration: 1,
			delay: 2.5,
			ease: 'power2.out',
			onComplete: () => {
				gsap.to(arrowRef.value, {
					scale: 1.15,
					duration: 1.5,
					repeat: -1,
					yoyo: true,
					ease: 'power1.inOut',
				});
			},
		});
	});

	definePageMeta({
		pageTransition: {
			name: 'slide-fade-x',
			mode: 'out-in',
		},
		title: 'Accueil - Victor Denay | Monteur & Photographe',
		meta: [
			{
				name: 'description',
				content:
					'Bienvenue sur le portfolio de Victor Denay, un professionnel créatif en montage vidéo et photographie. Découvrez ses travaux récents et projets artistiques.',
			},
			{ property: 'og:image', content: '/images/home-preview.png' },
		],
	});
</script>
