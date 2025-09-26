// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware(async (to, _from) => {
  const user = useSupabaseUser()
  const authStore = useAuthStore()

  const unprotectedRoutes = ['/']

  if (user.value && unprotectedRoutes.includes(to.path)) {
    return navigateTo('/home')
  }

  if (!user.value && !unprotectedRoutes.includes(to.path)) {
    return navigateTo('/')
  }

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
