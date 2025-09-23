import { useAuthStore } from '@/stores/auth'
import type { Database } from '~~/database/types'

export const useProfile = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const authStore = useAuthStore()

  const fetchCurrentUserProfile = async () => {
    if (!user.value) {
      return { data: null, error: new Error('User not authenticated') }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return { data: null, error }
      }

      // Salvar na store
      authStore.setProfile(data)

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error }
    }
  }

  const updateProfile = async (updates: Database['public']['Tables']['profiles']['Update']) => {
    if (!user.value) {
      return { data: null, error: new Error('User not authenticated') }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return { data: null, error }
      }

      // Atualizar na store
      authStore.updateProfile(data)

      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  return {
    fetchCurrentUserProfile,
    updateProfile,
  }
}
