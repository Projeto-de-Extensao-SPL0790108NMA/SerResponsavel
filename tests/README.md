# Tests Documentation

Este diretório contém todos os testes da aplicação RespSoc.

## 🧪 Estrutura de Testes

```
tests/
├── services/          # Testes unitários para services
│   ├── auth.service.test.ts
│   ├── projects.service.test.ts
│   └── tasks.service.test.ts
├── composables/       # Testes unitários para composables
│   ├── useAuth.test.ts
│   └── useProjects.test.ts
├── stores/           # Testes de integração para stores
│   └── projects.store.test.ts
├── setup.ts          # Configuração global dos testes
└── README.md         # Esta documentação
```

## 🚀 Comandos de Teste

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar testes com interface visual
pnpm test:ui

# Executar testes com coverage
pnpm test:coverage

# Executar testes uma única vez
pnpm test:run
```

## 🔧 Configuração

### Framework: Vitest

- **Environment**: happy-dom (simulação leve do DOM)
- **Globals**: Habilitado (não precisa importar `describe`, `it`, `expect`)
- **Setup**: `tests/setup.ts` para mocks globais

### Dependências

- `vitest` - Framework de testes
- `@vue/test-utils` - Utilitários para testar componentes Vue
- `happy-dom` - Ambiente DOM leve para testes
- `@vitest/ui` - Interface visual para os testes

## 📋 Tipos de Teste

### 1. Services (Unidade)

Testam as classes de service que fazem comunicação com o Supabase:

- `AuthService` - Autenticação, registro, perfis
- `ProjectsService` - CRUD de projetos
- `TasksService` - CRUD de tasks

**Cobertura:**

- ✅ Métodos de sucesso
- ✅ Tratamento de erros
- ✅ Validação de parâmetros
- ✅ Retorno de dados

### 2. Composables (Unidade)

Testam a lógica de interface reativa dos composables:

- `useAuth` - Interface reativa para autenticação
- `useProjects` - Interface reativa para projetos

**Cobertura:**

- ✅ Estrutura de dados
- ✅ Tratamento de erros
- ✅ Validação de formulários

### 3. Stores (Integração)

Testam o estado global da aplicação:

- `projects.store` - Estado de projetos com cache e subscriptions

**Cobertura:**

- ✅ Estado inicial
- ✅ Ações (CRUD)
- ✅ Getters computados
- ✅ Cache management
- ✅ Error handling

## 🎯 Boas Práticas

### 1. Estrutura de Teste

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something successfully', () => {
      // Arrange - Setup
      // Act - Execute
      // Assert - Verify
    })

    it('should handle error case', () => {
      // Test error scenarios
    })
  })
})
```

### 2. Mocking

- Services: Mock do Supabase client
- Composables: Mock dos services
- Stores: Mock dos composables

### 3. Nomenclatura

- `should [action] [expected result]`
- `should handle [error case]`
- Descritivo e específico

## 🔍 Coverage

Para ver o relatório de cobertura:

```bash
pnpm test:coverage
```

O relatório será gerado em `coverage/index.html`

## 🐛 Debugging

Para debuggar testes:

1. Use `console.log()` nos testes
2. Execute `pnpm test:watch` para modo interativo
3. Use `pnpm test:ui` para interface visual
4. Adicione `--reporter=verbose` para mais detalhes

## 📝 Adicionando Novos Testes

1. Crie o arquivo de teste na pasta apropriada
2. Importe as dependências necessárias
3. Configure os mocks no `beforeEach`
4. Escreva os testes seguindo as boas práticas
5. Execute `pnpm test` para validar

Exemplo:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MyService } from '@/services/my.service'

describe('MyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should work correctly', () => {
    // Test implementation
  })
})
```
