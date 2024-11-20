<template>
	<div class="h-full max-w-[100rem] mx-auto">
		<div class="py-8 xl:py-24">
			<h2 class="text-3xl text-center font-bold">Me contacter</h2>
			<UDivider size="sm" class="divider w-72 mx-auto mt-2">
				<MessageCircle class="w-6 h-6" />
			</UDivider>
		</div>
		<div class="grid xl:grid-cols-2 gap-12 px-4 sm:px-12 md:px-24 xl:px-32">
			<div class="flex flex-col gap-2">
				<h3
					class="flex items-center gap-2 text-2xl mb-4 font-bold font-second tracking-widest"
				>
					Sur les réseaux <CornerRightDown class="w-6 h-6 translate-y-2" />
				</h3>
				<NuxtLink
					to="https://www.instagram.com/nitro_vision?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
					class="flex font-second tracking-widest gap-4 text-lg p-6 bg-neutral-300 text-neutral-800 rounded-lg hover:text-neutral-100 hover:bg-gradient-instagram transition-all active:scale-95"
				>
					<Instagram class="w-6 h-6" />
					Suivez-moi sur Instagram
				</NuxtLink>

				<NuxtLink
					to="https://www.linkedin.com/in/victor-denay-844889256/"
					class="flex font-second tracking-widest gap-4 text-lg p-6 bg-neutral-300 text-neutral-800 rounded-lg hover:text-neutral-100 hover:bg-gradient-linkedin transition-all active:scale-95"
				>
					<Linkedin class="w-6 h-6" />
					Rejoignez-moi sur LinkedIn
				</NuxtLink>

				<h3
					class="flex items-center gap-2 text-2xl mt-8 mb-4 font-bold font-second tracking-widest"
				>
					Mon CV <CornerRightDown class="w-6 h-6 translate-y-2" />
				</h3>
				<button
					@click="openCV"
					class="flex font-second tracking-widest gap-4 text-lg p-6 bg-neutral-300 text-neutral-800 rounded-lg hover:text-neutral-100 hover:bg-red-600 transition-all active:scale-95"
				>
					<FileOutput class="w-6 h-6" />
					Ouvrir le PDF
				</button>
			</div>
			<div>
				<h3
					class="flex w-full gap-2 text-2xl mb-4 font-bold font-second tracking-widest"
				>
					Ou par mail <CornerRightDown class="w-6 h-6 translate-y-2" />
				</h3>
				<ContactForm />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import {
		CornerRightDown,
		FileOutput,
		Instagram,
		Linkedin,
		MessageCircle,
	} from 'lucide-vue-next';
	import { onMounted } from 'vue';
	import { gsap } from 'gsap';

	definePageMeta({
		title: 'Contact - Victor Denay | Monteur & Photographe',
		meta: [
			{
				name: 'description',
				content:
					'Contactez Victor Denay pour vos projets de photographie et de montage vidéo. Disponible pour des collaborations créatives à Tours et ailleurs.',
			},
			{ property: 'og:image', content: '/images/contact-banner.jpg' },
		],
	});

	const openCV = () => {
		// URL publique de S3
		window.open(
			`https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/cv.pdf`,
			'_blank',
		);
	};

	onMounted(() => {
		const timeline = gsap.timeline();
		timeline
			.from(
				'.grid div',
				{ opacity: 0, y: 50, duration: 0.25, stagger: 0.05, delay: 0.7 },
				'-=0.3',
			)
			.from('h3', { opacity: 0, duration: 1 })
			.from(
				'.divider',
				{
					scaleX: 0,
					transformOrigin: 'center',
					opacity: 0,
					duration: 0.7,
					delay: 0.5,
					ease: 'power2.inOut',
				},
				'-=2.3',
			);
	});
</script>
