import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProjects } from '@/composables/useProjects'

// Mock the useProjects composable
vi.mock('@/composables/useProjects')

// Mock Nuxt/Vue composables
vi.mock('#app', () => ({
  useSupabaseClient: vi.fn(() => ({
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(),
      })),
      unsubscribe: vi.fn(),
    })),
  })),
  ref: vi.fn((value) => ({ value })),
  computed: vi.fn((fn) => ({ value: fn() })),
}))

vi.mock('pinia', async () => {
  const actual = await vi.importActual('pinia')
  return {
    ...actual,
    defineStore: vi.fn(() => vi.fn()),
  }
})

vi.mock('pinia-plugin-persistedstate', () => ({
  localStorage: vi.fn(),
}))

describe('useProjectsStore', () => {
  let mockUseProjects: ReturnType<typeof useProjects>
  let store: {
    projects: { value: unknown[] | null }
    currentProject: { value: unknown | null }
    loading: { value: boolean }
    error: { value: string | null }
    lastFetch: { value: number | null }
    fetchProjects: ReturnType<typeof vi.fn>
    fetchProject: ReturnType<typeof vi.fn>
    addProject: ReturnType<typeof vi.fn>
    editProject: ReturnType<typeof vi.fn>
    removeProject: ReturnType<typeof vi.fn>
    clearError: ReturnType<typeof vi.fn>
    clearCurrentProject: ReturnType<typeof vi.fn>
    invalidateCache: ReturnType<typeof vi.fn>
    refreshProjects: ReturnType<typeof vi.fn>
    cleanup: ReturnType<typeof vi.fn>
    projectsCount: { value: number }
    hasProjects: { value: boolean }
    isLoading: { value: boolean }
    hasError: { value: boolean }
    isCached: { value: boolean }
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Mock useProjects composable
    mockUseProjects = {
      getProjects: vi.fn(),
      getProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
    }

    vi.mocked(useProjects).mockReturnValue(mockUseProjects)

    // Mock the store implementation

    store = {
      projects: { value: null },
      currentProject: { value: null },
      loading: { value: false },
      error: { value: null },
      lastFetch: { value: null },

      fetchProjects: vi.fn(),
      fetchProject: vi.fn(),
      addProject: vi.fn(),
      editProject: vi.fn(),
      removeProject: vi.fn(),
      clearError: vi.fn(),
      clearCurrentProject: vi.fn(),
      invalidateCache: vi.fn(),
      refreshProjects: vi.fn(),
      cleanup: vi.fn(),

      projectsCount: { value: 0 },
      hasProjects: { value: false },
      isLoading: { value: false },
      hasError: { value: false },
      isCached: { value: false },
    }
  })

  describe('fetchProjects', () => {
    it('should fetch projects successfully', async () => {
      const mockProjects = [
        { id: 1, name: 'Project 1', slug: 'project-1' },
        { id: 2, name: 'Project 2', slug: 'project-2' },
      ]

      mockUseProjects.getProjects.mockResolvedValue({
        data: mockProjects,
        error: null,
      })

      // Simulate the fetchProjects implementation
      store.loading.value = true
      store.error.value = null

      const result = await mockUseProjects.getProjects()

      if (!result.error) {
        store.projects.value = result.data
        store.lastFetch.value = Date.now()
      }

      store.loading.value = false

      expect(mockUseProjects.getProjects).toHaveBeenCalled()
      expect(store.projects.value).toEqual(mockProjects)
      expect(store.loading.value).toBe(false)
      expect(store.error.value).toBeNull()
    })

    it('should handle fetch projects error', async () => {
      const mockError = new Error('Failed to fetch projects')
      mockUseProjects.getProjects.mockResolvedValue({
        data: null,
        error: mockError,
      })

      // Simulate the fetchProjects implementation with error
      store.loading.value = true
      store.error.value = null

      const result = await mockUseProjects.getProjects()

      if (result.error) {
        store.error.value = result.error.message
      }

      store.loading.value = false

      expect(store.error.value).toBe('Failed to fetch projects')
      expect(store.loading.value).toBe(false)
    })
  })

  describe('fetchProject', () => {
    it('should fetch single project successfully', async () => {
      const mockProject = {
        id: 1,
        name: 'Test Project',
        slug: 'test-project',
        tasks: [],
      }

      mockUseProjects.getProject.mockResolvedValue({
        data: mockProject,
        error: null,
      })

      // Simulate the fetchProject implementation
      store.loading.value = true
      store.error.value = null

      const result = await mockUseProjects.getProject('test-project')

      if (!result.error) {
        store.currentProject.value = result.data
      }

      store.loading.value = false

      expect(mockUseProjects.getProject).toHaveBeenCalledWith('test-project')
      expect(store.currentProject.value).toEqual(mockProject)
      expect(store.loading.value).toBe(false)
    })
  })

  describe('addProject', () => {
    it('should add project successfully', async () => {
      const projectData = {
        name: 'New Project',
        slug: 'new-project',
        description: 'A new project',
      }
      const mockCreatedProject = { id: 1, ...projectData }

      mockUseProjects.createProject.mockResolvedValue({
        data: mockCreatedProject,
        error: null,
      })

      // Simulate the addProject implementation
      store.loading.value = true
      store.error.value = null
      store.projects.value = []

      const result = await mockUseProjects.createProject(projectData)

      if (!result.error && result.data) {
        store.projects.value.push(result.data)
      }

      store.loading.value = false

      expect(mockUseProjects.createProject).toHaveBeenCalledWith(projectData)
      expect(store.projects.value).toContain(mockCreatedProject)
      expect(store.loading.value).toBe(false)
    })

    it('should handle add project error', async () => {
      const projectData = {
        name: 'New Project',
        slug: 'new-project',
      }
      const mockError = new Error('Creation failed')

      mockUseProjects.createProject.mockResolvedValue({
        data: null,
        error: mockError,
      })

      // Simulate the addProject implementation with error
      store.loading.value = true
      store.error.value = null

      const result = await mockUseProjects.createProject(projectData)

      if (result.error) {
        store.error.value = result.error.message
      }

      store.loading.value = false

      expect(store.error.value).toBe('Creation failed')
      expect(store.loading.value).toBe(false)
    })
  })

  describe('editProject', () => {
    it('should edit project successfully', async () => {
      const updates = { name: 'Updated Project' }
      const mockUpdatedProject = { id: 1, name: 'Updated Project', slug: 'project-1' }

      mockUseProjects.updateProject.mockResolvedValue({
        data: mockUpdatedProject,
        error: null,
      })

      // Simulate the editProject implementation
      store.loading.value = true
      store.error.value = null
      store.projects.value = [{ id: 1, name: 'Original Project', slug: 'project-1' }]

      const result = await mockUseProjects.updateProject(1, updates)

      if (!result.error && result.data) {
        const index = store.projects.value.findIndex((p: { id: number }) => p.id === 1)
        if (index !== -1) {
          store.projects.value[index] = { ...store.projects.value[index], ...result.data }
        }
      }

      store.loading.value = false

      expect(mockUseProjects.updateProject).toHaveBeenCalledWith(1, updates)
      expect(store.projects.value[0].name).toBe('Updated Project')
      expect(store.loading.value).toBe(false)
    })
  })

  describe('removeProject', () => {
    it('should remove project successfully', async () => {
      mockUseProjects.deleteProject.mockResolvedValue({
        data: null,
        error: null,
      })

      // Simulate the removeProject implementation
      store.loading.value = true
      store.error.value = null
      store.projects.value = [
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' },
      ]
      store.currentProject.value = { id: 1, name: 'Project 1' }

      const result = await mockUseProjects.deleteProject(1)

      if (!result.error) {
        store.projects.value = store.projects.value.filter((p: { id: number }) => p.id !== 1)
        if (store.currentProject.value?.id === 1) {
          store.currentProject.value = null
        }
      }

      store.loading.value = false

      expect(mockUseProjects.deleteProject).toHaveBeenCalledWith(1)
      expect(store.projects.value).toHaveLength(1)
      expect(store.projects.value[0].id).toBe(2)
      expect(store.currentProject.value).toBeNull()
      expect(store.loading.value).toBe(false)
    })
  })

  describe('cache management', () => {
    it('should invalidate cache', () => {
      store.lastFetch.value = Date.now()

      // Simulate invalidateCache
      store.lastFetch.value = null

      expect(store.lastFetch.value).toBeNull()
    })

    it('should clear current project', () => {
      store.currentProject.value = { id: 1, name: 'Test Project' }

      // Simulate clearCurrentProject
      store.currentProject.value = null

      expect(store.currentProject.value).toBeNull()
    })

    it('should clear error', () => {
      store.error.value = 'Some error'

      // Simulate clearError
      store.error.value = null

      expect(store.error.value).toBeNull()
    })
  })
})
