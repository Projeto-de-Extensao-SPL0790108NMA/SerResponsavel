import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { Database } from '~~/database/types'

// noinspection JSUnusedGlobalSymbols
export default defineNuxtPlugin(() => {
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const supabase = useSupabaseClient<Database>()
  const { user } = storeToRefs(authStore)
  const lastProcessedOAuthCode = ref<string | null>(null)

  // Inicializa a reação ao estado de autenticação do Supabase somente uma vez
  void authStore.initializeFromSupabase()

  const handleOAuthCallback = async (code: string) => {
    if (!code || lastProcessedOAuthCode.value === code) {
      return
    }

    lastProcessedOAuthCode.value = code

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Falha ao concluir login social:', error)
      }
    } catch (error) {
      console.error('Unexpected error ao concluir login social:', error)
    }
  }

  watch(
    () => route.query.code,
    (code) => {
      if (typeof code === 'string' && code.length) {
        void handleOAuthCallback(code)
        return
      }

      if (Array.isArray(code) && code.length) {
        const firstCode = code.find(
          (value): value is string => typeof value === 'string' && value.length > 0,
        )
        if (firstCode) {
          void handleOAuthCallback(firstCode)
        }
      }
    },
    { immediate: true },
  )

  watch(user, async (newUser) => {
    const code = route.query.code

    if (newUser && typeof code === 'string' && code.length) {
      await router.replace('/home')
    }
  })
})
