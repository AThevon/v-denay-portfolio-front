<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
    <div class="w-full max-w-md p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
      <h1 class="text-2xl font-bold text-center mb-8">Connexion Admin</h1>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <UFormGroup label="Email">
          <UInput
            v-model="email"
            type="email"
            placeholder="admin@example.com"
            required
          />
        </UFormGroup>

        <UFormGroup label="Mot de passe">
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </UFormGroup>

        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          :title="error"
        />

        <UButton
          type="submit"
          :loading="loading"
          block
          size="lg"
        >
          Se connecter
        </UButton>
      </form>

      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
          ← Retour au site
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const router = useRouter()
const supabase = useSupabase()

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

// Vérifier si déjà connecté
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await router.push('/admin')
  }
})
</script>
