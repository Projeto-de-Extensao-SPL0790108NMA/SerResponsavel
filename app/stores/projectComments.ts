import { computed, ref } from 'vue'
import type { RealtimeChannel } from '@supabase/supabase-js'
import {
  ProjectCommentsService,
  type ProjectCommentRow,
  type ProjectCommentSummary,
} from '@/services/projectComments.service'
import type { Database } from '~~/database/types'
import { useAuthStore } from '@/stores/auth'
import { useProjectRatingsStore } from '@/stores/projectRatings'

export type ProjectComment = {
  id: string
  projectId: number
  content: string
  createdAt: string
  updatedAt: string
  authorName: string | null
  clientFingerprint: string
  committed: boolean
  profileId: string | null
}

const mapRowToComment = (row: ProjectCommentRow): ProjectComment => ({
  id: row.id,
  projectId: row.project_id,
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  authorName: row.author_name ?? null,
  clientFingerprint: row.client_fingerprint,
  committed: row.committed,
  profileId: row.profile_id ?? null,
})

type CommentsDictionary = Record<number, ProjectComment[]>
type LoadingState = Record<number, boolean>
type ErrorState = Record<number, string | null>
type SummaryDictionary = Record<number, ProjectCommentSummary>

export const useProjectCommentsStore = defineStore('projectComments', () => {
  const supabase = useSupabaseClient<Database>()
  const authStore = useAuthStore()
  const projectRatingsStore = useProjectRatingsStore()
  const service = new ProjectCommentsService(supabase)

  const comments = ref<CommentsDictionary>({})
  const loading = ref<LoadingState>({})
  const errors = ref<ErrorState>({})
  const summaries = ref<SummaryDictionary>({})

  const subscriptions = new Map<number, RealtimeChannel>()
  const subscriptionRefs = new Map<number, number>()

  const isAuthenticated = computed(() => Boolean(authStore.user?.id))

  const setLoading = (projectId: number, value: boolean) => {
    loading.value = {
      ...loading.value,
      [projectId]: value,
    }
  }

  const setError = (projectId: number, value: string | null) => {
    errors.value = {
      ...errors.value,
      [projectId]: value,
    }
  }

  const setComments = (projectId: number, payload: ProjectComment[]) => {
    comments.value = {
      ...comments.value,
      [projectId]: payload,
    }
  }

  const addCommentLocally = (projectId: number, comment: ProjectComment) => {
    const existing = comments.value[projectId] ?? []
    setComments(projectId, [...existing, comment])
  }

  const setSummary = (projectId: number, payload: ProjectCommentSummary) => {
    summaries.value = {
      ...summaries.value,
      [projectId]: payload,
    }
  }

  const removeSummary = (projectId: number) => {
    const { [projectId]: _removed, ...rest } = summaries.value
    summaries.value = rest
  }

  const incrementSummaryTotal = (projectId: number, latestCommentAt: string) => {
    const current = summaries.value[projectId]
    const nextTotal = (current?.total ?? 0) + 1

    setSummary(projectId, {
      projectId,
      total: nextTotal,
      latestCommentAt,
    })
  }

  const ingestSummariesFromProjects = (
    projects: Array<{
      id?: number | null
      commentSummary?: ProjectCommentSummary | null
    }>,
  ) => {
    projects.forEach((project) => {
      const projectId = project.id
      if (typeof projectId !== 'number') return

      const summary = project.commentSummary ?? null
      if (summary) {
        setSummary(projectId, { ...summary, projectId })
      } else if (!summaries.value[projectId]) {
        setSummary(projectId, { projectId, total: 0, latestCommentAt: null })
      }
    })
  }

  const fetchComments = async (projectId: number, options: { force?: boolean } = {}) => {
    if (!options.force && comments.value[projectId]) {
      return comments.value[projectId]
    }

    setLoading(projectId, true)
    setError(projectId, null)

    try {
      const rows = await service.fetchComments(projectId)
      const mapped = rows.map(mapRowToComment)
      setComments(projectId, mapped)
      if (!summaries.value[projectId]) {
        setSummary(projectId, {
          projectId,
          total: mapped.length,
          latestCommentAt: mapped.length ? mapped[mapped.length - 1].createdAt : null,
        })
      }
      return mapped
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar comentários'
      setError(projectId, message)
      throw error
    } finally {
      setLoading(projectId, false)
    }
  }

  const getFingerprint = () => {
    const fingerprint = projectRatingsStore.ensureFingerprint()
    if (!fingerprint) {
      throw new Error('Fingerprint indisponível para registrar comentário.')
    }
    return fingerprint
  }

  const submitComment = async (
    projectId: number,
    content: string,
    options: { authorName?: string | null } = {},
  ) => {
    if (!content.trim()) {
      throw new Error('Comentário não pode ser vazio.')
    }

    const fingerprint = getFingerprint()
    const profileId = authStore.user?.id ?? null
    const authorName = profileId ? authStore.fullName : options.authorName?.trim() || null
    const committed = isAuthenticated.value

    setLoading(projectId, true)
    setError(projectId, null)

    try {
      const row = await service.addComment({
        project_id: projectId,
        client_fingerprint: fingerprint,
        content,
        profile_id: profileId,
        author_name: authorName,
        committed,
      })

      const mapped = mapRowToComment(row)
      addCommentLocally(projectId, mapped)
      incrementSummaryTotal(projectId, mapped.createdAt)
      return mapped
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao registrar comentário'
      setError(projectId, message)
      throw error
    } finally {
      setLoading(projectId, false)
    }
  }

  const subscribeToProject = (projectId: number) => {
    if (!import.meta.client) return

    const refs = subscriptionRefs.get(projectId) ?? 0
    subscriptionRefs.set(projectId, refs + 1)

    if (subscriptions.has(projectId)) return

    const channel = supabase
      .channel(`project-comments-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_comments',
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          void fetchComments(projectId, { force: true }).catch((error) => {
            console.error('Erro ao sincronizar comentários do projeto', error)
          })
        },
      )
      .subscribe()

    subscriptions.set(projectId, channel)
  }

  const unsubscribeFromProject = (projectId: number) => {
    if (!subscriptionRefs.has(projectId)) return

    const nextRefs = (subscriptionRefs.get(projectId) ?? 1) - 1

    if (nextRefs <= 0) {
      subscriptionRefs.delete(projectId)
      const channel = subscriptions.get(projectId)
      if (channel) {
        void channel.unsubscribe()
        subscriptions.delete(projectId)
      }
      return
    }

    subscriptionRefs.set(projectId, nextRefs)
  }

  const clearProject = (projectId: number) => {
    const { [projectId]: _comments, ...restComments } = comments.value
    comments.value = restComments

    const { [projectId]: _loading, ...restLoading } = loading.value
    loading.value = restLoading

    const { [projectId]: _error, ...restErrors } = errors.value
    errors.value = restErrors

    removeSummary(projectId)
    unsubscribeFromProject(projectId)
  }

  const getComments = (projectId: number) => comments.value[projectId] ?? []
  const getSummary = (projectId: number) => summaries.value[projectId]
  const isLoading = (projectId: number) => loading.value[projectId] ?? false
  const getError = (projectId: number) => errors.value[projectId] ?? null

  return {
    comments,
    summaries,
    loading,
    errors,
    isAuthenticated,
    ingestSummariesFromProjects,
    fetchComments,
    submitComment,
    subscribeToProject,
    unsubscribeFromProject,
    clearProject,
    getComments,
    getSummary,
    isLoading,
    getError,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectCommentsStore, import.meta.hot))
}
