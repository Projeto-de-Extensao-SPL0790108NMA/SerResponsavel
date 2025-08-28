import type { Projects, Project } from '@/services/supaQueries'

export const useProjects = () => {
  const supabase = useSupabaseClient()
  
  // Fetch all projects
  const getProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select()
    
    return { data: data as Projects, error }
  }
  
  // Fetch single project by slug with tasks
  const getProject = async (slug: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        tasks (
          id,
          name,
          status,
          due_date
        )
      `)
      .eq('slug', slug)
      .single()
    
    return { data: data as Project, error }
  }
  
  // Create new project
  const createProject = async (project: {
    name: string
    slug: string
    description?: string
    status?: 'in-progress' | 'completed'
    collaborators?: string[]
  }) => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    return { data, error }
  }
  
  // Update project
  const updateProject = async (id: number, updates: {
    name?: string
    slug?: string
    description?: string
    status?: 'in-progress' | 'completed'
    collaborators?: string[]
  }) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  }
  
  // Delete project
  const deleteProject = async (id: number) => {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    return { data, error }
  }
  
  return {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
  }
}