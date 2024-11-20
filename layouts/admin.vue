<!-- layouts/admin.vue -->
<template>
	<div>
		<header
			class="sticky top-0 z-10 flex items-center justify-between w-full h-14 px-4 bg-white text-center text-xl uppercase font-bold font-second tracking-widest shadow-md"
		>
			Portail Admin
		</header>
		<main class="h-full">
			<slot />
		</main>
	</div>
</template>

<script lang="ts"></script>
