import { useAuthStore } from '@/stores/auth'
import type { User } from '@supabase/supabase-js'
import type { Database } from '~~/database/types'

export const useProfile = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const authStore = useAuthStore()

  const buildProfilePayload = (supabaseUser: User) => {
    const metadata = supabaseUser.user_metadata ?? {}
    const sanitize = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[^\w]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()

    const baseUsernameCandidates = [
      metadata.user_name,
      metadata.preferred_username,
      metadata.username,
      metadata.full_name,
      metadata.name,
      metadata.nickname,
      supabaseUser.email?.split('@')[0],
    ].filter((candidate): candidate is string => Boolean(candidate && candidate.length))

    const baseUsername = sanitize(
      baseUsernameCandidates[0] ?? `usuario-${supabaseUser.id.slice(0, 6)}`,
    )

    const fullNameCandidates = [
      metadata.full_name,
      metadata.name,
      metadata.user_name,
      metadata.nickname,
      supabaseUser.email,
    ].filter((candidate): candidate is string => Boolean(candidate && candidate.length))

    const fullName = fullNameCandidates[0] ?? 'Usuário'

    const avatarUrl =
      (metadata.avatar_url as string | undefined) ?? (metadata.avatar as string | undefined) ?? null

    return {
      baseUsername: baseUsername || `usuario-${supabaseUser.id.slice(0, 6)}`,
      fullName,
      avatarUrl,
    }
  }

  const createProfileIfMissing = async (supabaseUser: User) => {
    const { baseUsername, fullName, avatarUrl } = buildProfilePayload(supabaseUser)

    const generateUsername = (attempt: number) => {
      if (attempt === 0) return baseUsername
      const suffix = Math.random().toString(36).slice(2, 6)
      return `${baseUsername}-${suffix}`
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const usernameCandidate = generateUsername(attempt)
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: supabaseUser.id,
          username: usernameCandidate,
          full_name: fullName,
          avatar_url: avatarUrl,
          role: 'member',
        })
        .select('*')
        .single()

      if (!error && data) {
        authStore.setProfile(data)
        return { data, error: null }
      }

      if (error?.code === '23505') {
        // username já em uso, tenta novamente
        continue
      }

      console.error('Error creating profile:', error)
      return { data: null, error }
    }

    const uniqueError = new Error('Não foi possível criar o perfil automaticamente.')
    console.error(uniqueError)
    return { data: null, error: uniqueError }
  }

  const fetchCurrentUserProfile = async () => {
    if (!user.value) {
      return { data: null, error: new Error('User not authenticated') }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return await createProfileIfMissing(user.value)
        }

        console.error('Error fetching profile:', error)
        return { data: null, error }
      }

      // Salvar na store
      authStore.setProfile(data)

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error }
    }
  }

  const updateProfile = async (updates: Database['public']['Tables']['profiles']['Update']) => {
    if (!user.value) {
      return { data: null, error: new Error('User not authenticated') }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return { data: null, error }
      }

      // Atualizar na store
      authStore.updateProfile(data)

      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  return {
    fetchCurrentUserProfile,
    updateProfile,
  }
}
