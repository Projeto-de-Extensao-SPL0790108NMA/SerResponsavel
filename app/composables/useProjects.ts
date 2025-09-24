import { ProjectsService } from '@/services/projects.service'

export const useProjects = () => {
  const supabase = useSupabaseClient()
  const projectsService = new ProjectsService(supabase)

  const getProjects = async (status: 'in-progress' | 'completed' | 'all' = 'all') => {
    try {
      const data = await projectsService.getProjects(status)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const getProject = async (slug: string) => {
    try {
      const data = await projectsService.getProject(slug)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const createProject = async (project: {
    name: string
    slug: string
    description?: string
    status?: 'in-progress' | 'completed'
    collaborators?: string[]
  }) => {
    try {
      const data = await projectsService.createProject(project)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updateProject = async (
    id: number,
    updates: {
      name?: string
      slug?: string
      description?: string
      status?: 'in-progress' | 'completed'
      collaborators?: string[]
    },
  ) => {
    try {
      const data = await projectsService.updateProject(id, updates)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const deleteProject = async (id: number) => {
    try {
      const data = await projectsService.deleteProject(id)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const getCountConcludedProjects = async () => {
    try {
      const data = await projectsService.getCountConcludedProjects()
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getCountConcludedProjects,
  }
}
