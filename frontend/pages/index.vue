<template>
	<div
		class="relative h-screen flex flex-col xl:flex-row justify-center xl:justify-between items-center gap-16 xl:gap-8 w-full max-w-[50rem] mx-auto"
	>
		<div class="flex flex-col">
			<h2 class="text-4xl text-center md:text-6xl">
				Victor<span class="ml-2 md:ml-4 font-bold font-second tracking-widest"
					>Denay</span
				>
			</h2>
			<h3 class="text-lg md:text-2xl opacity-60 text-center">
				Monteur / Photographe
			</h3>
			<NuxtLink
				to="/projects"
				class="mt-8 w-[18rem] text-center mx-auto text-xl font-second tracking-widest px-4 py-3 bg-neutral-300 text-neutral-800 rounded-lg hover:text-neutral-100 hover:bg-neutral-800 transition-all active:scale-95"
			>
				Projets vidéo
			</NuxtLink>
			<NuxtLink
				to="/photos"
				class="mt-2 w-[18rem] text-center mx-auto text-xl font-second tracking-widest px-4 py-3 bg-neutral-300 text-neutral-800 rounded-lg hover:text-neutral-100 hover:bg-neutral-800 transition-all active:scale-95"
			>
				Mes photographies
			</NuxtLink>
		</div>
		<div class="relative">
			<div
				ref="rotatedDiv"
				class="absolute w-[18rem] h-[22rem] rounded-3xl bg-neutral-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 rotate-8"
			></div>
			<div
				class="relative w-[18rem] h-[22rem] rounded-3xl shadow-lg overflow-hidden"
			>
				<NuxtImg
					src="images/victor.jpeg"
					alt="Victor Denay"
					class="object-cover -translate-y-2 scale-125 w-full h-full"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import gsap from 'gsap';

	const rotatedDiv = ref(null);

	onMounted(() => {
		// Initial animation
		gsap.fromTo(
			rotatedDiv.value,
			{
				scale: 0,
				rotate: -45,
				opacity: 0,
			},
			{
				scale: 1,
				rotate: 8,
				opacity: 1,
				duration: 2,
				delay: 0.2,
				ease: 'elastic.out(1, 0.8)',
				onComplete: () => {
					// Breathing effect
					gsap.to(rotatedDiv.value, {
						scale: 1.05,
						rotate: 12,
						duration: 4,
						repeat: -1, // Infinite repeat
						yoyo: true, // Reverse animation on each repeat
						ease: 'power1.inOut',
					});
				},
			},
		);
	});
</script>
