/**
 * UI Types - RespSoc Project
 * Global types for UI components
 */

export type CardData = {
  icon: string
  color?: string
  title: string | number
  subtitle: string
  to?: string
  section?: string
}

export type CardSize = 'normal' | 'big'

export type CardProps = {
  cardData: CardData
  size?: CardSize
  animated?: boolean
  clickable?: boolean
}
