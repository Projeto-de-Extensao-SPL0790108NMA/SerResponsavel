export interface VersionInfo {
  version: string
  date: string
  highlights?: string
  changes: string[]
}

export const versions: VersionInfo[] = [
  {
    version: '1.0.0-alpha.126',
    date: '2025-10-03',
    highlights: 'Diálogo de histórico de versões e catálogo centralizado no footer.',
    changes: [
      'Adição do diálogo de versões no rodapé.',
      'Destacar release atual com lista colapsável para versões anteriores.',
      'Criação do arquivo de constantes com metadados das versões.',
    ],
  },
  {
    version: '1.0.0-alpha.70',
    date: '2025-02-10',
    highlights: 'Melhorias gerais de usabilidade e correções de bugs.',
    changes: [
      'Ajustes na experiência de onboarding para novos usuários.',
      'Correção de inconsistências na exibição de métricas do dashboard.',
      'Atualização de dependências críticas para maior segurança.',
    ],
  },
  {
    version: '1.0.0-alpha.69',
    date: '2025-01-28',
    highlights: 'Primeira entrega do fluxo de submissão de projetos.',
    changes: [
      'Inclusão de validações adicionais no formulário de projetos.',
      'Melhorias de performance na listagem de iniciativas.',
      'Refinamento do layout responsivo do portal público.',
    ],
  },
  {
    version: '1.0.0-alpha.68',
    date: '2025-01-12',
    highlights: 'Preparação para abertura da versão alpha pública.',
    changes: [
      'Integração inicial com serviços da Supabase para autenticação.',
      'Configuração dos componentes de tema claro/escuro.',
      'Documentação inicial do projeto dentro do repositório.',
    ],
  },
]
