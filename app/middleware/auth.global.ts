// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware(async (to, _from) => {
  const user = useSupabaseUser()
  const authStore = useAuthStore()

  const unprotectedRoutes = ['/', '/login']

  // Se usuário autenticado tenta acessar rota desprotegida, redireciona para home
  if (user.value && unprotectedRoutes.includes(to.path)) {
    return navigateTo('/home')
  }

  // Se usuário não autenticado tenta acessar página protegida
  if (!user.value && !unprotectedRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  // Carrega perfil se usuário está autenticado mas não tem perfil carregado
  if (user.value && !authStore.profile && !unprotectedRoutes.includes(to.path)) {
    try {
      authStore.setLoading(true)
      const { fetchCurrentUserProfile } = useProfile()
      await fetchCurrentUserProfile()
    } catch (error) {
      console.error('Error fetching profile in middleware:', error)
    } finally {
      authStore.setLoading(false)
    }
  }
})
