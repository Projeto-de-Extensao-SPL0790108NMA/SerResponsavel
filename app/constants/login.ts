import type { Database } from '~~/database/types'

export const informativeCards = [
  {
    icon: 'mdi-chart-line',
    title: '90%',
    subtitle: 'dos brasileiros consideram RSC na escolha de empresas',
    color: 'primary',
  },
  {
    icon: 'mdi-currency-usd',
    title: 'R$ 2,5bi',
    subtitle: 'mercado de investimentos sociais na região Norte',
    color: 'success',
  },
  {
    icon: 'mdi-rocket-launch',
    title: 'Pioneiro',
    subtitle: 'unifica gestão acadêmica e corporativa',
    color: 'info',
  },
]

type Project = Database['public']['Tables']['projects']['Row']

export const createStatisticsCards = (projects: Project[] | null) => [
  {
    icon: 'mdi-check-circle',
    title: projects?.filter((p: Project) => p?.status === 'completed').length || 0,
    subtitle: 'Projetos Concluídos',
    color: 'success',
  },
  {
    icon: 'mdi-progress-clock',
    title: projects?.filter((p: Project) => p?.status === 'in-progress').length || 0,
    subtitle: 'Em Andamento',
    color: 'primary',
  },
  {
    icon: 'mdi-account-group',
    title:
      projects?.reduce((total: number, p: Project) => total + (p?.collaborators?.length || 0), 0) ||
      0,
    subtitle: 'Colaboradores',
    color: 'info',
  },
]

export const targetAudienceCards = [
  {
    icon: 'mdi-office-building',
    title: '500+',
    subtitle: 'Empresas médio/grande porte na região Norte',
    color: 'primary',
  },
  {
    icon: 'mdi-hand-heart',
    title: '200+',
    subtitle: 'ONGs e organizações do terceiro setor',
    color: 'success',
  },
  {
    icon: 'mdi-school',
    title: '50+',
    subtitle: 'Instituições de ensino superior',
    color: 'info',
  },
  {
    icon: 'mdi-account-multiple',
    title: '2Mi+',
    subtitle: 'Potenciais beneficiários na região',
    color: 'warning',
  },
]
