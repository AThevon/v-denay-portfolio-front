<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Dashboard Admin</h1>
      <div class="flex gap-4">
        <NuxtLink to="/">
          <UButton variant="ghost" icon="i-heroicons-home">
            Voir le site
          </UButton>
        </NuxtLink>
        <UButton @click="handleLogout" color="red" variant="soft">
          Déconnexion
        </UButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <UCard>
        <div class="text-center">
          <div class="text-3xl font-bold text-primary">{{ stats.projects }}</div>
          <div class="text-sm text-neutral-500">Projets</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-500">{{ stats.categories }}</div>
          <div class="text-sm text-neutral-500">Catégories</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-500">{{ stats.roles }}</div>
          <div class="text-sm text-neutral-500">Rôles</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-500">{{ stats.socialLinks }}</div>
          <div class="text-sm text-neutral-500">Liens sociaux</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-3xl font-bold text-amber-500">{{ stats.photoCollections }}</div>
          <div class="text-sm text-neutral-500">Collections</div>
        </div>
      </UCard>
      <UCard>
        <div class="text-center">
          <div class="text-3xl font-bold text-pink-500">{{ stats.photos }}</div>
          <div class="text-sm text-neutral-500">Photos</div>
        </div>
      </UCard>
    </div>

    <!-- Navigation rapide -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink to="/admin/projects">
        <UCard class="hover:ring-2 hover:ring-primary transition-all cursor-pointer h-full">
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-film" class="w-8 h-8 text-primary" />
            <div>
              <div class="font-semibold">Projets</div>
              <div class="text-sm text-neutral-500">Gérer les projets vidéo</div>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/admin/categories">
        <UCard class="hover:ring-2 hover:ring-green-500 transition-all cursor-pointer h-full">
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-folder" class="w-8 h-8 text-green-500" />
            <div>
              <div class="font-semibold">Catégories</div>
              <div class="text-sm text-neutral-500">Gérer les catégories</div>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/admin/roles">
        <UCard class="hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer h-full">
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-user-group" class="w-8 h-8 text-blue-500" />
            <div>
              <div class="font-semibold">Rôles</div>
              <div class="text-sm text-neutral-500">Gérer les rôles</div>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/admin/social-links">
        <UCard class="hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer h-full">
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-link" class="w-8 h-8 text-purple-500" />
            <div>
              <div class="font-semibold">Liens sociaux</div>
              <div class="text-sm text-neutral-500">Gérer les réseaux</div>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/admin/photos">
        <UCard class="hover:ring-2 hover:ring-amber-500 transition-all cursor-pointer h-full">
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-photo" class="w-8 h-8 text-amber-500" />
            <div>
              <div class="font-semibold">Photos</div>
              <div class="text-sm text-neutral-500">Gérer les collections photos</div>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/admin/files">
        <UCard class="hover:ring-2 hover:ring-pink-500 transition-all cursor-pointer h-full">
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-document-arrow-up" class="w-8 h-8 text-pink-500" />
            <div>
              <div class="font-semibold">Fichiers</div>
              <div class="text-sm text-neutral-500">Gérer le CV et documents</div>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
  pageTransition: false,
})

const router = useRouter()
const supabase = useSupabase()

const stats = ref({
  projects: 0,
  categories: 0,
  roles: 0,
  socialLinks: 0,
  photoCollections: 0,
  photos: 0,
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  await router.push('/login')
}

// Charger les stats
onMounted(async () => {
  const [projectsRes, categoriesRes, rolesRes, socialLinksRes, photoCollectionsRes, photosRes] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('roles').select('id', { count: 'exact', head: true }),
    supabase.from('social_links').select('id', { count: 'exact', head: true }),
    supabase.from('photo_collections').select('id', { count: 'exact', head: true }),
    supabase.from('photos').select('id', { count: 'exact', head: true }),
  ])

  stats.value = {
    projects: projectsRes.count || 0,
    categories: categoriesRes.count || 0,
    roles: rolesRes.count || 0,
    socialLinks: socialLinksRes.count || 0,
    photoCollections: photoCollectionsRes.count || 0,
    photos: photosRes.count || 0,
  }
})
</script>
