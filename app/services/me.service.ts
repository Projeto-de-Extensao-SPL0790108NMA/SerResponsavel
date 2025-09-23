import type { SupabaseClient } from '@supabase/supabase-js'

interface MeResponse {
  user: {
    id: string
    email: string
    email_confirmed_at: string
    last_sign_in_at: string
    created_at: string
  }
  profile: {
    id: string
    username: string
    full_name: string
    avatar_url?: string
    bio?: string
    created_at: string
    updated_at: string
  }
}

export class MeService {
  constructor(private supabase: SupabaseClient) {}

  async getCurrentUser(): Promise<MeResponse> {
    const { data, error } = await this.supabase.functions.invoke('me', {
      method: 'GET',
    })

    if (error) throw error
    return data as MeResponse
  }
}
