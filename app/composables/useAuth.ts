import type { LoginForm, RegisterForm } from '@/types/AuthForm'
import type { AuthError, Provider } from '@supabase/supabase-js'
import { AuthService } from '@/services/auth.service'
import { MeService } from '@/services/me.service'
import type { Database } from '~~/database/types'

export const useAuth = () => {
  const supabase = useSupabaseClient<Database>()
  const authService = new AuthService(supabase)
  const meService = new MeService(supabase)
  const loading = ref(false)

  const register = async (formData: RegisterForm) => {
    loading.value = true
    try {
      const data = await authService.register(formData)
      return { data, error: null }
    } catch (error) {
      console.error(error)
      return { data: null, error: error as AuthError }
    } finally {
      loading.value = false
    }
  }

  const login = async (formData: LoginForm) => {
    loading.value = true
    try {
      const data = await authService.login(formData)

      // Buscar perfil do usuário após login bem-sucedido
      if (data.user) {
        const authStore = useAuthStore()
        await authStore.login(data.user)

        // Buscar perfil
        try {
          const { fetchCurrentUserProfile } = useProfile()
          await fetchCurrentUserProfile()
        } catch (profileError) {
          console.warn('Could not fetch user profile:', profileError)
        }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as AuthError }
    } finally {
      loading.value = false
    }
  }

  const loginWithProvider = async (provider: Provider) => {
    loading.value = true
    try {
      const redirectTo = import.meta.client ? `${window.location.origin}/home` : undefined
      const data = await authService.loginWithProvider(provider, redirectTo)
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as AuthError }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await authService.logout()

      // Limpar store após logout bem-sucedido
      const authStore = useAuthStore()
      authStore.logout()

      return { success: true, error: null }
    } catch (error) {
      console.error(error)
      return { success: false, error: error as AuthError }
    } finally {
      loading.value = false
    }
  }

  const getProfile = async (params: { column: string; value: string }) => {
    try {
      const data = await authService.getProfile(params)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const getProfiles = async () => {
    try {
      const data = await authService.getProfiles()
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const getGroupedProfiles = async (userIds: string[]) => {
    try {
      const data = await authService.getGroupedProfiles(userIds)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const getCurrentUser = async () => {
    try {
      const data = await meService.getCurrentUser()
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    loading: readonly(loading),
    register,
    login,
    loginWithProvider,
    logout,
    getProfile,
    getProfiles,
    getGroupedProfiles,
    getCurrentUser,
  }
}
