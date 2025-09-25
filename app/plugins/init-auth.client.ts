export default defineNuxtPlugin(() => {
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()

  // Inicializa a reação ao estado de autenticação do Supabase somente uma vez
  void authStore.initializeFromSupabase()
})
