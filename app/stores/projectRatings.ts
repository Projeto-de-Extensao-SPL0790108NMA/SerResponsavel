import type { RealtimeChannel } from '@supabase/supabase-js'
import { ProjectRatingsService, type ProjectRatingSummary } from '@/services/projectRatings.service'
import type { Database } from '~~/database/types'

type UserRating = {
  rating: number
  reaction: string | null
  updatedAt: string
}

type LoadingState = Record<number, boolean>
type ErrorState = Record<number, string | null>

type SummaryState = Record<number, ProjectRatingSummary>
type UserRatingState = Record<number, UserRating>

export const useProjectRatingsStore = defineStore(
  'projectRatings',
  () => {
    const supabase = useSupabaseClient<Database>()
    const service = new ProjectRatingsService(supabase)

    const clientFingerprint = ref<string | null>(null)
    const summaries = ref<SummaryState>({})
    const userRatings = ref<UserRatingState>({})
    const loading = ref<LoadingState>({})
    const errors = ref<ErrorState>({})

    const subscriptions = new Map<number, RealtimeChannel>()
    const subscriptionRefs = new Map<number, number>()

    const ensureFingerprint = () => {
      if (clientFingerprint.value) {
        return clientFingerprint.value
      }

      if (!import.meta.client) {
        return null
      }

      let fingerprint: string
      try {
        fingerprint =
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`
      } catch (error) {
        console.warn('Fallback fingerprint generation due to error:', error)
        fingerprint = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      }

      clientFingerprint.value = fingerprint
      return fingerprint
    }

    const setSummary = (summary: ProjectRatingSummary) => {
      summaries.value = {
        ...summaries.value,
        [summary.projectId]: summary,
      }
    }

    const setUserRating = (projectId: number, rating: UserRating) => {
      userRatings.value = {
        ...userRatings.value,
        [projectId]: rating,
      }
    }

    const setLoading = (projectId: number, value: boolean) => {
      loading.value = {
        ...loading.value,
        [projectId]: value,
      }
    }

    const setError = (projectId: number, message: string | null) => {
      errors.value = {
        ...errors.value,
        [projectId]: message,
      }
    }

    const fetchSummary = async (projectId: number, options: { force?: boolean } = {}) => {
      if (!options.force && summaries.value[projectId]) {
        return summaries.value[projectId]
      }

      setLoading(projectId, true)
      setError(projectId, null)
      try {
        const summary = await service.fetchSummary(projectId)
        setSummary(summary)
        return summary
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar avaliações'
        setError(projectId, message)
        throw error
      } finally {
        setLoading(projectId, false)
      }
    }

    const loadUserRating = async (projectId: number) => {
      const fingerprint = ensureFingerprint()
      if (!fingerprint) return null

      try {
        const existing = await service.fetchUserRating(projectId, fingerprint)
        if (existing) {
          setUserRating(projectId, {
            rating: existing.rating,
            reaction: existing.reaction,
            updatedAt: existing.updated_at,
          })
        }
        return existing
      } catch (error) {
        console.warn('Não foi possível carregar avaliação do usuário anônimo:', error)
        return null
      }
    }

    const submitRating = async (projectId: number, rating: number, reaction?: string | null) => {
      const fingerprint = ensureFingerprint()
      if (!fingerprint) {
        throw new Error('Fingerprint indisponível para registrar avaliação.')
      }

      setLoading(projectId, true)
      setError(projectId, null)

      try {
        const record = await service.upsertRating({
          projectId,
          clientFingerprint: fingerprint,
          rating,
          reaction: reaction ?? null,
        })

        setUserRating(projectId, {
          rating: record.rating,
          reaction: record.reaction,
          updatedAt: record.updated_at,
        })

        await fetchSummary(projectId, { force: true })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao registrar avaliação'
        setError(projectId, message)
        throw error
      } finally {
        setLoading(projectId, false)
      }
    }

    const subscribeToProject = (projectId: number) => {
      if (!import.meta.client) return

      const currentRefs = subscriptionRefs.get(projectId) ?? 0
      subscriptionRefs.set(projectId, currentRefs + 1)

      if (subscriptions.has(projectId)) return

      const channel = supabase
        .channel(`project-ratings-${projectId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'project_ratings',
            filter: `project_id=eq.${projectId}`,
          },
          () => {
            void fetchSummary(projectId, { force: true })
          },
        )
        .subscribe()

      subscriptions.set(projectId, channel)
    }

    const unsubscribeFromProject = (projectId: number) => {
      if (!subscriptionRefs.has(projectId)) return

      const nextCount = (subscriptionRefs.get(projectId) ?? 1) - 1

      if (nextCount <= 0) {
        subscriptionRefs.delete(projectId)
        const channel = subscriptions.get(projectId)
        if (channel) {
          void channel.unsubscribe()
          subscriptions.delete(projectId)
        }
        return
      }

      subscriptionRefs.set(projectId, nextCount)
    }

    const resetState = () => {
      summaries.value = {}
      loading.value = {}
      errors.value = {}
      subscriptions.forEach((channel) => {
        void channel.unsubscribe()
      })
      subscriptions.clear()
      subscriptionRefs.clear()
    }

    return {
      clientFingerprint,
      summaries,
      userRatings,
      loading,
      errors,
      ensureFingerprint,
      fetchSummary,
      loadUserRating,
      submitRating,
      subscribeToProject,
      unsubscribeFromProject,
      resetState,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ['clientFingerprint', 'userRatings'],
    },
  },
)
