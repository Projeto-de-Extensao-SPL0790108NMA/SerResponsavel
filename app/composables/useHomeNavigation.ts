/**
 * Composable para gerenciar navegação dinâmica da home
 * Controla qual seção está ativa e transições
 */

export type HomeSection = 'profile' | 'projects' | 'reports' | null

export const useHomeNavigation = () => {
  const activeSection = ref<HomeSection>(null)
  const isTransitioning = ref(false)

  /**
   * Ativa uma seção ou a fecha se já estiver ativa
   */
  const toggleSection = (section: Exclude<HomeSection, null>) => {
    if (activeSection.value === section) {
      closeSection()
    } else {
      openSection(section)
    }
  }

  /**
   * Abre uma seção específica
   */
  const openSection = (section: Exclude<HomeSection, null>) => {
    isTransitioning.value = true

    void nextTick().then(() => {
      activeSection.value = section
      setTimeout(() => {
        isTransitioning.value = false
      }, 300) // Duração da transição
    })
  }

  /**
   * Fecha a seção ativa
   */
  const closeSection = () => {
    isTransitioning.value = true
    activeSection.value = null

    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  }

  /**
   * Verifica se uma seção está ativa
   */
  const isActive = (section: Exclude<HomeSection, null>) => {
    return activeSection.value === section
  }

  /**
   * Verifica se há alguma seção aberta
   */
  const hasActiveSection = computed(() => {
    return activeSection.value !== null
  })

  return {
    // Estado
    activeSection: readonly(activeSection),
    isTransitioning: readonly(isTransitioning),
    hasActiveSection,

    // Ações
    toggleSection,
    openSection,
    closeSection,
    isActive,
  }
}
