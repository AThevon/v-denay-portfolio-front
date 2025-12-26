# Guide de Migration : Laravel + Nuxt → Nuxt Fullstack + Supabase

## Contexte

Ce guide documente la migration d'une architecture Laravel (backend) + Nuxt (frontend) vers une application Nuxt fullstack utilisant Supabase comme backend. Cette approche a été testée avec succès sur le projet Under The Flow (Laravel + Next.js → Next.js + Supabase).

---

## 1. Architecture Cible

```
Avant:
├── Backend Laravel
│   ├── API REST
│   ├── Base de données MySQL/PostgreSQL
│   ├── Authentification (Laravel Sanctum/Passport)
│   └── Storage (S3 via Laravel Filesystem)
└── Frontend Nuxt
    └── Appels API vers Laravel

Après:
└── Nuxt Fullstack
    ├── Pages & Composants (SSR)
    ├── API Routes (/server/api/)
    ├── Supabase (Auth + DB PostgreSQL)
    └── S3 Direct (stockage fichiers)
```

---

## 2. Configuration Supabase

### 2.1 Création du projet Supabase

1. Créer un projet sur https://supabase.com
2. Récupérer les credentials dans Project Settings > API :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### 2.2 Client Supabase (deux clients)

**Client côté serveur** (`server/utils/supabase.ts`) :

```typescript
import { createServerClient } from '@supabase/ssr'
import { H3Event, getCookie, setCookie } from 'h3'

export function createClient(event: H3Event) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(event.node.req.headers.cookie || {})
            .map(([name, value]) => ({ name, value: String(value) }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(event, name, value, options)
          })
        },
      },
    }
  )
}
```

**Client côté client** (`composables/useSupabase.ts`) :

```typescript
import { createBrowserClient } from '@supabase/ssr'

export const useSupabase = () => {
  const config = useRuntimeConfig()

  return createBrowserClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )
}
```

### 2.3 Variables d'environnement

```env
# .env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...

# Pour Nuxt config
NUXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
```

---

## 3. Migration de la Base de Données

### 3.1 Export depuis Laravel

Exporter le schéma de ta base Laravel :

```bash
php artisan schema:dump
# ou
mysqldump -u user -p --no-data database_name > schema.sql
```

### 3.2 Adaptation pour Supabase (PostgreSQL)

Différences clés MySQL → PostgreSQL :

- `AUTO_INCREMENT` → `SERIAL` ou `GENERATED ALWAYS AS IDENTITY`
- `DATETIME` → `TIMESTAMP WITH TIME ZONE`
- `TINYINT(1)` → `BOOLEAN`
- Backticks `` ` `` → Guillemets `"` pour les identifiants

### 3.3 Création des tables dans Supabase

Via l'interface SQL de Supabase ou migration :

```sql
-- Exemple: table artists
CREATE TABLE artists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exemple: table images (polymorphique)
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  path VARCHAR(255) NOT NULL,
  alt VARCHAR(255),
  imageable_id INTEGER NOT NULL,
  imageable_type VARCHAR(50) NOT NULL, -- 'Artist', 'LiveSession', etc.
  is_profile BOOLEAN DEFAULT FALSE,
  is_thumbnail BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.4 Configuration des permissions (CRITIQUE)

**RLS (Row Level Security)** - Tu as deux options :

**Option A : Désactiver RLS (simple, moins sécurisé)**

```sql
ALTER TABLE artists DISABLE ROW LEVEL SECURITY;
ALTER TABLE images DISABLE ROW LEVEL SECURITY;
-- etc. pour chaque table
```

**Option B : Configurer les policies (recommandé)**

```sql
-- Permettre la lecture publique
CREATE POLICY "Public read access" ON artists
  FOR SELECT USING (true);

-- Permettre l'écriture aux utilisateurs authentifiés
CREATE POLICY "Authenticated write access" ON artists
  FOR ALL USING (auth.role() = 'authenticated');
```

**IMPORTANT** - Même avec RLS désactivé, il faut les GRANT :

```sql
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;

-- Pour les opérations d'écriture (admin)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

---

## 4. Migration des API Routes

### 4.1 Structure des dossiers Nuxt

```
server/
├── api/
│   ├── artists/
│   │   ├── index.get.ts      # GET /api/artists (liste)
│   │   ├── index.post.ts     # POST /api/artists (création)
│   │   └── [id]/
│   │       ├── index.get.ts  # GET /api/artists/:id
│   │       ├── index.patch.ts # PATCH /api/artists/:id
│   │       └── index.delete.ts # DELETE /api/artists/:id
│   └── admin/
│       └── ... (routes protégées)
└── utils/
    └── supabase.ts
```

### 4.2 Exemple de route API

**GET liste** (`server/api/artists/index.get.ts`) :

```typescript
export default defineEventHandler(async (event) => {
  const supabase = createClient(event)

  const { data: artists, error } = await supabase
    .from('artists')
    .select('id, name, slug, bio, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  return artists
})
```

**POST création** (`server/api/admin/artists/index.post.ts`) :

