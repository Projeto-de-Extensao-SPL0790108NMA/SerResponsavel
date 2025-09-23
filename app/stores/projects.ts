import type { Projects, Project } from '@/types/supabase'

export const useProjectsStore = defineStore(
  'projects',
  () => {
    // State
    const projects = ref<Projects | null>(null)
    const currentProject = ref<Project | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const lastFetch = ref<number | null>(null)
    const cacheTime = 5 * 60 * 1000 // 5 minutes in milliseconds

    // Real-time subscription refs
    const projectsSubscription = ref<ReturnType<typeof useSupabaseClient>['channel'] | null>(null)
    const currentProjectSubscription = ref<ReturnType<typeof useSupabaseClient>['channel'] | null>(
      null,
    )

    // Actions using the composable
    const { getProjects, getProject, createProject, updateProject, deleteProject } = useProjects()

    // Check if cache is still valid
    const isCacheValid = () => {
      if (!lastFetch.value) return false
      return Date.now() - lastFetch.value < cacheTime
    }

    // Setup real-time subscription for projects
    const setupProjectsSubscription = () => {
      if (projectsSubscription.value || import.meta.server) return

      const supabase = useSupabaseClient()
      projectsSubscription.value = supabase
        .channel('projects-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
          console.log('🔄 Projects changed:', payload)
          // Invalidate cache and refetch
          lastFetch.value = null
          fetchProjects(true) // Force refresh
        })
        .subscribe()
    }

    // Fetch all projects with cache logic
    const fetchProjects = async (forceRefresh = false) => {
      // Check cache first (unless forced refresh)
      if (!forceRefresh && projects.value && isCacheValid()) {
        console.log('📦 Using cached projects')
        return
      }

      loading.value = true
      error.value = null

      try {
        console.log('🌐 Fetching projects from Supabase')
        const { data, error: supabaseError } = await getProjects()

        if (supabaseError) {
          error.value = supabaseError.message
          return
        }

        projects.value = data
        lastFetch.value = Date.now()

        // Setup subscription after first successful fetch
        setupProjectsSubscription()
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      } finally {
        loading.value = false
      }
    }

    // Fetch single project
    const fetchProject = async (slug: string) => {
      loading.value = true
      error.value = null

      try {
        const { data, error: supabaseError } = await getProject(slug)

        if (supabaseError) {
          error.value = supabaseError.message
          return
        }

        currentProject.value = data
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      } finally {
        loading.value = false
      }
    }

    // Create new project
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
          error.value = supabaseError.message
          return null
        }

        // Add to local state
        if (projects.value && data) {
          projects.value.push(data)
        }

        return data
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error occurred'
        return null
      } finally {
        loading.value = false
      }
    }

    // Update existing project
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
          error.value = supabaseError.message
          return null
        }

        // Update local state
        if (projects.value && data) {
          const index = projects.value.findIndex((p) => p.id === id)
          if (index !== -1) {
            projects.value[index] = { ...projects.value[index], ...data }
          }
        }

        // Update current project if it's the same
        if (currentProject.value?.id === id && data) {
          currentProject.value = { ...currentProject.value, ...data }
        }

        return data
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Unknown error occurred'
        return null
      } finally {
        loading.value = false
      }
    }

    // Delete project
    const removeProject = async (id: number) => {
      loading.value = true
      error.value = null

      try {
        const { error: supabaseError } = await deleteProject(id)

        if (supabaseError) {
          error.value = supabaseError.message
          return false
        }

        // Remove from local state
        if (projects.value) {
          projects.value = projects.value.filter((p) => p.id !== id)
        }

        // Clear current project if it's the deleted one
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

    // Clear error
    const clearError = () => {
      error.value = null
    }

    // Clear current project
    const clearCurrentProject = () => {
      currentProject.value = null
    }

    // Invalidate cache - force next fetch to hit Supabase
    const invalidateCache = () => {
      lastFetch.value = null
      console.log('🗑️ Cache invalidated')
    }

    // Refresh projects - force refresh from Supabase
    const refreshProjects = () => {
      return fetchProjects(true)
    }

    // Cleanup subscriptions (for component unmount)
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

    // Getters
    const projectsCount = computed(() => projects.value?.length ?? 0)
    const hasProjects = computed(() => projectsCount.value > 0)
    const isLoading = computed(() => loading.value)
    const hasError = computed(() => !!error.value)
    const isCached = computed(() => projects.value && isCacheValid())

    return {
      // State
      projects,
      currentProject,
      lastFetch,
      loading,
      error,

      // Actions
      fetchProjects,
      fetchProject,
      addProject,
      editProject,
      removeProject,
      clearError,
      clearCurrentProject,
      invalidateCache,
      refreshProjects,
      cleanup,

      // Getters
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

// HMR (Hot Module Replacement) support
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot))
}
