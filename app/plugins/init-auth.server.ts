import type { Database } from '~~/database/types'

export default defineNuxtPlugin(async () => {
  if (import.meta.client) {
    return
  }

  const authStore = useAuthStore()
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
    }
  }
})
