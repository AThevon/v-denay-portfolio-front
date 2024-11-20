<template>
	<div class="relative">
		<div
			v-show="isMenuOpen"
			class="fixed top-0 left-0 bottom-0 right-0 w-full h-full z-40 bg-neutral-900 opacity-50"
			@click.self="toggleMenu"
		></div>
		<aside
			v-show="isMenuOpen"
			ref="menu"
			class="h-full fixed w-[16rem] bg-neutral-100 dark:bg-neutral-900 right-0 flex-col md:hidden z-50"
		>
			<div class="mx-auto flex justify-between items-center gap-3 p-4">
				<ThemeToggle />
				<NuxtLink
					href="https://www.instagram.com/nitro_vision"
					target="_blank"
					rel="noopener noreferrer"
					class="flex w-fit text-xl ml-auto transition-all opacity-60 hover:opacity-100 hover:scale-[1.05] active:scale-100"
				>
					<Instagram class="w-8 h-8" />
				</NuxtLink>
				<NuxtLink
					href="https://www.linkedin.com/in/victor-denay-844889256/"
					target="_blank"
					rel="noopener noreferrer"
					class="flex w-fit text-xl mr-auto transition-all opacity-60 hover:opacity-100 hover:scale-[1.05] active:scale-100"
				>
					<Linkedin class="w-8 h-8" />
				</NuxtLink>
				<X
					class="w-8 h-8 cursor-pointer transition-all hover:scale-[1.1] active:scale-[1]"
					@click="isMenuOpen = false"
				/>
			</div>
			<ul class="flex flex-col gap-6 mt-12 px-10 h-full">
				<li v-for="link in links" :key="link.to">
					<NuxtLink
						:to="link.to"
						@click="toggleMenu"
						class="flex gap-3 w-fit text-2xl transition-all opacity-60 hover:opacity-100 hover:scale-[1.05] active:scale-100"
						:class="{
							'!opacity-100 font-bold':
								$route.path === link.to ||
								($route.path.startsWith('/projects') &&
									link.to === '/projects'),
						}"
					>
						<component :is="link.icon" class="w-8 h-8" />
						{{ link.name }}
					</NuxtLink>
				</li>
			</ul>
		</aside>
	</div>
	<header
		class="relative h-16 flex items-center justify-between px-4 md:hidden"
	>
		<NuxtLink to="/" class="w-fit h-fit transition-all active:scale-95">
			<h1 class="flex text-2xl">
				Victor<span class="ml-[5px] mt-[2px] font-bold font-second tracking-widest"
					>Denay</span
				>
			</h1>
		</NuxtLink>
		<button @click="toggleMenu" class="z-40 transition-all active:scale-[0.95]">
			<Menu class="w-8 h-8" />
		</button>
	</header>
</template>

<script lang="ts" setup>
	import { Menu, Instagram, Linkedin, X } from 'lucide-vue-next';
	import { ref, watch } from 'vue';
	import gsap from 'gsap';
	import type { PropType } from 'vue';
	import type { Link } from '~/layouts/default.vue';

	defineProps({
		links: {
			type: Array as PropType<Link[]>,
			required: true,
		},
	});

	const isMenuOpen = ref(false);
	const menu = ref<HTMLElement | null>(null);

	const toggleMenu = () => {
		isMenuOpen.value = !isMenuOpen.value;
	};

	watch(isMenuOpen, (newVal) => {
		if (newVal) {
			// Menu is opening
			gsap.fromTo(
				menu.value,
				{ x: '100%' },
				{ x: '0%', duration: 0.5, ease: 'power2.out' },
			);
		} else if (menu.value) {
			// Menu is closing
			gsap.to(menu.value, { x: '100%', duration: 0.5, ease: 'power2.in' });
		}
	});
</script>
