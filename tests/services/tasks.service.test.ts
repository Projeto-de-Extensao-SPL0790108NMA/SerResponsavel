import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TasksService } from '@/services/tasks.service'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('TasksService', () => {
  let tasksService: TasksService
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

    tasksService = new TasksService(mockSupabase)
  })

  describe('getTasksWithProjects', () => {
    it('should get all tasks with project information', async () => {
      const mockTasks = [
        {
          id: 1,
          name: 'Task 1',
          status: 'in-progress',
          projects: { id: 1, name: 'Project 1', slug: 'project-1' },
        },
        {
          id: 2,
          name: 'Task 2',
          status: 'completed',
          projects: { id: 2, name: 'Project 2', slug: 'project-2' },
        },
      ]

      const selectMock = vi.fn().mockResolvedValue({ data: mockTasks, error: null })
      mockSupabase.from = vi.fn().mockReturnValue({ select: selectMock })

      const result = await tasksService.getTasksWithProjects()

      expect(mockSupabase.from).toHaveBeenCalledWith('tasks')
      expect(selectMock).toHaveBeenCalledWith(`
      *,
      projects (
        id,
        name,
        slug
      )
    `)
      expect(result).toEqual(mockTasks)
    })

    it('should throw error when getting tasks fails', async () => {
      const selectMock = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      })
      mockSupabase.from = vi.fn().mockReturnValue({ select: selectMock })

      await expect(tasksService.getTasksWithProjects()).rejects.toThrow('Database error')
    })
  })

  describe('getTask', () => {
    it('should get task by id with project information', async () => {
      const mockTask = {
        id: 1,
        name: 'Test Task',
        status: 'in-progress',
        projects: { id: 1, name: 'Test Project', slug: 'test-project' },
      }

      const singleMock = vi.fn().mockResolvedValue({ data: mockTask, error: null })
      const eqMock = vi.fn().mockReturnValue({ single: singleMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockSupabase.from = vi.fn().mockReturnValue({ select: selectMock })

      const result = await tasksService.getTask(1)

      expect(mockSupabase.from).toHaveBeenCalledWith('tasks')
      expect(selectMock).toHaveBeenCalledWith(`
        *,
        projects (
          id,
          name,
          slug
        )
      `)
      expect(eqMock).toHaveBeenCalledWith('id', 1)
      expect(result).toEqual(mockTask)
    })
  })

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData = {
        name: 'New Task',
        description: 'A new task',
        status: 'in-progress' as const,
        project_id: 1,
        profile_id: 'user-123',
      }
      const mockCreatedTask = { id: 1, ...taskData }

      const singleMock = vi.fn().mockResolvedValue({ data: mockCreatedTask, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })
      mockSupabase.from = vi.fn().mockReturnValue({ insert: insertMock })

      const result = await tasksService.createTask(taskData)

      expect(mockSupabase.from).toHaveBeenCalledWith('tasks')
      expect(insertMock).toHaveBeenCalledWith(taskData)
      expect(result).toEqual(mockCreatedTask)
    })

    it('should throw error when create task fails', async () => {
      const taskData = {
        name: 'New Task',
        status: 'in-progress' as const,
        profile_id: 'user-123',
      }

      const singleMock = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Creation failed'),
      })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })
      mockSupabase.from = vi.fn().mockReturnValue({ insert: insertMock })

      await expect(tasksService.createTask(taskData)).rejects.toThrow('Creation failed')
    })
  })

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updates = { name: 'Updated Task', status: 'completed' as const }
      const mockUpdatedTask = { id: 1, ...updates }

      const singleMock = vi.fn().mockResolvedValue({ data: mockUpdatedTask, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockSupabase.from = vi.fn().mockReturnValue({ update: updateMock })

      const result = await tasksService.updateTask(1, updates)

      expect(mockSupabase.from).toHaveBeenCalledWith('tasks')
      expect(updateMock).toHaveBeenCalledWith(updates)
      expect(eqMock).toHaveBeenCalledWith('id', 1)
      expect(result).toEqual(mockUpdatedTask)
    })
  })

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const eqMock = vi.fn().mockResolvedValue({ data: null, error: null })
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockSupabase.from = vi.fn().mockReturnValue({ delete: deleteMock })

      const result = await tasksService.deleteTask(1)

      expect(mockSupabase.from).toHaveBeenCalledWith('tasks')
      expect(deleteMock).toHaveBeenCalled()
      expect(eqMock).toHaveBeenCalledWith('id', 1)
      expect(result).toBeNull()
    })

    it('should throw error when delete task fails', async () => {
      const eqMock = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Delete failed'),
      })
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockSupabase.from = vi.fn().mockReturnValue({ delete: deleteMock })

      await expect(tasksService.deleteTask(1)).rejects.toThrow('Delete failed')
    })
  })
})
