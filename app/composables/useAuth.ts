import type { LoginForm, RegisterForm } from '@/types/AuthForm'
import { AuthService } from '@/services/auth.service'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const authService = new AuthService(supabase)
  const loading = ref(false)

  const register = async (formData: RegisterForm) => {
    loading.value = true
    try {
      const data = await authService.register(formData)
      return { data, error: null }
    } catch (error) {
      console.log(error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const login = async (formData: LoginForm) => {
    loading.value = true
    try {
      const data = await authService.login(formData)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await authService.logout()
      return { success: true, error: null }
    } catch (error) {
      console.log(error)
      return { success: false, error }
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

  return {
    loading: readonly(loading),
    register,
    login,
    logout,
    getProfile,
    getProfiles,
    getGroupedProfiles,
  }
}
