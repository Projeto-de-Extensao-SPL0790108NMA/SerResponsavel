<p style="text-align: center;">
  <img src="./public/uninorte-logo.png" alt="Logo Uninorte" width="300">
</p>

<a id="pt-br"></a>

## 🌐 Language / Idioma

<div style="text-align: center;">

| Language         | Link                         |
| ---------------- | ---------------------------- |
| 🇧🇷 **Português** | **[Você está aqui](#pt-br)** |
| 🇺🇸 **English**   | **[Click here](#en-us)**     |

</div>

---

## SerResponsável

<p style="text-align: center;">
  <img src="./app/assets/img/logoserresp300_299.png" alt="Logo SerResponsável" width="150">
</p>

#### (disponível em https://ser-responsavel.vercel.app/)

[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)](https://github.com/tiagobrilhante/RespSoc)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.0.3-00DC82?logo=nuxt.js)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Uma plataforma de divulgação e promoção de ações voltadas à Responsabilidade Social de instituições públicas e privadas.

## 📑 Índice

- [📋 Sobre o Projeto](#sobre-projeto)
- [🎯 Objetivos](#objetivos)
- [🚀 Tecnologias](#tecnologias)
- [🗓️ Roadmap](#roadmap)
- [🔧 Setup de Desenvolvimento](#setup-desenvolvimento)
- [📋 Padrões e Boas Práticas](#padroes-boas-praticas)
- [🤝 Contribuição](#contribuicao)
- [📄 Licença](#licenca)
- [👥 Equipe](#equipe)
- [📞 Contato](#contato)

<a id="sobre-projeto"></a>

## 📋 Sobre o Projeto

O **SerResponsável** é um projeto de extensão da Faculdade Uninorte que tem como objetivo criar uma plataforma digital para conectar instituições que desenvolvem ações de responsabilidade social com a comunidade. A plataforma visa aumentar a visibilidade dessas iniciativas, promover o engajamento social e facilitar a participação da sociedade em projetos de impacto positivo.

Este projeto integra as disciplinas:

- **Projeto de Extensão**
- **DevOps Tools**
- **Fábrica de Software**
- **Tópicos Avançados de Ciência da Computação**

<a id="objetivos"></a>

## 🎯 Objetivos

- Centralizar informações sobre ações de responsabilidade social
- Facilitar a descoberta de projetos sociais pela comunidade
- Promover maior engajamento entre instituições e sociedade
- Criar uma rede colaborativa de responsabilidade social
- Aumentar o impacto e alcance das iniciativas sociais

<a id="tecnologias"></a>

## 🚀 Tecnologias

Este projeto está sendo desenvolvido com tecnologias modernas e robustas:

- **Frontend:** Nuxt 4 + Vue 3 + TypeScript
- **UI Framework:** Vuetify 3 (Material Design)
- **Backend/Database:** Supabase (PostgreSQL + Auth + Real-time)
- **Estado:** Pinia com persistência
- **Testes:** Vitest + @vue/test-utils (em progresso)
- **Qualidade de Código:** ESLint + Prettier + Husky
- **CI/CD:** GitHub Actions (planejado)

- **Deploy:** Vercel (planejado)

<a id="roadmap"></a>

## 🗓️ Roadmap

### 📅 Cronograma de Desenvolvimento

#### **Fase 1: Fundação** _(Concluída)_

- ✅ Definição da stack tecnológica
- ✅ Configuração da infraestrutura base
- ✅ Setup inicial do projeto
- ✅ Modelagem do banco de dados
- 📋 Configuração de CI/CD com GitHub Actions

#### **Fase 2: Core Features** _(Em andamento)_

- ✅ Sistema de autenticação (Supabase Auth)
- 🔄 CRUD de perfis de usuários
- 🔄 CRUD de projetos sociais
- 🔲 Sistema de busca e filtros
- 🔲 Dashboard administrativo

#### **Fase 3: Funcionalidades Avançadas**

- 🔲 Sistema de avaliações e comentários
- 🔲 Notificações em tempo real
- 🔲 Upload e galeria de imagens
- 🔲 Relatórios e analytics
- 🔲 API pública para integrações

#### **Fase 4: Otimização e Deploy**

- 🔲 Testes automatizados completos
- 🔲 Otimização de performance
- 🔲 Acessibilidade (WCAG)
- 🔲 Deploy em produção
- 🔲 Monitoramento e logs

### 🎯 Objetivos por Disciplina

**Projeto de Extensão:**

- Conectar instituições com a comunidade
- Criar impacto social mensurável

**DevOps Tools:**

- Pipeline CI/CD automatizado
- Monitoramento e observabilidade

**Fábrica de Software:**

- Metodologias ágeis
- Qualidade de código e testes

**Tópicos Avançados:**

- Arquitetura moderna e escalável
- Performance e otimizações
  <a id="setup-desenvolvimento"></a>

## 🔧 Setup de Desenvolvimento

### Pré-requisitos

- Node.js 18+
- pnpm (gerenciador de pacotes)
- Conta no Supabase (https://supabase.com)
- Supabase CLI instalado globalmente: `npm install -g @supabase/supabase-js`

### Instalação

```bash
# Clonar o repositório
git clone [url-do-repositorio]

# Instalar dependências
pnpm install

# Ativar hooks do Husky
pnpm prepare

# Iniciar servidor de desenvolvimento
pnpm dev
```

O projeto estará disponível em `http://localhost:3000`

### Configuração do Supabase

```bash
# Fazer login no Supabase
pnpm supabase:login

# Vincular ao projeto (substituir pela sua referência de projeto)
pnpm supabase:link

# Aplicar migrações do banco de dados
pnpm db:reset

# Gerar tipos TypeScript do banco
pnpm supabase:types

# Popular banco com dados iniciais (opcional)
pnpm db:seed
```

**Variáveis de ambiente necessárias:**
Crie um arquivo `.env` na raiz do projeto:

```
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_do_supabase # use apenas em ambiente local
TESTING_USER_EMAIL=email_para_seed_opcional
TESTING_USER_PASSWORD=senha_para_seed_opcional
```

> ⚠️ **Importante**: nunca exponha a `SUPABASE_SERVICE_ROLE_KEY` fora do ambiente local. Ela é utilizada apenas pelos scripts de seed (`pnpm db:seed`).

### Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # Servidor de desenvolvimento
pnpm build            # Build de produção
pnpm preview          # Preview do build

# Qualidade de código
pnpm lint             # Verificar código
pnpm lint:fix         # Corrigir problemas automaticamente
pnpm format           # Formatar código
pnpm typecheck        # Verificação de tipos

# Comandos do banco de dados
pnpm db:migrate:new   # Criar nova migração
pnpm db:reset         # Resetar banco para última migração
pnpm db:seed          # Popular banco com dados iniciais
pnpm supabase:types   # Gerar tipos TypeScript do schema

# Testes
pnpm test             # Executar todos os testes
pnpm test:watch       # Executar testes em modo watch

pnpm test:coverage    # Executar testes com cobertura
pnpm test:ui          # Interface visual dos testes
```

<a id="padroes-boas-praticas"></a>

## 📋 Padrões e Boas Práticas

Este projeto adota rigorosos padrões de desenvolvimento para garantir qualidade, consistência e manutenibilidade do código:

### Idioma do Projeto

**IMPORTANTE:** Este projeto utiliza **inglês (en-US)** como idioma padrão para desenvolvimento:

- **Código**: Variáveis, funções, componentes, comentários em inglês
- **Commits**: Mensagens de commit em inglês seguindo Conventional Commits
- **Documentação técnica**: APIs, JSDoc, README técnico em inglês
- **Testes**: Descrições e casos de teste em inglês

**Exemplo correto:**

```typescript
// ✅ Correto (inglês)
const userProfile = ref<UserProfile | null>(null)
const isAuthenticated = computed(() => !!userProfile.value)

// ❌ Incorreto (português)
const perfilUsuario = ref<PerfilUsuario | null>(null)
const estaAutenticado = computed(() => !!perfilUsuario.value)
```

### Conventional Commits

Utilizamos o padrão **Conventional Commits** para mensagens de commit estruturadas e semânticas **em inglês**:

```bash
feat: add user authentication system
fix: resolve form validation issues
docs: update API documentation
style: apply prettier formatting
refactor: reorganize component structure
test: add unit tests for ProfileService
```

**Tipos de commit suportados:**

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `style`: formatação (sem mudança de lógica)
- `refactor`: refatoração de código
- `test`: adição ou correção de testes
- `chore`: tarefas de manutenção

### Estratégia de Testes (Planejado)

O projeto implementará uma estratégia robusta de testes automatizados com **Vitest**:

- **Testes Unitários**: Componentes Vue, composables e utilitários
- **Testes de Integração**: Fluxos completos de funcionalidades
- **Testing Library**: Testes focados na experiência do usuário
- **Cobertura de Código**: Monitoramento da qualidade dos testes
- **Testes E2E**: Playwright para testes de interface completos
- **Automação CI/CD**: Execução automática em PRs e deploys

**Benefícios da automação:**

- Validação contínua da qualidade do código
- Detecção precoce de regressões
- Confiança para refatorações
- Documentação viva do comportamento esperado

### Git Hooks com Husky

O projeto utiliza **Husky** para automação de verificações antes dos commits:

- **pre-commit**: Executa lint-staged para validar apenas arquivos modificados
- **pre-push**: Executa suite de testes para garantir estabilidade
- **commit-msg**: Valida se a mensagem segue o padrão Conventional Commits

### Lint-Staged

Aplicação automática de ferramentas de qualidade apenas nos arquivos modificados:

- **JavaScript/TypeScript/Vue**: ESLint com correção automática
- **JSON/Markdown/CSS/YAML**: Prettier para formatação consistente

### Qualidade de Código

- **ESLint**: Análise estática com regras do Nuxt + Prettier
- **TypeScript**: Verificação rigorosa de tipos em tempo de desenvolvimento
- **Prettier**: Formatação automática e consistente do código
- **Sass**: Pré-processador CSS para estilos organizados

### Estrutura de Desenvolvimento

- **Monorepo**: Configuração com pnpm workspace
- **Hot Reload**: Desenvolvimento com recarga automática
- **Type Safety**: TypeScript em todo o projeto com tipos gerados do Supabase
- **Component Library**: Vuetify 3 para UI consistente e acessível
  <a id="contribuicao"></a>

## 🤝 Contribuição

Este é um projeto acadêmico, mas contribuições são bem-vindas! Siga estas diretrizes:

### Como Contribuir

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças seguindo Conventional Commits
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. Abra um **Pull Request**

### Diretrizes de Código

- Siga os padrões de código estabelecidos (ESLint + Prettier)
- Escreva commits seguindo Conventional Commits
- Adicione testes para novas funcionalidades
- Mantenha a cobertura de testes acima de 80%
- Documente APIs e componentes complexos

### Tipos de Contribuição

- 🐛 **Bug fixes**: Correção de problemas existentes
- ✨ **Features**: Novas funcionalidades
- 📚 **Documentação**: Melhorias na documentação
- 🎨 **UI/UX**: Melhorias na interface
- ⚡ **Performance**: Otimizações
- ♿ **Acessibilidade**: Melhorias de acessibilidade

### Reportar Issues

- Use o template de issue disponível
- Inclua steps para reproduzir o problema
- Adicione screenshots se aplicável
- Especifique browser/OS quando relevante
  <a id="licenca"></a>

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

A licença MIT permite:

- ✅ Uso comercial
- ✅ Modificação
- ✅ Distribuição

- ✅ Uso privado

Requer apenas:

- 📄 Incluir a licença original

- 📄 Incluir o copyright

<a id="equipe"></a>

## 👥 Equipe

Projeto desenvolvido pelo aluno Tiago Brilhante da Faculdade Uninorte como parte das disciplinas de extensão e tecnologia.

<a id="contato"></a>

## 📞 Contato

Para mais informações sobre o projeto ou oportunidades de colaboração, entre em contato através do email [contato@stdout.dev.br](mailto:contato@stdout.dev.br).

---

_Projeto em desenvolvimento - Mais informações serão adicionadas conforme o progresso._

---

<a id="en-us"></a>

# English Version

<p style="text-align: center;">
  <img src="./public/uninorte-logo.png" alt="Uninorte Logo" width="300">
</p>

## 🌐 Language / Idioma

<div style="text-align: center;">

| Language         | Link                       |
| ---------------- | -------------------------- |
| 🇧🇷 **Português** | **[Clique aqui](#pt-br)**  |
| 🇺🇸 **English**   | **[You are here](#en-us)** |

</div>

---

## SerResponsável

<p style="text-align: center;">
  <img src="./app/assets/img/logoserresp300_299.png" alt="Logo SerResponsável" width="150">
</p>

#### (available at https://ser-responsavel.vercel.app/)

[![Status](https://img.shields.io/badge/Status-In%20Development-orange)](https://github.com/tiagobrilhante/RespSoc)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.0.3-00DC82?logo=nuxt.js)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A platform for promoting and disseminating Social Responsibility actions by public and private institutions.

## 📑 Table of Contents

- [📋 About the Project](#about-project)
- [🎯 Objectives](#objectives-en)

- [🚀 Technologies](#technologies-en)
- [🗓️ Roadmap](#roadmap-en)
- [🔧 Development Setup](#development-setup)
- [📋 Standards and Best Practices](#standards-best-practices)
- [🤝 Contributing](#contributing)
- [📄 License](#license)
- [👥 Team](#team)
- [📞 Contact](#contact)

<a id="about-project"></a>

## 📋 About the Project

**SerResponsável** is an extension project from Uninorte College that aims to create a digital platform to connect institutions developing social responsibility actions with the community. The platform seeks to increase the visibility of these initiatives, promote social engagement, and facilitate society's participation in positive impact projects.

This project integrates the following disciplines:

- **Extension Project**
- **DevOps Tools**
- **Software Factory**
- **Advanced Topics in Computer Science**

<a id="objectives-en"></a>

## 🎯 Objectives

- Centralize information about social responsibility actions
- Facilitate the discovery of social projects by the community
- Promote greater engagement between institutions and society
- Create a collaborative network for social responsibility
- Increase the impact and reach of social initiatives
  <a id="technologies-en"></a>

## 🚀 Technologies

This project is being developed with modern and robust technologies:

- **Frontend:** Nuxt 4 + Vue 3 + TypeScript
- **UI Framework:** Vuetify 3 (Material Design)
- **Backend/Database:** Supabase (PostgreSQL + Auth + Real-time)
- **State Management:** Pinia with persistence
- **Testing:** Vitest + @vue/test-utils (in progress)
- **Code Quality:** ESLint + Prettier + Husky
- **CI/CD:** GitHub Actions (planned)
- **Deploy:** Vercel (planned)
  <a id="roadmap-en"></a>

## 🗓️ Roadmap

### 📅 Development Timeline

#### **Phase 1: Foundation** _(Completed)_

- ✅ Technology stack definition
- ✅ Base infrastructure configuration
- ✅ Initial project setup
- ✅ Database modeling
- 📋 CI/CD configuration with GitHub Actions

#### **Phase 2: Core Features** _(In Progress)_

- ✅ Authentication system (Supabase Auth)
- 🔄 User profile CRUD
- 🔄 Social project CRUD
- 🔲 Search and filter system
- 🔲 Administrative dashboard

#### **Phase 3: Advanced Features**

- 🔲 Rating and comment system
- 🔲 Real-time notifications
- 🔲 Image upload and gallery
- 🔲 Reports and analytics
- 🔲 Public API for integrations

#### **Phase 4: Optimization and Deploy**

- 🔲 Complete automated testing
- 🔲 Performance optimization
- 🔲 Accessibility (WCAG)
- 🔲 Production deployment
- 🔲 Monitoring and logging

### 🎯 Objectives by Discipline

**Extension Project:**

- Connect institutions with the community
- Create measurable social impact

**DevOps Tools:**

- Automated CI/CD pipeline
- Monitoring and observability

**Software Factory:**

- Agile methodologies
- Code quality and testing

**Advanced Topics:**

- Modern and scalable architecture
- Performance and optimizations

<a id="development-setup"></a>

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- pnpm (package manager)
- Supabase account (https://supabase.com)
- Supabase CLI installed globally: `npm install -g @supabase/supabase-js`

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
pnpm install

# Enable Husky git hooks
pnpm prepare

# Start development server
pnpm dev
```

The project will be available at `http://localhost:3000`

### Supabase Configuration

```bash
# Login to Supabase
pnpm supabase:login

# Link to project (replace with your project reference)
pnpm supabase:link

# Apply database migrations
pnpm db:reset

# Generate TypeScript types from database
pnpm supabase:types

# Populate database with initial data (optional)
pnpm db:seed
```

**Required environment variables:**
Create a `.env` file in the project root:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key # local use only
TESTING_USER_EMAIL=optional_seed_user_email
TESTING_USER_PASSWORD=optional_seed_user_password
```

> ⚠️ **Important**: never expose `SUPABASE_SERVICE_ROLE_KEY` in public environments. It is used only by local seed scripts (`pnpm db:seed`).

### Useful Commands

```bash
# Development
pnpm dev              # Development server
pnpm build            # Production build
pnpm preview          # Preview production build

# Code quality
pnpm lint             # Check code
pnpm lint:fix         # Fix issues automatically
pnpm format           # Format code
pnpm typecheck        # Type checking


# Database commands
pnpm db:migrate:new   # Create new migration
pnpm db:reset         # Reset database to latest migration
pnpm db:seed          # Populate database with initial data
pnpm supabase:types   # Generate TypeScript types from schema

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
pnpm test:ui          # Visual test interface
```

<a id="standards-best-practices"></a>

## 📋 Standards and Best Practices

This project adopts rigorous development standards to ensure quality, consistency, and code maintainability:

### Project Language

**IMPORTANT:** This project uses **English (en-US)** as the default language for development:

- **Code:** Variables, functions, components, comments in English
- **Commits:** Commit messages in English following Conventional Commits
- **Technical documentation:** APIs, JSDoc, technical README in English
- **Tests:** Test descriptions and cases in English

**Correct example:**

```typescript
// ✅ Correct (English)
const userProfile = ref<UserProfile | null>(null)
const isAuthenticated = computed(() => !!userProfile.value)

// ❌ Incorrect (Portuguese)
const perfilUsuario = ref<PerfilUsuario | null>(null)
const estaAutenticado = computed(() => !!perfilUsuario.value)
```

### Conventional Commits

We use the **Conventional Commits** standard for structured and semantic commit messages **in English**:

```bash
feat: add user authentication system
fix: resolve form validation issues
docs: update API documentation
style: apply prettier formatting
refactor: reorganize component structure
test: add unit tests for ProfileService
```

**Supported commit types:**

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation
- `style`: formatting (no logic change)
- `refactor`: code refactoring
- `test`: adding or fixing tests
- `chore`: maintenance tasks

### Testing Strategy (Planned)

The project will implement a robust automated testing strategy with **Vitest**:

- **Unit Tests:** Vue components, composables, and utilities
- **Integration Tests:** Complete functionality flows
- **Testing Library:** User experience-focused tests
- **Code Coverage:** Test quality monitoring
- **E2E Tests:** Complete interface tests with Playwright
- **CI/CD Automation:** Automatic execution on PRs and deploys

**Automation benefits:**

- Continuous code quality validation
- Early regression detection
- Confidence for refactoring
- Living documentation of expected behavior

### Git Hooks with Husky

The project uses **Husky** for pre-commit verification automation:

- **pre-commit:** Executes lint-staged to validate only modified files
- **pre-push:** Executes test suite to ensure stability
- **commit-msg:** Validates if the message follows Conventional Commits standard

### Lint-Staged

Automatic application of quality tools only on modified files:

- **JavaScript/TypeScript/Vue:** ESLint with automatic correction
- **JSON/Markdown/CSS/YAML:** Prettier for consistent formatting

### Code Quality

- **ESLint:** Static analysis with Nuxt + Prettier rules
- **TypeScript:** Rigorous type checking at development time
- **Prettier:** Automatic and consistent code formatting
- **Sass:** CSS preprocessor for organized styles

### Development Structure

- **Monorepo:** Configuration with pnpm workspace
- **Hot Reload:** Development with automatic reload
- **Type Safety:** TypeScript throughout the project with types generated from Supabase
- **Component Library:** Vuetify 3 for consistent and accessible UI

<a id="contributing"></a>

## 🤝 Contributing

This is an academic project, but contributions are welcome! Follow these guidelines:

### How to Contribute

1. **Fork** the project
2. Create a **branch** for your feature (`git checkout -b feature/new-feature`)
3. **Commit** your changes following Conventional Commits
4. **Push** to the branch (`git push origin feature/new-feature`)
5. Open a **Pull Request**

### Code Guidelines

- Follow established code standards (ESLint + Prettier)
- Write commits following Conventional Commits
- Add tests for new features
- Maintain test coverage above 80%
- Document APIs and complex components

### Types of Contribution

- 🐛 **Bug fixes:** Fixing existing problems
- ✨ **Features:** New functionalities
- 📚 **Documentation:** Documentation improvements
- 🎨 **UI/UX:** Interface improvements
- ⚡ **Performance:** Optimizations
- ♿ **Accessibility:** Accessibility improvements

### Reporting Issues

- Use the available issue template
- Include steps to reproduce the problem
- Add screenshots if applicable
- Specify browser/OS when relevant

<a id="license"></a>

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

The MIT license allows:

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

Requires only:

- 📄 Include the original license
- 📄 Include the copyright

<a id="team"></a>

## 👥 Team

Project developed by student Tiago Brilhante from Uninorte College as part of extension and technology disciplines.

<a id="contact"></a>

## 📞 Contact

For more information about the project or collaboration opportunities, contact via email [contato@stdout.dev.br](mailto:contato@stdout.dev.br).

---

_Project under development - More information will be added as progress is made._

Todo poder emana do código
