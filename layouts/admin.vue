<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <header class="sticky top-0 z-50 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <NuxtLink to="/admin" class="text-xl font-bold font-second tracking-widest">
              Admin
            </NuxtLink>
            <nav class="hidden md:flex gap-4">
              <NuxtLink
                to="/admin/projects"
                class="px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-100 dark:bg-neutral-700': $route.path.includes('/admin/projects') }"
              >
                Projets
              </NuxtLink>
              <NuxtLink
                to="/admin/categories"
                class="px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-100 dark:bg-neutral-700': $route.path.includes('/admin/categories') }"
              >
                Catégories
              </NuxtLink>
              <NuxtLink
                to="/admin/roles"
                class="px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-100 dark:bg-neutral-700': $route.path.includes('/admin/roles') }"
              >
                Rôles
              </NuxtLink>
              <NuxtLink
                to="/admin/social-links"
                class="px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-100 dark:bg-neutral-700': $route.path.includes('/admin/social-links') }"
              >
                Liens sociaux
              </NuxtLink>
              <NuxtLink
                to="/admin/photos"
                class="px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-100 dark:bg-neutral-700': $route.path.includes('/admin/photos') }"
              >
                Photos
              </NuxtLink>
              <NuxtLink
                to="/admin/files"
                class="px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                :class="{ 'bg-neutral-100 dark:bg-neutral-700': $route.path.includes('/admin/files') }"
              >
                Fichiers
              </NuxtLink>
            </nav>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink to="/">
              <UButton variant="ghost" size="sm">
                Voir le site
              </UButton>
            </NuxtLink>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
    <main class="py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
