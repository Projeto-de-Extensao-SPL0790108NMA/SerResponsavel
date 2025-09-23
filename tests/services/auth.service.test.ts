import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '@/services/auth.service'
import type { SupabaseClient } from '@supabase/supabase-js'

describe('AuthService', () => {
  let authService: AuthService
  let mockSupabase: SupabaseClient

  beforeEach(() => {
    mockSupabase = {
      auth: {
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(),
            })),
          })),
        })),
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
          })),
          in: vi.fn(),
        })),
      })),
    } as unknown as SupabaseClient

    authService = new AuthService(mockSupabase)
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      const formData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      }

      mockSupabase.auth.signUp = vi.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const insertMock = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from = vi.fn().mockReturnValue({ insert: insertMock })

      const result = await authService.register(formData)

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: formData.email,
        password: formData.password,
      })
      expect(insertMock).toHaveBeenCalledWith({
        id: mockUser.id,
        username: formData.username,
        full_name: 'Test User',
      })
      expect(result.user).toEqual(mockUser)
    })

    it('should throw error when auth signup fails', async () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      }

      mockSupabase.auth.signUp = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Signup failed'),
      })

      await expect(authService.register(formData)).rejects.toThrow('Signup failed')
    })
  })

  describe('login', () => {
    it('should login user successfully', async () => {
      const formData = { email: 'test@example.com', password: 'password123' }
      const mockAuthData = { user: { id: 'user-123' }, session: {} }

      mockSupabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
        data: mockAuthData,
        error: null,
      })

      const result = await authService.login(formData)

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith(formData)
      expect(result).toEqual(mockAuthData)
    })

    it('should throw error when login fails', async () => {
      const formData = { email: 'test@example.com', password: 'wrongpassword' }

      mockSupabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Invalid credentials'),
      })

      await expect(authService.login(formData)).rejects.toThrow('Invalid credentials')
    })
  })

  describe('logout', () => {
    it('should logout user successfully', async () => {
      mockSupabase.auth.signOut = vi.fn().mockResolvedValue({ error: null })

      const result = await authService.logout()

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should throw error when logout fails', async () => {
      mockSupabase.auth.signOut = vi.fn().mockResolvedValue({
        error: new Error('Logout failed'),
      })

      await expect(authService.logout()).rejects.toThrow('Logout failed')
    })
  })

  describe('getProfile', () => {
    it('should get profile by column and value', async () => {
      const mockProfile = { id: 'user-123', username: 'testuser' }
      const params = { column: 'id', value: 'user-123' }

      const singleMock = vi.fn().mockResolvedValue({ data: mockProfile, error: null })
      const eqMock = vi.fn().mockReturnValue({ single: singleMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockSupabase.from = vi.fn().mockReturnValue({ select: selectMock })

      const result = await authService.getProfile(params)

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
      expect(selectMock).toHaveBeenCalled()
      expect(eqMock).toHaveBeenCalledWith(params.column, params.value)
      expect(result).toEqual(mockProfile)
    })
  })

  describe('getProfiles', () => {
    it('should get all profiles', async () => {
      const mockProfiles = [
        { id: 'user-1', full_name: 'User One' },
        { id: 'user-2', full_name: 'User Two' },
      ]

      const selectMock = vi.fn().mockResolvedValue({ data: mockProfiles, error: null })
      mockSupabase.from = vi.fn().mockReturnValue({ select: selectMock })

      const result = await authService.getProfiles()

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
      expect(selectMock).toHaveBeenCalledWith('id, full_name')
      expect(result).toEqual(mockProfiles)
    })
  })

  describe('getGroupedProfiles', () => {
    it('should get profiles by user IDs', async () => {
      const mockProfiles = [
        { id: 'user-1', username: 'user1', avatar_url: null, full_name: 'User One' },
        { id: 'user-2', username: 'user2', avatar_url: null, full_name: 'User Two' },
      ]
      const userIds = ['user-1', 'user-2']

      const inMock = vi.fn().mockResolvedValue({ data: mockProfiles, error: null })
      const selectMock = vi.fn().mockReturnValue({ in: inMock })
      mockSupabase.from = vi.fn().mockReturnValue({ select: selectMock })

      const result = await authService.getGroupedProfiles(userIds)

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
      expect(selectMock).toHaveBeenCalledWith('username, avatar_url, id, full_name')
      expect(inMock).toHaveBeenCalledWith('id', userIds)
      expect(result).toEqual(mockProfiles)
    })
  })
})
