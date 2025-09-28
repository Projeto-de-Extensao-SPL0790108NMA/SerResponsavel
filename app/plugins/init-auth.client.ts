import { watch } from 'vue'
import { storeToRefs } from 'pinia'

export default defineNuxtPlugin(() => {
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const { user } = storeToRefs(authStore)

  // Inicializa a reação ao estado de autenticação do Supabase somente uma vez
  void authStore.initializeFromSupabase()

  watch(user, async (newUser) => {
    if (newUser && route.query.code) {
      await router.replace('/home')
    }
  })
})
