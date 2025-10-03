import { computed, onBeforeUnmount, unref, watch } from 'vue'
import type { MaybeRef } from 'vue'
import { storeToRefs } from 'pinia'

export type UseProjectRatingOptions = {
  loadUserRating?: boolean
  subscribe?: boolean
  fetchSummary?: boolean
}

export const useProjectRatings = () => {
  const store = useProjectRatingsStore()
  const { summaries, userRatings, loading, errors, clientFingerprint } = storeToRefs(store)

  const useProjectRating = (
    projectIdSource: MaybeRef<number | null | undefined>,
    options: UseProjectRatingOptions = {},
  ) => {
    const { loadUserRating = true, subscribe = true, fetchSummary = true } = options

    const projectId = computed(() => {
      const value = unref(projectIdSource)
      return typeof value === 'number' ? value : null
    })

    const summary = computed(() => (projectId.value ? summaries.value[projectId.value] : undefined))
    const userRating = computed(() =>
      projectId.value ? userRatings.value[projectId.value] : undefined,
    )
    const projectLoading = computed(() =>
      projectId.value ? (loading.value[projectId.value] ?? false) : false,
    )
    const projectError = computed(() => (projectId.value ? errors.value[projectId.value] : null))

    watch(
      projectId,
      (newId, oldId) => {
        if (oldId && subscribe) {
          store.unsubscribeFromProject(oldId)
        }

        if (!newId) {
          return
        }

        if (fetchSummary) {
          void store.fetchSummary(newId)
        }

        if (loadUserRating) {
          void store.loadUserRating(newId)
        }

        if (subscribe) {
          store.subscribeToProject(newId)
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      if (projectId.value && subscribe) {
        store.unsubscribeFromProject(projectId.value)
      }
    })

    const submitRating = async (rating: number, reaction?: string | null) => {
      if (!projectId.value) {
        throw new Error('Project ID indisponível para registrar avaliação.')
      }
      await store.submitRating(projectId.value, rating, reaction)
    }

    const refreshSummary = async () => {
      if (!projectId.value) return null
      return store.fetchSummary(projectId.value, { force: true })
    }

    return {
      projectId,
      summary,
      userRating,
      projectLoading,
      projectError,
      submitRating,
      refreshSummary,
    }
  }

  return {
    clientFingerprint,
    summaries,
    userRatings,
    loading,
    errors,
    fetchSummary: store.fetchSummary,
    fetchSummariesForProjects: store.fetchSummariesForProjects,
    loadUserRating: store.loadUserRating,
    submitRating: store.submitRating,
    subscribeToProject: store.subscribeToProject,
    unsubscribeFromProject: store.unsubscribeFromProject,
    resetState: store.resetState,
    ensureFingerprint: store.ensureFingerprint,
    useProjectRating,
  }
}
