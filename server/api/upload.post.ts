import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Lire le formulaire multipart
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Aucun fichier fourni',
    })
  }

  const file = formData.find(f => f.name === 'file')
  const folderField = formData.find(f => f.name === 'folder')

  if (!file || !file.data) {
    throw createError({
      statusCode: 400,
      message: 'Fichier manquant',
    })
  }

  // Vérifier le type de fichier
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  if (!file.type || !allowedTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      message: 'Type de fichier non autorisé. Utilisez JPG, PNG, WebP, GIF ou SVG.',
    })
  }

  // Déterminer le dossier de destination
  const folder = folderField?.data?.toString() || 'projects'

  // Générer un nom de fichier unique
  const extension = file.filename?.split('.').pop() || 'jpg'
  const filename = `${folder}/${randomUUID()}.${extension}`

  // Configurer le client S3
  const s3Client = new S3Client({
    region: config.AWS_REGION,
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
  })

  // Upload vers S3
  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.AWS_S3_BUCKET,
      Key: filename,
      Body: file.data,
      ContentType: file.type,
    })
  )

  // Retourner l'URL publique
  const url = `https://${config.AWS_S3_BUCKET}.s3.${config.AWS_REGION}.amazonaws.com/${filename}`

  return {
    url,
    filename,
  }
})
