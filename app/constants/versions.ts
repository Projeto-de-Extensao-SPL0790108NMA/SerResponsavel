export interface VersionInfo {
  version: string
  date: string
  highlights?: string
  changes: string[]
}

export const versions: VersionInfo[] = [
  {
    version: '1.0.0-alpha.133',
    date: '2025-01-04',
    highlights:
      'Organizações agora registram endereço completo via CEP e leitura do changelog ficou mais acessível.',
    changes: [
      'Migration adiciona campos de endereço à tabela de organizações e atualiza os tipos TypeScript.',
      'Formulário de edição consulta a BrasilAPI pelo CEP, preenche logradouro/bairro/cidade/UF e salva no banco.',
      'Listagem e detalhes exibem o endereço formatado e permitem busca por esses campos.',
      'Histórico de versões ganhou ação “Ver mais/Ver menos”, com cores ajustadas para ambos os temas.',
      'Projetos passam a registrar cidade/UF herdando o endereço da organização, com possibilidade de ajuste no cadastro.',
    ],
  },
  {
    version: '1.0.0-alpha.132',
    date: '2025-01-04',
    highlights:
      'Comentários integrados aos projetos, autocadastro completo e reforço de segurança em organizações.',
    changes: [
      'Criação da tabela de comentários de projetos, summaries agregados e atualização do RPC `get_projects_with_feedback` para devolver ratings e comentários em uma única requisição.',
      'Formulário de comentários com modo compacto, toggles de exibição e reaproveitamento do fingerprint de avaliações, eliminando fetchs redundantes.',
      'Fluxo de autocadastro com validações em tempo real, campos para bio e avatar, e reutilização do modal de autenticação para alternar entre login e cadastro.',
      'Policies de RLS nas organizações para impedir edição/remoção por membros e UI condicionada ao papel do usuário.',
    ],
  },
  {
    version: '1.0.0-alpha.129',
    date: '2025-10-03',
    highlights:
      'Ratings e reações agora têm fluxos separados, consolidados em lote, e policies ajustadas para buckets de imagens.',
    changes: [
      'Listagem de projetos ativos consome summaries de avaliações em carregamento único.',
      'Stores separam notas de reações, reutilizam identidade (committed/anon) e eliminam requisições duplicadas.',
      'View `project_rating_summaries` e policies dos buckets `project-covers` e `organizations-logo` atualizadas.',
    ],
  },
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
