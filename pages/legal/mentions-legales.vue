<template>
	<div class="container mx-auto px-6 py-12 max-w-4xl">
		<NuxtLink
			to="/"
			class="inline-flex items-center gap-2 mb-8 opacity-60 hover:opacity-100 transition-opacity"
		>
			<NuxtImg
				src="/images/arrow-back.svg"
				alt="Retour"
				class="w-6 h-6 dark:invert"
			/>
			Retour
		</NuxtLink>

		<h1 class="text-4xl font-bold font-second tracking-widest mb-8">
			Mentions Légales
		</h1>

		<div class="space-y-8 text-neutral-700 dark:text-neutral-300">
			<!-- Éditeur du site -->
			<section>
				<h2 class="text-2xl font-bold mb-4">Éditeur du site</h2>
				<p class="mb-2">
					<strong>Nom :</strong> Victor Denay - Auto-entrepreneur
				</p>
				<p class="mb-2">
					<strong>SIRET :</strong> 901 543 322 00019
				</p>
				<p class="mb-2">
					<strong>Siège social :</strong> 48 rue Georget, 37000 Tours
				</p>
				<p class="mb-2">
					<strong>Contact :</strong>
					<NuxtLink
						to="/contact"
						class="text-blue-600 dark:text-blue-400 hover:underline"
					>
						Formulaire de contact
					</NuxtLink>
				</p>
				<p class="mb-2">
					<strong>Directeur de publication :</strong> Victor Denay
				</p>
			</section>

			<!-- Hébergement -->
			<section>
				<h2 class="text-2xl font-bold mb-4">Hébergement</h2>
				<p class="mb-2">
					<strong>Hébergeur :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
				</p>
			</section>

			<!-- Propriété intellectuelle -->
			<section>
				<h2 class="text-2xl font-bold mb-4">Propriété intellectuelle</h2>
				<p>
					L'ensemble des contenus (photographies, vidéos, textes) présents sur ce site sont la propriété de Victor Denay.
					Toute reproduction, même partielle, est interdite sans autorisation préalable.
				</p>
			</section>

			<!-- Données personnelles & Cookies -->
			<section>
				<h2 class="text-2xl font-bold mb-4">Données personnelles & Cookies</h2>

				<h3 class="text-lg font-semibold mb-2 mt-4">Collecte de données</h3>
				<p class="mb-4">
					Via le formulaire de contact, nous collectons votre nom, email et message uniquement pour traiter votre demande.
					Ces données sont conservées 3 ans puis supprimées.
				</p>

				<h3 class="text-lg font-semibold mb-2 mt-4">Cookies utilisés</h3>
				<ul class="list-disc pl-8 space-y-2 mb-4">
					<li>
						<strong>Cookies nécessaires :</strong> Mémorisation de vos préférences (thème, consentement cookies)
					</li>
					<li>
						<strong>Google Analytics :</strong> Mesure d'audience anonymisée (avec votre consentement)
					</li>
					<li>
						<strong>YouTube :</strong> Lecture des vidéos intégrées (avec votre consentement)
					</li>
				</ul>
				<p class="mb-4">
					Vous pouvez gérer vos préférences cookies à tout moment via le bouton "Gérer mes cookies" en bas de page.
				</p>

				<h3 class="text-lg font-semibold mb-2 mt-4">Vos droits (RGPD)</h3>
				<p class="mb-2">
					Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition sur vos données personnelles.
				</p>
				<p class="mb-4">
					Pour exercer ces droits, contactez-nous via le
					<NuxtLink
						to="/contact"
						class="text-blue-600 dark:text-blue-400 hover:underline"
					>
						formulaire de contact
					</NuxtLink>.
				</p>
				<p class="text-sm">
					Vous pouvez également déposer une réclamation auprès de la
					<a
						href="https://www.cnil.fr"
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-600 dark:text-blue-400 hover:underline"
					>
						CNIL
					</a>.
				</p>
			</section>
		</div>
	</div>
</template>

<script setup>
	useHead({
		title: 'Mentions Légales - Victor Denay',
		meta: [
			{
				name: 'description',
				content:
					'Mentions légales et politique de confidentialité du portfolio de Victor Denay.',
			},
		],
	});
</script>
