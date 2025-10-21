import type { ThemeDefinitionName } from 'vuetify'

type ThemeMode = Extract<ThemeDefinitionName, 'light' | 'dark'> | 'light' | 'dark'

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const theme = ref<ThemeMode>('dark')

    const setTheme = async (mode: ThemeMode) => {
      theme.value = mode

      // Sincronizar com perfil do usuário se estiver logado
      await syncThemeWithProfile(mode)
    }

    const toggleTheme = async () => {
      const newMode = theme.value === 'dark' ? 'light' : 'dark'
      await setTheme(newMode)
    }

    const initializeTheme = (mode?: ThemeMode) => {
      if (mode) {
        theme.value = mode
      }
    }

    const syncThemeWithProfile = async (mode: ThemeMode) => {
      try {
        const { useAuthStore } = await import('@/stores/auth')
        const { useProfile } = await import('@/composables/useProfile')

        const authStore = useAuthStore()

        // Só sincroniza se o usuário estiver autenticado e tiver perfil
        if (authStore.isAuthenticated && authStore.profile) {
          const { updateProfile } = useProfile()

          const { error } = await updateProfile({ mode })

          if (error) {
            console.warn('Falha ao sincronizar tema com perfil:', error)
          }
        }
      } catch (error) {
        console.warn('Erro ao sincronizar tema:', error)
      }
    }

    return {
      theme,
      setTheme,
      toggleTheme,
      initializeTheme,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ['theme'],
    },
  },
)
