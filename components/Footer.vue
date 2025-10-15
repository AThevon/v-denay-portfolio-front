<template>
	<footer
		class="md:ml-[12rem] py-6 px-6 text-sm text-neutral-600 dark:text-neutral-400"
	>
		<div class="flex flex-col md:flex-row justify-between items-center gap-4">
			<p class="text-center md:text-left">
				© {{ new Date().getFullYear() }} Victor Denay - Tous droits réservés
			</p>
			<div class="flex flex-wrap justify-center gap-4">
				<NuxtLink
					to="/legal/mentions-legales"
					class="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
				>
					Mentions légales
				</NuxtLink>
				<button
					@click="$emit('open-cookie-consent')"
					class="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
				>
					Gérer mes cookies
				</button>
			</div>
		</div>
	</footer>
</template>

<script setup>
	defineEmits(['open-cookie-consent']);
</script>
