import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProjectsService } from '@/services/projects.service'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('ProjectsService', () => {
  let projectsService: ProjectsService
  let mockSupabase: SupabaseClient

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(),
            })),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(),
        })),
      })),
    } as unknown as SupabaseClient

    projectsService = new ProjectsService(mockSupabase)
  })

  describe('getProjects', () => {
    it('should get all projects successfully', async () => {
      const mockProjects = [
        { id: 1, name: 'Project 1', slug: 'project-1' },
        { id: 2, name: 'Project 2', slug: 'project-2' },
      ]

      const selectMock = vi.fn().mockResolvedValue({ data: mockProjects, error: null })
      mockSupabase.from = vi.fn().mockReturnValue({ select: selectMock })

      const result = await projectsService.getProjects()

      expect(mockSupabase.from).toHaveBeenCalledWith('projects')
      expect(selectMock).toHaveBeenCalled()
      expect(result).toEqual(mockProjects)
    })

    it('should throw error when get projects fails', async () => {
      const selectMock = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      })
      mockSupabase.from = vi.fn().mockReturnValue({ select: selectMock })

      await expect(projectsService.getProjects()).rejects.toThrow('Database error')
    })
  })

  describe('getProject', () => {
    it('should get project by slug with tasks', async () => {
      const mockProject = {
        id: 1,
        name: 'Test Project',
        slug: 'test-project',
        tasks: [{ id: 1, name: 'Task 1', status: 'in-progress', due_date: null }],
      }

      const singleMock = vi.fn().mockResolvedValue({ data: mockProject, error: null })
      const eqMock = vi.fn().mockReturnValue({ single: singleMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockSupabase.from = vi.fn().mockReturnValue({ select: selectMock })

      const result = await projectsService.getProject('test-project')

      expect(mockSupabase.from).toHaveBeenCalledWith('projects')
      expect(selectMock).toHaveBeenCalledWith(`
        *,
        tasks (
          id,
          name,
          status,
          due_date
        )
      `)
      expect(eqMock).toHaveBeenCalledWith('slug', 'test-project')
      expect(result).toEqual(mockProject)
    })
  })

  describe('createProject', () => {
    it('should create project successfully', async () => {
      const projectData = {
        name: 'New Project',
        slug: 'new-project',
        description: 'A new project',
        status: 'in-progress' as const,
      }
      const mockCreatedProject = { id: 1, ...projectData }

      const singleMock = vi.fn().mockResolvedValue({ data: mockCreatedProject, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })
      mockSupabase.from = vi.fn().mockReturnValue({ insert: insertMock })

      const result = await projectsService.createProject(projectData)

      expect(mockSupabase.from).toHaveBeenCalledWith('projects')
      expect(insertMock).toHaveBeenCalledWith(projectData)
      expect(result).toEqual(mockCreatedProject)
    })

    it('should throw error when create project fails', async () => {
      const projectData = {
        name: 'New Project',
        slug: 'new-project',
      }

      const singleMock = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Creation failed'),
      })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })
      mockSupabase.from = vi.fn().mockReturnValue({ insert: insertMock })

      await expect(projectsService.createProject(projectData)).rejects.toThrow('Creation failed')
    })
  })

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      const updates = { name: 'Updated Project', status: 'completed' as const }
      const mockUpdatedProject = { id: 1, ...updates }

      const singleMock = vi.fn().mockResolvedValue({ data: mockUpdatedProject, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockSupabase.from = vi.fn().mockReturnValue({ update: updateMock })

      const result = await projectsService.updateProject(1, updates)

      expect(mockSupabase.from).toHaveBeenCalledWith('projects')
      expect(updateMock).toHaveBeenCalledWith(updates)
      expect(eqMock).toHaveBeenCalledWith('id', 1)
      expect(result).toEqual(mockUpdatedProject)
    })
  })

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      const eqMock = vi.fn().mockResolvedValue({ data: null, error: null })
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockSupabase.from = vi.fn().mockReturnValue({ delete: deleteMock })

      const result = await projectsService.deleteProject(1)

      expect(mockSupabase.from).toHaveBeenCalledWith('projects')
      expect(deleteMock).toHaveBeenCalled()
      expect(eqMock).toHaveBeenCalledWith('id', 1)
      expect(result).toBeNull()
    })

    it('should throw error when delete project fails', async () => {
      const eqMock = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Delete failed'),
      })
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockSupabase.from = vi.fn().mockReturnValue({ delete: deleteMock })

      await expect(projectsService.deleteProject(1)).rejects.toThrow('Delete failed')
    })
  })
})
