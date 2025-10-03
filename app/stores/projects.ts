import { computed, reactive, ref } from 'vue'
import { useProjectRatingsStore } from '@/stores/projectRatings'
import type { Database } from '~~/database/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type OrganizationRow = Database['public']['Tables']['organizations']['Row']
type TaskRow = Database['public']['Tables']['tasks']['Row']

export type ProjectWithRelations = ProjectRow & {
  organization?: OrganizationRow | null
  tasks?: TaskRow[] | null
}
export type Projects = ProjectWithRelations[]
export type ProjectStatusFilter = 'all' | 'in-progress' | 'completed'
const statusFilters: ProjectStatusFilter[] = ['all', 'in-progress', 'completed']
const statusFiltersWithoutAll: Exclude<ProjectStatusFilter, 'all'>[] = ['in-progress', 'completed']

const mapToProjectWithRelations = (
  project: ProjectRow | ProjectWithRelations,
): ProjectWithRelations => {
  const { organization = null, tasks = null, ...base } = project as ProjectWithRelations

  return {
    ...base,
    organization,
    tasks,
  }
}

export const useProjectsStore = defineStore(
  'projects',
  () => {
    const projects = ref<Projects | null>(null)
    const currentProject = ref<ProjectWithRelations | null>(null)
    const completedProjectsCount = ref<number>(0)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const lastFetch = ref<number | null>(null)
    const cacheTime = 5 * 60 * 1000 // 5 minutes in milliseconds

    const projectsByStatus = reactive<Record<Exclude<ProjectStatusFilter, 'all'>, Projects | null>>(
      {
        'in-progress': null,
        completed: null,
      },
    )
    const lastFetchByStatus = reactive<Record<Exclude<ProjectStatusFilter, 'all'>, number | null>>({
      'in-progress': null,
      completed: null,
    })

    const projectsSubscription = ref<RealtimeChannel | null>(null)
    const currentProjectSubscription = ref<RealtimeChannel | null>(null)
    const projectRatingsStore = useProjectRatingsStore()

    const {
      getProjects,
      getProject,
      createProject,
      updateProject,
      deleteProject,
      getCountConcludedProjects,
    } = useProjects()

    const getCachedProjects = (status: ProjectStatusFilter): Projects | null => {
      if (status === 'all') {
        return projects.value
      }
      return projectsByStatus[status]
    }

    const getLastFetchForStatus = (status: ProjectStatusFilter): number | null => {
      if (status === 'all') {
        return lastFetch.value
      }
      return lastFetchByStatus[status]
    }

    const setCacheForStatus = (status: ProjectStatusFilter, data: Projects) => {
      if (status === 'all') {
        projects.value = data
        lastFetch.value = Date.now()
        return
      }

      projectsByStatus[status] = data
      lastFetchByStatus[status] = Date.now()
    }

    const syncProjectInCaches = (project: ProjectWithRelations) => {
      statusFiltersWithoutAll.forEach((status) => {
        const cache = projectsByStatus[status]
        if (!cache) return

        const index = cache.findIndex((item) => item.id === project.id)
        const matchesStatus = project.status === status

        if (index !== -1) {
          if (matchesStatus) {
            cache[index] = project
          } else {
            cache.splice(index, 1)
          }
        } else if (matchesStatus) {
          cache.push(project)
        }

        if (matchesStatus || index !== -1) {
          lastFetchByStatus[status] = Date.now()
        }
      })
    }

    const removeProjectFromCaches = (projectId: number) => {
      statusFiltersWithoutAll.forEach((status) => {
        const cache = projectsByStatus[status]
        if (!cache) return
        const index = cache.findIndex((item) => item.id === projectId)
        if (index !== -1) {
          cache.splice(index, 1)
          lastFetchByStatus[status] = Date.now()
        }
      })
    }

    const invalidateCache = (status?: ProjectStatusFilter) => {
      const statusesToInvalidate = status ? [status] : statusFilters

      statusesToInvalidate.forEach((key) => {
        if (key === 'all') {
          projects.value = null
          lastFetch.value = null
        } else {
          projectsByStatus[key] = null
          lastFetchByStatus[key] = null
        }
      })

      console.debug('🗑️ Cache invalidated for status:', status ?? 'all statuses')
    }

    const isCacheValid = (timestamp: number | null) => {
      if (!timestamp) return false
      return Date.now() - timestamp < cacheTime
    }

    const setupProjectsSubscription = () => {
      if (projectsSubscription.value || import.meta.server) return

      const supabase = useSupabaseClient()
      projectsSubscription.value = supabase
        .channel('projects-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
          console.debug('🔄 Projects changed:', payload)
          invalidateCache()
          void fetchProjects(true, 'all')
        })
        .subscribe()
    }

    const fetchProjects = async (
      forceRefresh = false,
      status: ProjectStatusFilter = 'all',
    ): Promise<Projects | null> => {
      const cachedProjects = getCachedProjects(status)
      const lastFetchTimestamp = getLastFetchForStatus(status)

      if (!forceRefresh && cachedProjects && isCacheValid(lastFetchTimestamp)) {
        console.debug('📦 Using cached projects cache for status:', status)
        return cachedProjects
      }

      loading.value = true
      error.value = null

      try {
        console.debug('🌐 Fetching projects from Supabase', `status: ${status}`)
        const { data, error: supabaseError } = await getProjects(status)

        if (supabaseError) {
          error.value = (supabaseError as Error)?.message || 'Erro desconhecido'
          return cachedProjects ?? null
        }

        const mappedProjects = (data ?? []).map(mapToProjectWithRelations)
        projectRatingsStore.ingestSummariesFromProjects(mappedProjects)
        const projectIds = mappedProjects.map((project) => project.id)
        void projectRatingsStore.fetchSummariesForProjects(projectIds, {
          force: forceRefresh,
        })
        void projectRatingsStore.loadUserRatingsForProjects(projectIds)
        void projectRatingsStore.loadUserReactionsForProjects(projectIds)
        setCacheForStatus(status, mappedProjects)

        if (status === 'all') {
          setupProjectsSubscription()
        }

        return mappedProjects
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error occurred'
        return cachedProjects ?? null
      } finally {
        loading.value = false
      }
    }

    const fetchProject = async (slug: string) => {
      loading.value = true
      error.value = null

      try {
        const { data, error: supabaseError } = await getProject(slug)

        if (supabaseError) {
          error.value = (supabaseError as Error)?.message || 'Erro desconhecido'
          return
        }

        const mapped = data ? mapToProjectWithRelations(data) : null
        currentProject.value = mapped
        if (mapped) {
          projectRatingsStore.ingestSummariesFromProjects([mapped])
          void projectRatingsStore.fetchSummariesForProjects([mapped.id], { force: true })
          void projectRatingsStore.loadUserRatingsForProjects([mapped.id])
          void projectRatingsStore.loadUserReactionsForProjects([mapped.id])
        }
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      } finally {
        loading.value = false
      }
    }

    const addProject = async (projectData: {
      name: string
      slug: string
      description?: string
      status?: 'in-progress' | 'completed'
      collaborators?: string[]
      organization_id?: string | null
      cover_image_url?: string | null
      cover_image_path?: string | null
    }) => {
      loading.value = true
      error.value = null

      try {
        const { data, error: supabaseError } = await createProject(projectData)

        if (supabaseError) {
          error.value = (supabaseError as Error)?.message || 'Erro desconhecido'
          return null
        }

        if (!data) {
          return null
        }

        const mappedProject = mapToProjectWithRelations(data)
        projects.value = [...(projects.value ?? []), mappedProject]
        lastFetch.value = Date.now()
        syncProjectInCaches(mappedProject)
        projectRatingsStore.ingestSummariesFromProjects([mappedProject])
        void projectRatingsStore.fetchSummariesForProjects([mappedProject.id], { force: true })
        void projectRatingsStore.loadUserRatingsForProjects([mappedProject.id])
        void projectRatingsStore.loadUserReactionsForProjects([mappedProject.id])

        return mappedProject
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error occurred'
        return null
      } finally {
        loading.value = false
      }
    }

    const editProject = async (
      id: number,
      updates: {
        name?: string
        slug?: string
        description?: string
        status?: 'in-progress' | 'completed'
        collaborators?: string[]
        organization_id?: string | null
        cover_image_url?: string | null
        cover_image_path?: string | null
      },
    ) => {
      loading.value = true
      error.value = null

      try {
        const { data, error: supabaseError } = await updateProject(id, updates)

        if (supabaseError) {
          error.value = (supabaseError as Error)?.message || 'Erro desconhecido'
          return null
        }

        if (!data) {
          return null
        }

        const mappedProject = mapToProjectWithRelations(data)

        if (projects.value) {
          const index = projects.value.findIndex((p) => p.id === id)
          if (index !== -1) {
            projects.value[index] = mappedProject
          }
        }

        if (!projects.value) {
          projects.value = [mappedProject]
        }

        lastFetch.value = Date.now()
        syncProjectInCaches(mappedProject)
        projectRatingsStore.ingestSummariesFromProjects([mappedProject])
        void projectRatingsStore.fetchSummariesForProjects([mappedProject.id], { force: true })
        void projectRatingsStore.loadUserRatingsForProjects([mappedProject.id])
        void projectRatingsStore.loadUserReactionsForProjects([mappedProject.id])

        if (currentProject.value?.id === id) {
          currentProject.value = mappedProject
        }

        return mappedProject
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error occurred'
        return null
      } finally {
        loading.value = false
      }
    }

    const removeProject = async (id: number) => {
      loading.value = true
      error.value = null

      try {
        const { error: supabaseError } = await deleteProject(id)

        if (supabaseError) {
          error.value = (supabaseError as Error)?.message || 'Erro desconhecido'
          return false
        }

        if (projects.value) {
          projects.value = projects.value.filter((p) => p.id !== id)
          lastFetch.value = Date.now()
        }

        removeProjectFromCaches(id)
        projectRatingsStore.removeSummary(id)
        syncProjectRatingSummary(id, null)

        if (currentProject.value?.id === id) {
          currentProject.value = null
        }

        return true
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error occurred'
        return false
      } finally {
        loading.value = false
      }
    }

    const clearError = () => {
      error.value = null
    }

    const setCurrentProject = (project: ProjectWithRelations | null) => {
      currentProject.value = project ? mapToProjectWithRelations(project) : null
    }

    const clearCurrentProject = () => {
      currentProject.value = null
    }

    const refreshProjects = (status: ProjectStatusFilter = 'all') => {
      return fetchProjects(true, status)
    }

    const fetchCompletedProjectsCount = async () => {
      try {
        const { data, error: supabaseError } = await getCountConcludedProjects()

        if (supabaseError) {
          console.error('Error fetching completed projects count:', supabaseError)
          return
        }

        completedProjectsCount.value = data || 0
      } catch (err) {
        console.error('Error fetching completed projects count:', err)
      }
    }

    const cleanup = () => {
      if (projectsSubscription.value) {
        projectsSubscription.value.unsubscribe()
        projectsSubscription.value = null
      }
      if (currentProjectSubscription.value) {
        currentProjectSubscription.value.unsubscribe()
        currentProjectSubscription.value = null
      }
    }

    const projectsCount = computed(() => projects.value?.length ?? 0)
    const hasProjects = computed(() => projectsCount.value > 0)
    const isLoading = computed(() => loading.value)
    const hasError = computed(() => !!error.value)
    const isCached = computed(() => projects.value && isCacheValid(lastFetch.value))

    return {
      projects,
      currentProject,
      completedProjectsCount,
      lastFetch,
      loading,
      error,

      fetchProjects,
      fetchProject,
      fetchCompletedProjectsCount,
      addProject,
      editProject,
      removeProject,
      clearError,
      setCurrentProject,
      clearCurrentProject,
      invalidateCache,
      refreshProjects,
      cleanup,
      getCachedProjects,

      projectsCount,
      hasProjects,
      isLoading,
      hasError,
      isCached,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
      pick: ['projects', 'currentProject', 'lastFetch'],
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot))
}
