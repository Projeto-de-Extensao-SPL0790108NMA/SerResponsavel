import { computed, ref, watch } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { ProjectRatingsService, type ProjectRatingSummary } from '@/services/projectRatings.service'
import type { Database } from '~~/database/types'
import type { ProjectWithRelations } from '@/stores/projects'
import { useAuthStore } from '@/stores/auth'

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

type LoadingState = Record<number, boolean>
type ErrorState = Record<number, string | null>
type SummaryState = Record<number, ProjectRatingSummary>
type UserRatingState = Record<
  number,
  {
    rating: number
    committed: boolean
    updatedAt: string
  }
>
type UserReactionState = Record<
  number,
  {
    reaction: string
    committed: boolean
    updatedAt: string
  }
>

type SummaryRequest = {
  force: boolean
  resolvers: Array<(summary: ProjectRatingSummary) => void>
  rejecters: Array<(error: unknown) => void>
}

const createFingerprint = () => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch (error) {
    console.warn('Fallback fingerprint generation due to error:', error)
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const useProjectRatingsStore = defineStore(
  'projectRatings',
  () => {
    const authStore = useAuthStore()
    const supabase = useSupabaseClient<Database>()
    const service = new ProjectRatingsService(supabase)

    const anonymousFingerprint = ref<string | null>(null)
    const clientFingerprint = ref<string | null>(null)

    const summaries = ref<SummaryState>({})
    const userRatings = ref<UserRatingState>({})
    const userReactions = ref<UserReactionState>({})
    const loading = ref<LoadingState>({})
    const errors = ref<ErrorState>({})

    const subscriptions = new Map<number, RealtimeChannel>()
    const subscriptionRefs = new Map<number, number>()

    const pendingSummaryRequests = new Map<number, SummaryRequest>()
    let pendingSummaryTimeout: ReturnType<typeof setTimeout> | null = null
    const pendingRatingRequests = new Set<number>()
    const pendingReactionRequests = new Set<number>()

    const isCommittedIdentity = computed(() => Boolean(authStore.user?.id))

    const applyFingerprint = (fingerprint: string) => {
      if (clientFingerprint.value !== fingerprint) {
        clientFingerprint.value = fingerprint
        userRatings.value = {}
        userReactions.value = {}
        pendingRatingRequests.clear()
        pendingReactionRequests.clear()
      }
    }

    const syncFingerprint = () => {
      const authId = authStore.user?.id ?? null

      if (authId) {
        applyFingerprint(authId)
        return
      }

      if (!anonymousFingerprint.value || clientFingerprint.value === authId) {
        anonymousFingerprint.value = anonymousFingerprint.value ?? createFingerprint()
      }

      applyFingerprint(anonymousFingerprint.value)
    }

    if (!anonymousFingerprint.value && clientFingerprint.value && !authStore.user?.id) {
      anonymousFingerprint.value = clientFingerprint.value
    }

    syncFingerprint()

    const ensureFingerprint = () => {
      syncFingerprint()
      return clientFingerprint.value
    }

    const getIdentity = () => {
      const fingerprint = ensureFingerprint()
      if (!fingerprint) {
        throw new Error('Fingerprint indisponível para registrar avaliação.')
      }
      return {
        fingerprint,
        committed: isCommittedIdentity.value,
      }
    }

    const setSummary = (summary: ProjectRatingSummary) => {
      summaries.value = {
        ...summaries.value,
        [summary.projectId]: summary,
      }
    }

    const setUserRating = (
      projectId: number,
      payload: { rating: number; committed: boolean; updatedAt: string },
    ) => {
      userRatings.value = {
        ...userRatings.value,
        [projectId]: payload,
      }
    }

    const removeUserRating = (projectId: number) => {
      const { [projectId]: _removed, ...rest } = userRatings.value
      userRatings.value = rest
    }

    const setUserReaction = (
      projectId: number,
      payload: { reaction: string; committed: boolean; updatedAt: string },
    ) => {
      userReactions.value = {
        ...userReactions.value,
        [projectId]: payload,
      }
    }

    const removeUserReaction = (projectId: number) => {
      const { [projectId]: _removed, ...rest } = userReactions.value
      userReactions.value = rest
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

        const idsNeedingFetch = new Set<number>()
        entries.forEach(([projectId, request]) => {
          if (request.force || !summaries.value[projectId]) {
            idsNeedingFetch.add(projectId)
          }
        })

        let fetchedSummaries: ProjectRatingSummary[] = []

        try {
          if (idsNeedingFetch.size > 0) {
            fetchedSummaries = await service.fetchSummaries(Array.from(idsNeedingFetch))
          }

          const fetchedMap = new Map<number, ProjectRatingSummary>()
          fetchedSummaries.forEach((summary) => {
            fetchedMap.set(summary.projectId, summary)
          })

          idsNeedingFetch.forEach((projectId) => {
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
      if (pendingRatingRequests.has(projectId)) return null

      const identity = getIdentity()
      pendingRatingRequests.add(projectId)

      try {
        const record = await service.fetchUserRating(projectId, identity.fingerprint)
        if (record) {
          setUserRating(projectId, {
            rating: record.rating,
            committed: record.committed,
            updatedAt: record.updated_at,
          })
        } else {
          removeUserRating(projectId)
        }
        return record
      } catch (error) {
        console.warn('Não foi possível carregar avaliação do usuário:', error)
        return null
      } finally {
        pendingRatingRequests.delete(projectId)
      }
    }

    const loadUserRatingsForProjects = async (projectIds: number[]) => {
      const identity = getIdentity()
      const idsToLoad = projectIds.filter((id) => !pendingRatingRequests.has(id))
      idsToLoad.forEach((id) => pendingRatingRequests.add(id))

      if (!idsToLoad.length) return []

      try {
        const records = await service.fetchUserRatings(idsToLoad, identity.fingerprint)

        records.forEach((record) => {
          setUserRating(record.project_id, {
            rating: record.rating,
            committed: record.committed,
            updatedAt: record.updated_at,
          })
        })

        return records
      } catch (error) {
        console.warn('Não foi possível carregar avaliações do usuário:', error)
        return []
      } finally {
        idsToLoad.forEach((id) => pendingRatingRequests.delete(id))
      }
    }

    const loadUserReaction = async (projectId: number) => {
      if (pendingReactionRequests.has(projectId)) return null

      const identity = getIdentity()
      pendingReactionRequests.add(projectId)

      try {
        const record = await service.fetchUserReaction(projectId, identity.fingerprint)
        if (record) {
          setUserReaction(projectId, {
            reaction: record.reaction,
            committed: record.committed,
            updatedAt: record.updated_at,
          })
        } else {
          removeUserReaction(projectId)
        }
        return record
      } catch (error) {
        console.warn('Não foi possível carregar reação do usuário:', error)
        return null
      } finally {
        pendingReactionRequests.delete(projectId)
      }
    }

    const loadUserReactionsForProjects = async (projectIds: number[]) => {
      const identity = getIdentity()
      const idsToLoad = projectIds.filter((id) => !pendingReactionRequests.has(id))
      idsToLoad.forEach((id) => pendingReactionRequests.add(id))

      if (!idsToLoad.length) return []

      try {
        const records = await service.fetchUserReactions(idsToLoad, identity.fingerprint)

        records.forEach((record) => {
          setUserReaction(record.project_id, {
            reaction: record.reaction,
            committed: record.committed,
            updatedAt: record.updated_at,
          })
        })

        return records
      } catch (error) {
        console.warn('Não foi possível carregar reações do usuário:', error)
        return []
      } finally {
        idsToLoad.forEach((id) => pendingReactionRequests.delete(id))
      }
    }

    const submitRating = async (projectId: number, rating: number) => {
      const { fingerprint, committed } = getIdentity()

      setLoading(projectId, true)
      setError(projectId, null)

      try {
        const record = await service.upsertRating({
          projectId,
          clientFingerprint: fingerprint,
          rating,
          committed,
        })

        setUserRating(projectId, {
          rating: record.rating,
          committed: record.committed,
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

    const submitReaction = async (projectId: number, reaction: string) => {
      const { fingerprint, committed } = getIdentity()

      setLoading(projectId, true)
      setError(projectId, null)

      try {
        const record = await service.upsertReaction({
          projectId,
          clientFingerprint: fingerprint,
          reaction,
          committed,
        })

        setUserReaction(projectId, {
          reaction: record.reaction,
          committed: record.committed,
          updatedAt: record.updated_at,
        })

        await fetchSummary(projectId, { force: true })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao registrar reação'
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
        .channel(`project-feedback-${projectId}`)
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
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'project_reactions',
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

    const fetchSummariesForProjects = async (
      projectIds: number[],
      options: { force?: boolean } = {},
    ) => {
      if (!projectIds.length) return []
      const uniqueIds = Array.from(new Set(projectIds))
      return Promise.all(uniqueIds.map((id) => fetchSummary(id, options)))
    }

    const ingestSummariesFromProjects = (projects: ProjectWithRelations[]) => {
      if (!projects.length) return

      projects
        .map((project) => project.id)
        .filter((id): id is number => typeof id === 'number')
        .forEach((projectId) => {
          if (!summaries.value[projectId]) {
            const summary = createEmptySummary(projectId)
            setSummary(summary)
            setError(projectId, null)
            setLoading(projectId, false)
          }
        })
    }

    const removeSummary = (projectId: number) => {
      const { [projectId]: _removed, ...rest } = summaries.value
      summaries.value = rest
      removeUserRating(projectId)
      removeUserReaction(projectId)
    }

    const resetState = () => {
      summaries.value = {}
      loading.value = {}
      errors.value = {}
      userRatings.value = {}
      userReactions.value = {}
      subscriptions.forEach((channel) => {
        void channel.unsubscribe()
      })
      subscriptions.clear()
      subscriptionRefs.clear()
      pendingSummaryRequests.clear()
      pendingRatingRequests.clear()
      pendingReactionRequests.clear()
      if (pendingSummaryTimeout) {
        clearTimeout(pendingSummaryTimeout)
        pendingSummaryTimeout = null
      }
      syncFingerprint()
    }

    const isUserRatingPending = (projectId: number) => pendingRatingRequests.has(projectId)
    const isUserReactionPending = (projectId: number) => pendingReactionRequests.has(projectId)

    watch(
      () => authStore.user?.id,
      () => {
        syncFingerprint()
        const ids = Object.keys(summaries.value)
          .map((id) => Number(id))
          .filter((id) => Number.isFinite(id))

        if (ids.length) {
          void loadUserRatingsForProjects(ids)
          void loadUserReactionsForProjects(ids)
        }
      },
    )

    return {
      clientFingerprint,
      anonymousFingerprint,
      summaries,
      userRatings,
      userReactions,
      loading,
      errors,
      isCommittedIdentity,
      ensureFingerprint,
      fetchSummary,
      fetchSummariesForProjects,
      ingestSummariesFromProjects,
      loadUserRating,
      loadUserRatingsForProjects,
      loadUserReaction,
      loadUserReactionsForProjects,
      submitRating,
      submitReaction,
      subscribeToProject,
      unsubscribeFromProject,
      resetState,
      removeSummary,
      isUserRatingPending,
      isUserReactionPending,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ['anonymousFingerprint', 'clientFingerprint', 'userRatings', 'userReactions'],
    },
  },
)
