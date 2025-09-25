import type { Database } from '~~/database/types'
import { usePreferencesStore } from '@/stores/preferences'

export default defineNuxtPlugin(async () => {
  if (import.meta.client) {
    return
  }

  const authStore = useAuthStore()
  const preferencesStore = usePreferencesStore()
  const supabaseUser = useSupabaseUser()

  if (!supabaseUser.value) {
    return
  }

  authStore.setUser(supabaseUser.value)

  if (!authStore.profile) {
    const supabase = useSupabaseClient<Database>()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.value.id)
      .single()

    if (data) {
      authStore.setProfile(data)
      if (data.mode) {
        preferencesStore.initializeTheme(data.mode as 'light' | 'dark')
      }
    }
  } else if (authStore.profile?.mode) {
    preferencesStore.initializeTheme(authStore.profile.mode as 'light' | 'dark')
  }
})
