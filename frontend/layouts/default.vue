<template>
	<div class="font-main h-screen">
		<BurgerMenu :links="links" />
		<aside class="h-full fixed w-[12rem] px-10 flex-col hidden md:flex">
			
      <NuxtLink to="/" class="w-fit h-fit my-10 transition-all active:scale-95">
				<h1 class="flex flex-col text-3xl">
					Victor<span class="ml-8 font-bold font-second tracking-widest"
						>Denay</span
					>
				</h1>
			</NuxtLink>
			<ul class="flex flex-col flex-grow gap-4">
				<li v-for="link in links" :key="link.to">
					<NuxtLink
						:to="link.to"
						class="flex gap-2 w-fit text-xl transition-all opacity-60 hover:opacity-100 hover:scale-[1.05] active:scale-100"
						:class="{
							'!opacity-100 font-bold':
								$route.path === link.to ||
								($route.path.startsWith('/projects') &&
									link.to === '/projects'),
						}"
					>
						<component :is="link.icon" class="w-6 h-6" />
						{{ link.name }}
					</NuxtLink>
				</li>
				<li class="mt-auto mx-auto mb-8 flex gap-3">
					<NuxtLink
						href="https://www.instagram.com/nitro_vision"
						target="_blank"
						rel="noopener noreferrer"
						class="flex gap-3 w-fit text-xl transition-all opacity-60 hover:opacity-100 hover:scale-[1.05] active:scale-100"
					>
						<Instagram class="w-8 h-8" />
					</NuxtLink>
					<NuxtLink
						href="https://www.linkedin.com/in/victor-denay-844889256/"
						target="_blank"
						rel="noopener noreferrer"
						class="flex gap-3 w-fit text-xl transition-all opacity-60 hover:opacity-100 hover:scale-[1.05] active:scale-100"
					>
						<Linkedin class="w-8 h-8" />
					</NuxtLink>
          <ThemeToggle />
				</li>
			</ul>
		</aside>
		<main class="h-full md:pl-[12rem]">
			<slot />
		</main>
	</div>
</template>

<script lang="ts" setup>
	import {
		Camera,
		Clapperboard,
		Home,
		Send,
		Instagram,
		Linkedin,
	} from 'lucide-vue-next';

	export type Link = {
		name: string;
		to: string;
		icon: any;
	};

	const links: Link[] = [
		{ name: 'Accueil', to: '/', icon: Home },
		{ name: 'Vidéo', to: '/projects', icon: Clapperboard },
		{ name: 'Photo', to: '/photos', icon: Camera },
		{ name: 'Contact', to: '/contact', icon: Send },
	];
</script>
