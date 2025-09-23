import { vi } from 'vitest'
import { ref, reactive, computed, readonly } from 'vue'

// Export real Vue functions for tests to use
export { ref, reactive, computed, readonly }

// Mock Nuxt composables
vi.mock('#app', () => ({
  useSupabaseClient: vi.fn(() => ({
    auth: {},
    from: vi.fn(),
  })),
  useRouter: vi.fn(),
  useRoute: vi.fn(),
  navigateTo: vi.fn(),
}))

// Mock @vueuse
vi.mock('@vueuse/core', () => ({
  watchDebounced: vi.fn(),
}))

// Mock Pinia
vi.mock('pinia', () => ({
  defineStore: vi.fn(),
  storeToRefs: vi.fn(),
  setActivePinia: vi.fn(),
  createPinia: vi.fn(),
}))

// Mock pinia-plugin-persistedstate
vi.mock('pinia-plugin-persistedstate', () => ({
  default: {
    localStorage: vi.fn(),
  },
}))

// Global test setup
beforeEach(() => {
  vi.clearAllMocks()
})
