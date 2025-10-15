<template>
	<Transition name="slide-up">
		<div
			v-if="showBanner"
			class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t-2 border-neutral-300 dark:border-neutral-700 shadow-2xl"
		>
			<div class="container mx-auto px-6 py-6">
				<div class="flex flex-col justify-between md:flex-row items-start md:items-center gap-4">
					<div class="flex-grow">
						<h3 class="text-lg font-bold mb-2">
							🍪 Nous utilisons des cookies
						</h3>
						<p class="text-sm text-neutral-700 dark:text-neutral-300">
							Ce site utilise des cookies pour améliorer votre expérience et analyser
							notre audience. Nous intégrons également des vidéos YouTube qui peuvent
							déposer leurs propres cookies.
							<NuxtLink
								to="/legal/politique-confidentialite"
								class="text-blue-600 dark:text-blue-400 hover:underline"
							>
								En savoir plus
							</NuxtLink>
						</p>
					</div>
					<div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
						<button
							@click="acceptAll"
							class="px-6 py-3 bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-all active:scale-95 whitespace-nowrap"
						>
							Tout accepter
						</button>
						<button
							@click="acceptNecessary"
							class="px-6 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-lg font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all active:scale-95 whitespace-nowrap"
						>
							Nécessaires uniquement
						</button>
						<button
							@click="showSettings = !showSettings"
							class="px-6 py-3 border-2 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-lg font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all active:scale-95 whitespace-nowrap"
						>
							Personnaliser
						</button>
					</div>
				</div>

				<!-- Paramètres détaillés -->
				<Transition name="expand">
					<div
						v-if="showSettings"
						class="mt-6 pt-6 border-t border-neutral-300 dark:border-neutral-700"
					>
						<div class="space-y-4">
							<!-- Cookies nécessaires -->
							<div class="flex items-start gap-4">
								<input
									type="checkbox"
									id="necessary"
									checked
									disabled
									class="mt-1 w-5 h-5"
								/>
								<div class="flex-grow">
									<label for="necessary" class="font-semibold block mb-1">
										Cookies nécessaires (obligatoires)
									</label>
									<p class="text-sm text-neutral-600 dark:text-neutral-400">
										Ces cookies sont essentiels au fonctionnement du site (thème,
										préférences de cookies).
									</p>
								</div>
							</div>

							<!-- Cookies analytiques -->
							<div class="flex items-start gap-4">
								<input
									type="checkbox"
									id="analytics"
									v-model="preferences.analytics"
									class="mt-1 w-5 h-5"
								/>
								<div class="flex-grow">
									<label for="analytics" class="font-semibold block mb-1">
										Cookies analytiques (Google Analytics)
									</label>
									<p class="text-sm text-neutral-600 dark:text-neutral-400">
										Ces cookies nous aident à comprendre comment vous utilisez le site
										pour l'améliorer.
									</p>
								</div>
							</div>

							<!-- Cookies YouTube -->
							<div class="flex items-start gap-4">
								<input
									type="checkbox"
									id="youtube"
									v-model="preferences.youtube"
									class="mt-1 w-5 h-5"
								/>
								<div class="flex-grow">
									<label for="youtube" class="font-semibold block mb-1">
										Cookies YouTube
									</label>
									<p class="text-sm text-neutral-600 dark:text-neutral-400">
										Ces cookies permettent la lecture des vidéos YouTube intégrées.
										YouTube peut déposer des cookies de ciblage publicitaire.
									</p>
								</div>
							</div>
						</div>

						<div class="mt-6 flex gap-3">
							<button
								@click="savePreferences"
								class="px-6 py-3 bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-all active:scale-95"
							>
								Enregistrer mes préférences
							</button>
							<button
								@click="showSettings = false"
								class="px-6 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all"
							>
								Annuler
							</button>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</template>

<script setup>
	const showBanner = ref(false);
	const showSettings = ref(false);
	const preferences = ref({
		analytics: false,
		youtube: false,
	});

	// Vérifier si l'utilisateur a déjà fait un choix
	onMounted(() => {
		const consent = localStorage.getItem('cookie-consent');
		if (!consent) {
			showBanner.value = true;
		} else {
			// Charger les préférences existantes
			const savedPreferences = JSON.parse(consent);
			preferences.value = savedPreferences;
			applyPreferences(savedPreferences);
		}
	});

	// Accepter tous les cookies
	const acceptAll = () => {
		const prefs = { analytics: true, youtube: true };
		saveConsent(prefs);
		applyPreferences(prefs);
		showBanner.value = false;
	};

	// Accepter uniquement les cookies nécessaires
	const acceptNecessary = () => {
		const prefs = { analytics: false, youtube: false };
		saveConsent(prefs);
		applyPreferences(prefs);
		showBanner.value = false;
	};

	// Enregistrer les préférences personnalisées
	const savePreferences = () => {
		saveConsent(preferences.value);
		applyPreferences(preferences.value);
		showBanner.value = false;
	};

	// Sauvegarder dans localStorage
	const saveConsent = (prefs) => {
		localStorage.setItem('cookie-consent', JSON.stringify(prefs));
		localStorage.setItem('cookie-consent-date', new Date().toISOString());
	};

	// Appliquer les préférences (activer/désactiver Google Analytics, etc.)
	const applyPreferences = (prefs) => {
		// Google Analytics
		if (prefs.analytics && typeof window !== 'undefined' && window.gtag) {
			window.gtag('consent', 'update', {
				analytics_storage: 'granted',
			});
		}

		// Note: Pour YouTube, les iframes sont toujours chargées mais l'utilisateur
		// est informé. Pour une solution plus avancée, il faudrait utiliser
		// youtube-nocookie.com et demander confirmation avant le clic.
	};

	// Exposer une fonction pour rouvrir le banner (depuis le footer par exemple)
	const reopenBanner = () => {
		showBanner.value = true;
	};

	// Exposer la fonction pour permettre de la déclencher depuis l'extérieur
	defineExpose({ reopenBanner });
</script>

<style scoped>
	/* Animation slide-up */
	.slide-up-enter-active,
	.slide-up-leave-active {
		transition: transform 0.3s ease-out;
	}

	.slide-up-enter-from,
	.slide-up-leave-to {
		transform: translateY(100%);
	}

	/* Animation expand */
	.expand-enter-active,
	.expand-leave-active {
		transition:
			max-height 0.3s ease,
			opacity 0.3s ease;
		overflow: hidden;
	}

	.expand-enter-from,
	.expand-leave-to {
		max-height: 0;
		opacity: 0;
	}

	.expand-enter-to,
	.expand-leave-from {
		max-height: 500px;
		opacity: 1;
	}
</style>
