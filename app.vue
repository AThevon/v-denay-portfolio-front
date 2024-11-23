<template>
	<NuxtRouteAnnouncer />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<UNotifications />
</template>

<script setup></script>

<style>
	body {
		overflow-y: scroll;
		overflow-x: hidden;
	}
	.slide-fade-x-enter-active,
	.slide-fade-x-leave-active,
	.slide-fade-y-enter-active,
	.slide-fade-y-leave-active,
	.slide-fade-y-reverse-enter-active,
	.slide-fade-y-reverse-leave-active {
		transition: transform 0.4s ease, opacity 0.4s ease;
	}

	.slide-fade-x-enter-from {
		transform: translateX(100%);
		opacity: 0;
	}

	.slide-fade-x-leave-to {
		transform: translateX(100%);
		opacity: 0;
	}

	.slide-fade-y-enter-from {
		transform: translateY(100%);
		opacity: 0;
	}

	.slide-fade-y-leave-to {
		transform: translateY(-100%);
		opacity: 0;
	}

	.slide-fade-y-reverse-enter-from {
		transform: translateY(-100%);
		opacity: 0;
	}

	.slide-fade-y-reverse-leave-to {
		transform: translateY(100%);
		opacity: 0;
	}
</style>
