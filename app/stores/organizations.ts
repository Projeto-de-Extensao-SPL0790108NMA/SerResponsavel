import type { Database } from '~~/database/types'

type Organization = Database['public']['Tables']['organizations']['Row']

export const useOrganizationsStore = defineStore(
  'organizations',
  () => {
    const items = ref<Record<string, Organization>>({})
    const loading = ref(false)
    const error = ref<string | null>(null)

    const getOrganization = (id?: string | null) => {
      if (!id) return null
      return items.value[id] ?? null
    }

    const fetchOrganization = async (id?: string | null) => {
      if (!id) return null
      if (items.value[id]) {
        return items.value[id]
      }

      loading.value = true
      error.value = null

      try {
        const supabase = useSupabaseClient<Database>()
        const { data, error: dbError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single()

        if (dbError) {
          error.value = dbError.message
          return null
        }

        if (data) {
          items.value[id] = data
        }

        return data
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unexpected error'
        return null
      } finally {
        loading.value = false
      }
    }

    return {
      items,
      loading,
      error,
      getOrganization,
      fetchOrganization,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ['items'],
    },
  },
)
