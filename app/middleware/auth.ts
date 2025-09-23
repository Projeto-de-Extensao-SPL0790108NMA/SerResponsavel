export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const user = useSupabaseUser()
  const authStore = useAuthStore()

  if (!user.value) {
    return navigateTo('/login')
  }

  // Se o usuário está logado mas não temos o perfil na store, buscar
  if (user.value && !authStore.profile) {
    try {
      authStore.setLoading(true)
      const { fetchCurrentUserProfile } = useProfile()
      await fetchCurrentUserProfile()
    } catch (error) {
      console.error('Error fetching profile in middleware:', error)
      // Não redirecionar em caso de erro, apenas logar
    } finally {
      authStore.setLoading(false)
    }
  }
})
