import type { User } from '@supabase/supabase-js'
import type { WatchStopHandle } from 'vue'
import type { Database } from '~~/database/types'

type Profile = Database['public']['Tables']['profiles']['Row']

export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const user = ref<User | null>(null)
    const profile = ref<Profile | null>(null)
    const isLoading = ref(false)
    const isAuthenticated = computed(() => !!user.value)

    // Actions
    const setUser = (userData: User | null) => {
      user.value = userData
    }

    const setProfile = (profileData: Profile | null) => {
      profile.value = profileData
    }

    const updateProfile = (updates: Partial<Profile>) => {
      if (profile.value) {
        profile.value = { ...profile.value, ...updates }
      }
    }

    const setLoading = (loading: boolean) => {
      isLoading.value = loading
    }

    const login = async (userData: User, profileData?: Profile) => {
      setUser(userData)
      if (profileData) {
        setProfile(profileData)
      }
    }

    const logout = () => {
      setUser(null)
      setProfile(null)
    }

    let authWatcherStop: WatchStopHandle | null = null

    const initializeFromSupabase = async () => {
      const supabaseUser = useSupabaseUser()

      if (authWatcherStop) {
        return
      }

      // Escutar mudanças no estado de auth do Supabase
      authWatcherStop = watch(
        supabaseUser,
        async (newUser) => {
          if (newUser) {
            setUser(newUser)

            // Buscar perfil automaticamente
            try {
              setLoading(true)
              const { fetchCurrentUserProfile } = useProfile()
              await fetchCurrentUserProfile()
            } catch (error) {
              console.error('Error fetching profile on auth change:', error)
            } finally {
              setLoading(false)
            }
          } else {
            logout()
          }
        },
        { immediate: true },
      )
    }

    // Getters
    const fullName = computed(() => profile.value?.full_name || 'Usuário')
    const username = computed(() => profile.value?.username || '')
    const avatarUrl = computed(() => profile.value?.avatar_url || '')

    return {
      // State - não usar readonly aqui para evitar warnings de hidratação
      user,
      profile,
      isLoading,
      isAuthenticated,

      // Actions
      setUser,
      setProfile,
      updateProfile,
      setLoading,
      login,
      logout,
      initializeFromSupabase,

      // Getters
      fullName,
      username,
      avatarUrl,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      paths: ['profile'], // Usar paths ao invés de pick
    },
  },
)

// HMR support
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
