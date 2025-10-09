import { computed, onBeforeUnmount, unref, watch } from 'vue'
import type { MaybeRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectCommentsStore } from '@/stores/projectComments'

export type UseProjectCommentsOptions = {
  subscribe?: boolean
  fetchOnMount?: boolean
  forceFetch?: boolean
}

export const useProjectComments = () => {
  const store = useProjectCommentsStore()
  const { summaries, isAuthenticated } = storeToRefs(store)

  const useComments = (
    projectIdSource: MaybeRef<number | null | undefined>,
    options: UseProjectCommentsOptions = {},
  ) => {
    const { subscribe = true, fetchOnMount = true, forceFetch = false } = options

    const projectId = computed(() => {
      const value = unref(projectIdSource)
      return typeof value === 'number' ? value : null
    })

    const comments = computed(() => (projectId.value ? store.getComments(projectId.value) : []))
    const summary = computed(() =>
      projectId.value ? store.getSummary(projectId.value) : undefined,
    )
    const loading = computed(() => (projectId.value ? store.isLoading(projectId.value) : false))
    const error = computed(() => (projectId.value ? store.getError(projectId.value) : null))

    const ensureFetch = async (id: number | null, force = false) => {
      if (!id) return null
      return store.fetchComments(id, { force })
    }

    watch(
      projectId,
      (newId, oldId) => {
        if (oldId && subscribe) {
          store.unsubscribeFromProject(oldId)
        }

        if (!newId) return

        if (fetchOnMount || forceFetch) {
          void ensureFetch(newId, forceFetch)
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

    const submitComment = async (content: string, payload: { authorName?: string | null } = {}) => {
      if (!projectId.value) {
        throw new Error('Projeto inválido para registrar comentário.')
      }
      return store.submitComment(projectId.value, content, payload)
    }

    const refresh = async () => {
      if (!projectId.value) return null
      return ensureFetch(projectId.value, true)
    }

    return {
      projectId,
      comments,
      summary,
      loading,
      error,
      isAuthenticated,
      submitComment,
      refresh,
    }
  }

  return {
    isAuthenticated,
    summaries,
    useComments,
  }
}
