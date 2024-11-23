<template>
	<primitive :object="scene" />
</template>

<script setup lang="ts">
	import { onMounted } from 'vue';
	import { useGLTF } from '@tresjs/cientos';
	import gsap from 'gsap';

	// Charger le modèle GLTF
	const { scene } = await useGLTF('/models/scene.gltf', { draco: true });

	// Initialiser l'échelle à 0
	scene.scale.set(0, 0, 0);

	// Animation GSAP
	onMounted(() => {
		// Animation de mise à l'échelle avec effet élastique
		gsap
			.to(scene.scale, {
				x: 1,
				y: 1,
				z: 1,
				duration: 1.5,
				ease: 'elastic.out(1, 0.8)',
			})
			.delay(0.5);
	});

	// Animation GSAP
	onMounted(() => {
		// Animation de flottement vertical
		gsap.to(scene.position, {
			y: 0.06,
			duration: 2.5,
			repeat: -1, // Animation infinie
			yoyo: true, // Aller-retour
			ease: 'power1.inOut',
		});

		// Animation de rotation sur l'axe Y
		gsap.to(scene.rotation, {
			y: 0.1,
			duration: 5,
			repeat: -1,
			yoyo: true,
			ease: 'power1.inOut',
		});
	});
</script>
