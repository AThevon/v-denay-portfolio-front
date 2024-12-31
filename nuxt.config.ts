// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	modules: [
		'nuxt-swiper',
		'@nuxt/fonts',
		'@nuxt/image',
		'nuxt-nodemailer',
		'@nuxt/ui',
		'@tresjs/nuxt',
	],
	runtimeConfig: {
		AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
		AWS_REGION: process.env.AWS_REGION,
		AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
		public: {
			API_URL: process.env.API_URL  || 'https://api.victordenay.com',
			AWS_BUCKET_URL: process.env.AWS_BUCKET_URL,
			AWS_REGION: process.env.AWS_REGION,
		},
	},
	colorMode: {
		preference: 'light',
	},
	// Load Google Fonts from external source
	fonts: {
		google: {
			families: ['Montserrat', 'New Amsterdam'],
		},
	},
	// NodeMailer configuration
	nodemailer: {
		host: process.env.SMTP_HOST, // par exemple smtp.google.com
		port: process.env.SMTP_PORT, // par exemple 587
		secure: false, // true pour 465, false pour d'autres ports
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
		from: '"Nom" <email@example.com>',
	},
	app: {
		head: {
			title: 'Victor Denay - Monteur & Photographe',
			meta: [
				{
					name: 'description',
					content:
						'Portfolio de Victor Denay, monteur et photographe. Découvrez ses projets vidéo et photo.',
				},
				{
					name: 'keywords',
					content:
						'Victor Denay, photographe, monteur vidéo, portfolio, photographie, réalisateur, montage vidéo, Tours',
				},
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{
					property: 'og:title',
					content: 'Victor Denay - Monteur & Photographe',
				},
				{
					property: 'og:description',
					content:
						'Explorez le portfolio de Victor Denay, spécialisé en photographie et montage vidéo.',
				},
				{ property: 'og:image', content: '/og-image.png' },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:url', content: 'https://victordenay.com' },
				{ name: 'twitter:card', content: 'summary_large_image' },
				{
					name: 'twitter:title',
					content: 'Victor Denay - Monteur & Photographe',
				},
				{
					name: 'twitter:description',
					content:
						'Portfolio de Victor Denay, découvrez ses projets de photo et vidéo.',
				},
				{ name: 'twitter:image', content: '/og-image.png' },
			],
		},
		pageTransition: {
			name: 'slide-fade-y',
			mode: 'out-in',
		},
	},
});
