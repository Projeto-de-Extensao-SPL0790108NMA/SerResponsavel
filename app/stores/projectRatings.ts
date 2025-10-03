import type { RealtimeChannel } from '@supabase/supabase-js'
import { ProjectRatingsService, type ProjectRatingSummary } from '@/services/projectRatings.service'
import type { Database } from '~~/database/types'
import type { ProjectWithRelations } from '@/stores/projects'

type UserRating = {
  rating: number
  reaction: string | null
  updatedAt: string
}

type LoadingState = Record<number, boolean>
type ErrorState = Record<number, string | null>

type SummaryState = Record<number, ProjectRatingSummary>
type UserRatingState = Record<number, UserRating>

const createEmptySummary = (projectId: number): ProjectRatingSummary => ({
  projectId,
  average: 0,
  total: 0,
  ratingCounts: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  },
  reactionCounts: {},
})

const convertViewRowToSummary = (
  row: Database['public']['Views']['project_rating_summaries']['Row'],
): ProjectRatingSummary => {
  const countsSource = row.rating_counts || {}
  const reactionSource = row.reaction_counts || {}

  return {
    projectId: row.project_id,
    average: Number(row.average ?? 0),
    total: Number(row.total ?? 0),
    ratingCounts: {
      1: Number((countsSource as Record<string, number>)['1'] ?? 0),
      2: Number((countsSource as Record<string, number>)['2'] ?? 0),
      3: Number((countsSource as Record<string, number>)['3'] ?? 0),
      4: Number((countsSource as Record<string, number>)['4'] ?? 0),
      5: Number((countsSource as Record<string, number>)['5'] ?? 0),
    },
    reactionCounts: Object.fromEntries(
      Object.entries(reactionSource as Record<string, number>).map(([key, value]) => [
        key,
        Number(value ?? 0),
      ]),
    ),
  }
}

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
    const pendingSummaryRequests = new Map<
      number,
      {
        force: boolean
        resolvers: Array<(summary: ProjectRatingSummary) => void>
        rejecters: Array<(error: unknown) => void>
      }
    >()
    let pendingSummaryTimeout: ReturnType<typeof setTimeout> | null = null

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

    const schedulePendingSummaryFetch = () => {
      if (pendingSummaryTimeout) return
      pendingSummaryTimeout = setTimeout(async () => {
        pendingSummaryTimeout = null

        const entries = Array.from(pendingSummaryRequests.entries())
        if (!entries.length) {
          return
        }

        pendingSummaryRequests.clear()

        const idsToFetchSet = new Set<number>()
        entries.forEach(([projectId, request]) => {
          if (request.force || !summaries.value[projectId]) {
            idsToFetchSet.add(projectId)
          }
        })

        const idsToFetch = Array.from(idsToFetchSet)

        try {
          let fetchedSummaries: ProjectRatingSummary[] = []

          if (idsToFetch.length > 0) {
            fetchedSummaries = await service.fetchSummaries(idsToFetch)
          }

          const fetchedMap = new Map<number, ProjectRatingSummary>()
          fetchedSummaries.forEach((summary) => {
            fetchedMap.set(summary.projectId, summary)
          })

          idsToFetch.forEach((projectId) => {
            if (!fetchedMap.has(projectId)) {
              fetchedMap.set(projectId, createEmptySummary(projectId))
            }
          })

          entries.forEach(([projectId, request]) => {
            const summary =
              fetchedMap.get(projectId) ??
              summaries.value[projectId] ??
              createEmptySummary(projectId)

            setSummary(summary)
            setError(projectId, null)
            setLoading(projectId, false)
            request.resolvers.forEach((resolve) => resolve(summary))
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao carregar avaliações'
          entries.forEach(([projectId, request]) => {
            setError(projectId, message)
            setLoading(projectId, false)
            request.rejecters.forEach((reject) => reject(error))
          })
        }
      }, 0)
    }

    const fetchSummary = async (projectId: number, options: { force?: boolean } = {}) => {
      if (!options.force && summaries.value[projectId]) {
        return summaries.value[projectId]
      }

      return new Promise<ProjectRatingSummary>((resolve, reject) => {
        const existingRequest = pendingSummaryRequests.get(projectId)

        if (existingRequest) {
          existingRequest.force = existingRequest.force || Boolean(options.force)
          existingRequest.resolvers.push(resolve)
          existingRequest.rejecters.push(reject)
        } else {
          pendingSummaryRequests.set(projectId, {
            force: Boolean(options.force),
            resolvers: [resolve],
            rejecters: [reject],
          })
        }

        if (options.force || !summaries.value[projectId]) {
          setLoading(projectId, true)
          setError(projectId, null)
        }

        schedulePendingSummaryFetch()
      })
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
      pendingSummaryRequests.clear()
      if (pendingSummaryTimeout) {
        clearTimeout(pendingSummaryTimeout)
        pendingSummaryTimeout = null
      }
    }

    const fetchSummariesForProjects = async (
      projectIds: number[],
      options: { force?: boolean } = {},
    ) => {
      if (!projectIds.length) {
        return []
      }

      const uniqueIds = Array.from(new Set(projectIds))

      return await Promise.all(uniqueIds.map((id) => fetchSummary(id, options)))
    }

    const ingestSummariesFromProjects = (projects: ProjectWithRelations[]) => {
      if (!projects.length) return

      const summariesToIngest: ProjectRatingSummary[] = []

      projects.forEach((project) => {
        if (project.rating_summary) {
          const summary = convertViewRowToSummary(project.rating_summary)
          summariesToIngest.push(summary)
        } else if (project.id) {
          summariesToIngest.push(createEmptySummary(project.id))
        }
      })

      summariesToIngest.forEach((summary) => {
        setSummary(summary)
        setError(summary.projectId, null)
        setLoading(summary.projectId, false)
      })
    }

    const removeSummary = (projectId: number) => {
      const { [projectId]: _removed, ...rest } = summaries.value
      summaries.value = rest
    }

    return {
      clientFingerprint,
      summaries,
      userRatings,
      loading,
      errors,
      ensureFingerprint,
      fetchSummary,
      fetchSummariesForProjects,
      ingestSummariesFromProjects,
      loadUserRating,
      submitRating,
      subscribeToProject,
      unsubscribeFromProject,
      resetState,
      removeSummary,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ['clientFingerprint', 'userRatings'],
    },
  },
)
