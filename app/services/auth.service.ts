import type { LoginForm, RegisterForm } from '@/types/AuthForm'
import type { Provider, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/database/types'
import { throwServiceError } from '@/utils/serviceLogger'

export class AuthService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async register(formData: RegisterForm) {
    const { data, error } = await this.supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (error) throwServiceError('AuthService.register', error)

    if (data.user) {
      const { error: profileError } = await this.supabase.from('profiles').insert({
        id: data.user.id,
        username: formData.username,
        full_name: formData.firstName.concat(' ', formData.lastName),
      })

      if (profileError) throwServiceError('AuthService.register.profile', profileError)
    }

    return data
  }

  async login(formData: LoginForm) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) throwServiceError('AuthService.login', error)
    return data
  }

  async loginWithProvider(provider: Provider, redirectTo?: string) {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })

    if (error) throwServiceError('AuthService.loginWithProvider', error)
    return data
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throwServiceError('AuthService.logout', error)
    return true
  }

  async getProfile(params: { column: string; value: string }) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select()
      .eq(params.column, params.value)
      .single()

    if (error) throwServiceError('AuthService.getProfile', error)
    return data
  }

  async getProfiles() {
    const { data, error } = await this.supabase.from('profiles').select('id, full_name')

    if (error) throwServiceError('AuthService.getProfiles', error)
    return data
  }

  async getGroupedProfiles(userIds: string[]) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('username, avatar_url, id, full_name')
      .in('id', userIds)

    if (error) throwServiceError('AuthService.getGroupedProfiles', error)
    return data
  }
}
