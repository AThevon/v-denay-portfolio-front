import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (!body.url) {
    throw createError({
      statusCode: 400,
      message: 'URL manquante',
    })
  }

  // Extraire la clé S3 depuis l'URL
  // URL format: https://bucket.s3.region.amazonaws.com/folder/file.jpg
  const bucketUrl = `https://${config.AWS_S3_BUCKET}.s3.${config.AWS_REGION}.amazonaws.com/`

  if (!body.url.startsWith(bucketUrl)) {
    // L'URL ne correspond pas à notre bucket, ignorer silencieusement
    return { success: true, skipped: true }
  }

  const key = body.url.replace(bucketUrl, '')

  // Configurer le client S3
  const s3Client = new S3Client({
    region: config.AWS_REGION,
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
  })

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: config.AWS_S3_BUCKET,
        Key: decodeURIComponent(key),
      })
    )

    return { success: true }
  } catch (error: any) {
    console.error('Erreur suppression S3:', error)
    // Ne pas bloquer si la suppression S3 échoue
    return { success: false, error: error.message }
  }
})
