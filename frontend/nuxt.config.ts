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
	],
	runtimeConfig: {
		AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
		AWS_REGION: process.env.AWS_REGION,
		AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
		public: {
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
		pageTransition: {
			name: 'slide-fade-y',
			mode: 'out-in',
		},
	},
});
