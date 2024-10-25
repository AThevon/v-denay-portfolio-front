import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export default defineEventHandler(async (event) => {
	const { folder } = event.context.params;

	// Configuration du client S3 avec les variables d'environnement
	const s3 = new S3Client({
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		},
	});

	try {
		// console.log(`Fetching images from folder: ${folder}`);

		const command = new ListObjectsV2Command({
			Bucket: process.env.AWS_S3_BUCKET,
			Prefix: `${folder}/`,
			MaxKeys: 40,
		});

		const response = await s3.send(command);

		// console.log('S3 response:', response);

		// Vérifier si `Contents` existe avant de continuer
		if (!response.Contents || response.Contents.length === 0) {
			console.log(`No images found in folder: ${folder}`);
			return [];
		}

		// Construire les URLs pour la version basse qualité et haute qualité
		const images = response.Contents.filter((item) => item.Size > 0) // Exclure les dossiers
			.map((item) => ({
				src: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`, // URL haute qualité
				lowResSrc: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}?w=400&quality=60`, // URL basse qualité
				alt: item.Key.split('/').pop(),
			}));

		// console.log('Images found:', images);
		return images;
	} catch (error) {
		console.error('Error fetching images from S3:', error);
		throw new Error(`Error fetching images from S3: ${error.message}`);
	}
});
