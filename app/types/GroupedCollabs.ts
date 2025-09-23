import type { Database } from '~~/database/types'

type ProfileSubset = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'username' | 'avatar_url' | 'id' | 'full_name'
>

export type GroupedCollabs = {
  [key: string]: ProfileSubset[]
}