```typescript
import { z } from 'zod'

const artistSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  bio: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const supabase = createClient(event)

  // 1. Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // 2. Valider les données
  const body = await readBody(event)
  const validated = artistSchema.parse(body)

  // 3. Vérifier l'unicité du slug
  const { data: existing } = await supabase
    .from('artists')
    .select('id')
    .eq('slug', validated.slug)
    .single()

  if (existing) {
    throw createError({ statusCode: 400, message: 'Slug already exists' })
  }

  // 4. Créer l'artiste
  const { data: artist, error } = await supabase
    .from('artists')
    .insert(validated)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return artist
})
```

---

## 5. Migration de l'Authentification

### 5.1 Créer un utilisateur admin dans Supabase

Via l'interface Supabase > Authentication > Users > Add User

### 5.2 Page de login

```vue
<!-- pages/login.vue -->
<script setup lang="ts">
const supabase = useSupabase()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (authError) {
    error.value = authError.message
  } else {
    await router.push('/admin')
  }

  loading.value = false
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button type="submit" :disabled="loading">Connexion</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>
```

### 5.3 Middleware de protection

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && to.path.startsWith('/admin')) {
    return navigateTo('/login')
  }
})
```

---

## 6. Migration du Stockage S3

### 6.1 Configuration S3

```typescript
// server/utils/s3.ts
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})

export async function compressAndUploadImage(
  file: Buffer,
  folder: string,
  slug: string
): Promise<string> {
  // Compression avec Sharp (équivalent Intervention Image)
  let image = sharp(file)
  const metadata = await image.metadata()

  if (metadata.height && metadata.height > 1080) {
    image = image.resize({ height: 1080, withoutEnlargement: true })
  }

  const webpBuffer = await image.webp({ quality: 90 }).toBuffer()

  const filename = `${folder}/${slug}/${uuidv4()}.webp`

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: filename,
      Body: webpBuffer,
      ContentType: 'image/webp',
    })
  )

  return filename
}

export async function deleteFromS3(path: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: path,
    })
  )
}
```

---

## 7. Data Fetching (SSR)

### 7.1 Queries côté serveur

```typescript
// server/utils/queries.ts
export async function getAllArtists(event: H3Event) {
  const supabase = createClient(event)

  const { data, error } = await supabase
    .from('artists')
    .select(
      `
      id,
      name,
      slug,
      bio,
      images (path, is_profile)
    `
    )
    .order('created_at', { ascending: false })

  if (error) throw error

  // Transformer les données (ajouter URLs S3, etc.)
  return data.map((artist) => ({
    ...artist,
    profile_image: artist.images?.find((i) => i.is_profile)?.path
      ? `${process.env.S3_BUCKET_URL}/${artist.images.find((i) => i.is_profile)?.path}`
      : null,
  }))
}
```

### 7.2 Utilisation dans les pages

```vue
<!-- pages/artists/index.vue -->
<script setup lang="ts">
const { data: artists } = await useFetch('/api/artists')
</script>

<template>
  <div v-for="artist in artists" :key="artist.id">
    {{ artist.name }}
  </div>
</template>
```

---

## 8. Déploiement

### 8.1 Variables d'environnement Vercel/Netlify

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
NUXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
S3_REGION=eu-west-3
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=xxx
S3_BUCKET=mon-bucket
NUXT_PUBLIC_S3_BUCKET_URL=https://mon-bucket.s3.eu-west-3.amazonaws.com
```

### 8.2 Problèmes courants

**Erreur 500 "permission denied for schema public"**
→ Exécuter les GRANT SQL mentionnés section 3.4

**gitignore qui ignore les mauvais fichiers**
→ Utiliser `/supabase/` au lieu de `supabase/` pour ignorer seulement le dossier racine

---

## 9. Checklist de Migration

- [ ] Créer projet Supabase
- [ ] Migrer le schéma de base de données
- [ ] Configurer les permissions (RLS + GRANT)
- [ ] Créer les clients Supabase (server + client)
- [ ] Migrer les routes API Laravel → Nuxt server/api
- [ ] Créer l'utilisateur admin dans Supabase
- [ ] Implémenter l'authentification
- [ ] Configurer S3 direct (si utilisé)
- [ ] Migrer les données existantes
- [ ] Tester en local
- [ ] Configurer les variables d'env sur le provider de déploiement
- [ ] Déployer et tester en production

---

## 10. Différences clés Next.js vs Nuxt

| Aspect            | Next.js                        | Nuxt                             |
| ----------------- | ------------------------------ | -------------------------------- |
| API Routes        | `app/api/route.ts`             | `server/api/route.ts`            |
| Server Components | `async function Component()`   | `<script setup>` avec `useFetch` |
| Client Components | `'use client'` directive       | Composables avec `useSupabase()` |
| Middleware        | `middleware.ts`                | `middleware/auth.ts`             |
| Layouts           | `app/(group)/layout.tsx`       | `layouts/` + `definePageMeta`    |
| Environment       | `process.env.NEXT_PUBLIC_*`    | `useRuntimeConfig().public.*`    |

---

Ce guide devrait te permettre de reproduire la migration. Les principes sont les mêmes que pour la migration Under The Flow (Next.js), seule la syntaxe Nuxt diffère légèrement.
