import type { LoginForm, RegisterForm } from '@/types/AuthForm'
import type { SupabaseClient } from '@supabase/supabase-js'

export class AuthService {
  constructor(private supabase: SupabaseClient) {}

  async register(formData: RegisterForm) {
    const { data, error } = await this.supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (error) throw error

    if (data.user) {
      const { error: profileError } = await this.supabase.from('profiles').insert({
        id: data.user.id,
        username: formData.username,
        full_name: formData.firstName.concat(' ', formData.lastName),
      })

      if (profileError) throw profileError
    }

    return data
  }

  async login(formData: LoginForm) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) throw error
    return data
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
    return true
  }

  async getProfile(params: { column: string; value: string }) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select()
      .eq(params.column, params.value)
      .single()

    if (error) throw error
    return data
  }

  async getProfiles() {
    const { data, error } = await this.supabase.from('profiles').select('id, full_name')

    if (error) throw error
    return data
  }

  async getGroupedProfiles(userIds: string[]) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('username, avatar_url, id, full_name')
      .in('id', userIds)

    if (error) throw error
    return data
  }
}
