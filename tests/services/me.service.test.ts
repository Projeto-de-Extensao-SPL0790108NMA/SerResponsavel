import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MeService } from '@/services/me.service'
import type { SupabaseClient } from '@supabase/supabase-js'

const mockSupabaseClient = {
  functions: {
    invoke: vi.fn(),
  },
} as unknown as SupabaseClient

describe('MeService', () => {
  let meService: MeService

  beforeEach(() => {
    meService = new MeService(mockSupabaseClient)
    vi.clearAllMocks()
  })

  describe('getCurrentUser', () => {
    it('should fetch current user data successfully', async () => {
      const mockResponse = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          email_confirmed_at: '2023-01-01T00:00:00Z',
          last_sign_in_at: '2023-01-01T12:00:00Z',
          created_at: '2023-01-01T00:00:00Z',
        },
        profile: {
          id: 'user-123',
          username: 'testuser',
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg',
          bio: 'Test bio',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      }

      vi.mocked(mockSupabaseClient.functions.invoke).mockResolvedValue({
        data: mockResponse,
        error: null,
      })

      const result = await meService.getCurrentUser()

      expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith('me', {
        method: 'GET',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error')

      vi.mocked(mockSupabaseClient.functions.invoke).mockResolvedValue({
        data: null,
        error: mockError,
      })

      await expect(meService.getCurrentUser()).rejects.toThrow('API Error')

      expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith('me', {
        method: 'GET',
      })
    })

    it('should handle network errors', async () => {
      vi.mocked(mockSupabaseClient.functions.invoke).mockRejectedValue(new Error('Network error'))

      await expect(meService.getCurrentUser()).rejects.toThrow('Network error')
    })
  })
})
