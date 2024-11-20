import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
	const { folder } = getQuery(event);

	if (!folder) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Le paramètre "folder" est requis.',
		});
	}

	const s3 = new S3Client({
		region: process.env.AWS_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		},
	});

	try {
		const command = new ListObjectsV2Command({
			Bucket: process.env.AWS_S3_BUCKET,
			Prefix: `${folder}/`,
			MaxKeys: 40,
		});

		const response = await s3.send(command);

		if (!response.Contents || response.Contents.length === 0) {
			return [];
		}

		const images = response.Contents.filter((item) => item.Size > 0).map(
			(item) => ({
				src: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
				lowResSrc: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}?w=400&quality=60`,
				alt: item.Key.split('/').pop(),
			}),
		);

		return images;
	} catch (error) {
		console.error(
			'Erreur lors de la récupération des images depuis S3 :',
			error,
		);
		throw createError({
			statusCode: 500,
			statusMessage: `Erreur lors de la récupération des images depuis S3 : ${error.message}`,
		});
	}
});
