import type { UserRole } from '@/types/UserRole'

// noinspection JSUnusedGlobalSymbols
export default defineNuxtRouteMiddleware(async (to, _from) => {
  const user = useSupabaseUser()
  const authStore = useAuthStore()

  const unprotectedRoutes = ['/', '/403']

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

  const requiredRoles = to.meta.roles as UserRole | UserRole[] | undefined

  if (user.value && requiredRoles && !authStore.hasRole(requiredRoles)) {
    return navigateTo('/403')
  }
})
