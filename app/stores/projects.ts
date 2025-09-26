import type { Database } from '~~/database/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

type ProjectRow = Database['public']['Tables']['projects']['Row']
type OrganizationRow = Database['public']['Tables']['organizations']['Row']
type TaskRow = Database['public']['Tables']['tasks']['Row']

type ProjectWithRelations = ProjectRow & {
  organization?: OrganizationRow | null
  tasks?: TaskRow[] | null
}
type Projects = ProjectWithRelations[]

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

    const projectsSubscription = ref<RealtimeChannel | null>(null)
    const currentProjectSubscription = ref<RealtimeChannel | null>(null)

    const {
      getProjects,
      getProject,
      createProject,
      updateProject,
      deleteProject,
      getCountConcludedProjects,
    } = useProjects()

    const isCacheValid = () => {
      if (!lastFetch.value) return false
      return Date.now() - lastFetch.value < cacheTime
    }

    const setupProjectsSubscription = () => {
      if (projectsSubscription.value || import.meta.server) return

      const supabase = useSupabaseClient()
      projectsSubscription.value = supabase
        .channel('projects-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
          console.debug('🔄 Projects changed:', payload)
          lastFetch.value = null
          void fetchProjects(true)
        })
        .subscribe()
    }

    const fetchProjects = async (
      forceRefresh = false,
      status?: 'in-progress' | 'completed' | 'all',
    ) => {
      if (!forceRefresh && projects.value && isCacheValid()) {
        console.debug('📦 Using cached projects')
        return
      }

      loading.value = true
      error.value = null

      try {
        console.debug('🌐 Fetching projects from Supabase', status ? `with status: ${status}` : '')
        const { data, error: supabaseError } = await getProjects(status)

        if (supabaseError) {
          error.value = (supabaseError as Error)?.message || 'Erro desconhecido'
          return
        }

        projects.value = (data ?? []).map(mapToProjectWithRelations)
        lastFetch.value = Date.now()

        setupProjectsSubscription()
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error occurred'
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

        currentProject.value = data ? mapToProjectWithRelations(data) : null
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
    }) => {
      loading.value = true
      error.value = null

      try {
        const { data, error: supabaseError } = await createProject(projectData)

        if (supabaseError) {
          error.value = (supabaseError as Error)?.message || 'Erro desconhecido'
          return null
        }

        if (data) {
          const mappedProject = mapToProjectWithRelations(data)
          projects.value = [...(projects.value ?? []), mappedProject]
          return mappedProject
        }

        return null
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

        if (data) {
          const mappedProject = mapToProjectWithRelations(data)

          if (projects.value) {
            const index = projects.value.findIndex((p) => p.id === id)
            if (index !== -1) {
              projects.value[index] = mappedProject
            }
          }

          if (currentProject.value?.id === id) {
            currentProject.value = mappedProject
          }

          return mappedProject
        }

        return null
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
        }

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

    const clearCurrentProject = () => {
      currentProject.value = null
    }

    const invalidateCache = () => {
      lastFetch.value = null
      console.debug('🗑️ Cache invalidated')
    }

    const refreshProjects = () => {
      return fetchProjects(true)
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
    const isCached = computed(() => projects.value && isCacheValid())

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
      clearCurrentProject,
      invalidateCache,
      refreshProjects,
      cleanup,

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
