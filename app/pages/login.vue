<script lang="ts" setup>
// Use the projects store
const projectsStore = useProjectsStore()
const { projects, loading, error, isCached } = storeToRefs(projectsStore)
const { fetchProjects, refreshProjects, invalidateCache } = projectsStore

// Slider images
const slides = [
  { src: '/slides/TROTE-LEGAL.jpeg', alt: 'Trote Legal - Projeto Social' },
  { src: '/slides/bike-sem-barreiras-768x576.jpg', alt: 'Bike Sem Barreiras' },
  { src: '/slides/ser-leitor-768x576.jpg', alt: 'Ser Leitor - Projeto de Leitura' },
  { src: '/slides/ser11.jpeg', alt: 'Projeto SerResponsável' },
]

const currentSlide = ref(0)

// Auto-advance slides
const startSlideShow = () => {
  setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 7000) // Change slide every 4 seconds
}

// Load projects when page mounts
onMounted(async () => {
  await fetchProjects()
  startSlideShow()
})

// SEO
useSeoMeta({
  title: 'SerResponsável - Plataforma de Transparência e Gestão de Responsabilidade Social',
  description:
    'Primeira plataforma brasileira que unifica gestão acadêmica e corporativa de responsabilidade social. Centraliza, gerencia e mensura ações de empresas, ONGs, instituições de ensino e poder público. Ranqueamento baseado em impacto real verificado.',
  keywords:
    'responsabilidade social, ESG, transparência social, impacto social, sustentabilidade, Uninorte, Amazonas',
  ogTitle: 'SerResponsável - Transparência Social Verificada',
  ogDescription:
    'Transforme sua gestão de responsabilidade social com ranqueamento de impacto real, certificação digital e dashboard ESG automatizado.',
  ogImage: '~/assets/img/logoSer.png',
})
</script>

<template>
  <v-container class="page-container">
    <!-- Hero Section -->
    <v-row class="text-center mb-6">
      <v-col>
        <v-img
          src="~/assets/img/logoSer.png"
          alt="SerResponsável Logo"
          max-width="200"
          class="mx-auto mb-4 rounded-xl"
        />
        <h1 class="text-h3 font-weight-bold mb-4 text-primary">SerResponsável</h1>
        <h2 class="text-h5 mb-4 text-grey-lighten-1">
          Plataforma de Transparência e Gestão de Responsabilidade Social
        </h2>
        <p class="text-h6 mb-6 text-grey-lighten-2">Uninorte - Centro Universitário do Norte</p>
      </v-col>
    </v-row>

    <v-row>
      <!-- Login Section - Sidebar -->
      <v-col cols="12" lg="4">
        <v-card elevation="3" class="login-card pa-6 sticky-login">
          <v-card-title class="text-center mb-4 text-white">
            <v-icon icon="mdi-login" class="me-2" color="primary" />
            Acesse a Plataforma
          </v-card-title>
          <v-form>
            <v-text-field
              label="Email ou CPF"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-account"
              class="mb-2"
              required
            />
            <v-text-field
              label="Senha"
              density="compact"
              variant="outlined"
              prepend-inner-icon="mdi-lock"
              type="password"
              class="mb-2"
              required
            />
            <v-btn color="primary" size="small" block class="mb-3" prepend-icon="mdi-login">
              Entrar
            </v-btn>
            <v-btn
              variant="outlined"
              size="small"
              block
              class="mb-4"
              prepend-icon="mdi-account-plus"
            >
              Criar Conta
            </v-btn>
            <div class="text-center">
              <v-btn
                variant="text"
                size="small"
                prepend-icon="mdi-help-circle"
                class="text-grey-lighten-1"
              >
                Esqueci minha senha
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" lg="8">
        <v-card elevation="2" class="mission-card pa-6 mb-6">
          <v-card-text class="mission-text">
            <v-icon icon="mdi-target" color="primary" class="me-2" />
            <strong class="text-white">Missão:</strong>
            <span class="text-grey-lighten-1">
              Centralizar, gerenciar e mensurar ações de responsabilidade social de empresas, ONGs,
              instituições de ensino e poder público, criando um ecossistema completo de
              transparência social.
            </span>
          </v-card-text>
        </v-card>

        <v-row class="mb-6">
          <v-col cols="12" md="4">
            <v-card color="primary" variant="tonal" class="text-center pa-4">
              <v-icon icon="mdi-chart-line" size="32" class="mb-2" />
              <div class="text-h6">90%</div>
              <div class="text-caption">dos brasileiros consideram RSC na escolha de empresas</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="success" variant="tonal" class="text-center pa-4">
              <v-icon icon="mdi-currency-usd" size="32" class="mb-2" />
              <div class="text-h6">R$ 2,5bi</div>
              <div class="text-caption">mercado de investimentos sociais na região Norte</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="info" variant="tonal" class="text-center pa-4">
              <v-icon icon="mdi-rocket-launch" size="32" class="mb-2" />
              <div class="text-h6">Pioneiro</div>
              <div class="text-caption">unifica gestão acadêmica e corporativa</div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Image Slider Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card elevation="2" class="slider-card">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon icon="mdi-image-multiple" class="me-2" color="primary" />
            Projetos em Destaque
          </v-card-title>
          <v-card-text class="pa-0">
            <div class="slider-container">
              <div class="slider-wrapper">
                <div
                  v-for="(slide, index) in slides"
                  :key="index"
                  class="slide"
                  :class="{ active: index === currentSlide }"
                >
                  <v-img
                    :src="slide.src"
                    :alt="slide.alt"
                    aspect-ratio="2.5"
                    cover
                    class="slide-image"
                  />
                  <div class="slide-overlay">
                    <div class="slide-content">
                      <h3 class="text-h5 text-white font-weight-bold mb-2">
                        {{ slide.alt }}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Slider Controls -->
              <div class="slider-controls">
                <v-btn
                  icon
                  size="small"
                  class="control-btn prev"
                  @click="currentSlide = (currentSlide - 1 + slides.length) % slides.length"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  class="control-btn next"
                  @click="currentSlide = (currentSlide + 1) % slides.length"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>

              <!-- Slider Indicators -->
              <div class="slider-indicators">
                <button
                  v-for="(slide, index) in slides"
                  :key="index"
                  class="indicator"
                  :class="{ active: index === currentSlide }"
                  @click="currentSlide = index"
                />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Projects Management Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-folder-multiple" class="me-2" />
            Projetos de Responsabilidade Social
          </v-card-title>
          <v-card-subtitle>
            Gerencie e acompanhe todas as iniciativas sociais da instituição
          </v-card-subtitle>

          <v-card-actions class="pa-4">
            <v-spacer />
            <v-chip :color="isCached ? 'success' : 'info'" size="small" class="me-2">
              <v-icon :icon="isCached ? 'mdi-database' : 'mdi-cloud-sync'" start />
              {{ isCached ? 'Cache Ativo' : 'Sincronizando' }}
            </v-chip>
            <v-btn
              variant="outlined"
              size="small"
              class="me-2"
              :loading="loading"
              prepend-icon="mdi-refresh"
              @click="refreshProjects"
            >
              Atualizar
            </v-btn>
            <v-btn
              variant="outlined"
              color="warning"
              size="small"
              prepend-icon="mdi-cached"
              @click="invalidateCache"
            >
              Limpar Cache
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Loading State -->
        <v-card v-if="loading" class="mb-4" elevation="1">
          <v-card-text class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" size="48" />
            <div class="mt-4 text-h6">Carregando projetos sociais...</div>
            <p class="text-body-2 text-grey-darken-1 mt-2">
              Buscando as últimas iniciativas de responsabilidade social
            </p>
          </v-card-text>
        </v-card>

        <!-- Error State -->
        <v-alert v-if="error" type="error" class="mb-4 custom-alert" variant="tonal">
          <v-icon icon="mdi-alert-circle" />
          <strong>Erro ao carregar projetos:</strong> {{ error }}
        </v-alert>

        <!-- Projects Display -->
        <v-card v-if="!loading && projects" elevation="1">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon icon="mdi-view-list" class="me-2" />
            Projetos Ativos ({{ projects?.length || 0 }})
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-0">
            <div v-if="projects?.length === 0" class="text-center pa-8">
              <v-icon
                icon="mdi-folder-open-outline"
                size="64"
                color="grey-lighten-1"
                class="mb-4"
              />
              <h3 class="text-h6 mb-2">Nenhum projeto encontrado</h3>
              <p class="text-body-2 text-grey-darken-1">
                Comece criando seu primeiro projeto de responsabilidade social
              </p>
              <v-btn color="primary" class="mt-4" prepend-icon="mdi-plus"> Criar Projeto </v-btn>
            </div>

            <v-list v-else lines="three">
              <template v-for="(project, index) in projects" :key="project?.id || index">
                <v-list-item class="pa-4">
                  <template #prepend>
                    <v-avatar color="primary" class="me-3">
                      <v-icon icon="mdi-handshake" />
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-h6 mb-1">
                    {{ project?.name || 'Projeto sem nome' }}
                  </v-list-item-title>

                  <v-list-item-subtitle class="mb-2">
                    {{ project?.description || 'Sem descrição disponível' }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="d-flex flex-column align-end">
                      <v-chip
                        :color="project?.status === 'completed' ? 'success' : 'primary'"
                        size="small"
                        class="mb-2"
                      >
                        <v-icon
                          :icon="
                            project?.status === 'completed'
                              ? 'mdi-check-circle'
                              : 'mdi-progress-clock'
                          "
                          start
                        />
                        {{ project?.status === 'completed' ? 'Concluído' : 'Em Andamento' }}
                      </v-chip>
                      <v-btn variant="outlined" size="small" prepend-icon="mdi-eye">
                        Ver Detalhes
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
                <v-divider v-if="index < (projects?.length || 0) - 1" />
              </template>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Statistics Cards -->
        <v-row class="mt-6">
          <v-col cols="12" md="4">
            <v-card color="success" variant="tonal" class="text-center">
              <v-card-text>
                <v-icon icon="mdi-check-circle" size="48" class="mb-2" />
                <div class="text-h4">
                  {{ projects?.filter((p) => p?.status === 'completed').length || 0 }}
                </div>
                <div class="text-subtitle-1">Projetos Concluídos</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="primary" variant="tonal" class="text-center">
              <v-card-text>
                <v-icon icon="mdi-progress-clock" size="48" class="mb-2" />
                <div class="text-h4">
                  {{ projects?.filter((p) => p?.status === 'in-progress').length || 0 }}
                </div>
                <div class="text-subtitle-1">Em Andamento</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="info" variant="tonal" class="text-center">
              <v-card-text>
                <v-icon icon="mdi-account-group" size="48" class="mb-2" />
                <div class="text-h4">
                  {{
                    projects?.reduce((total, p) => total + (p?.collaborators?.length || 0), 0) || 0
                  }}
                </div>
                <div class="text-subtitle-1">Colaboradores</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Platform Benefits Section -->
        <v-card class="mt-8 mb-4" elevation="2">
          <v-card-title class="d-flex align-center pa-6">
            <v-icon icon="mdi-star" class="me-2" color="primary" />
            Diferenciais da Plataforma
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-list>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-trophy" color="warning" />
                    </template>
                    <v-list-item-title
                      >Sistema de ranqueamento baseado em impacto real verificado</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-gamepad-variant" color="success" />
                    </template>
                    <v-list-item-title
                      >Gamificação e sistema de recompensas para engajamento</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-api" color="info" />
                    </template>
                    <v-list-item-title
                      >Integração com APIs governamentais para validação</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-certificate" color="primary" />
                    </template>
                    <v-list-item-title
                      >Certificação digital verificável de impacto</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-chart-donut" color="secondary" />
                    </template>
                    <v-list-item-title>Dashboard ESG automatizado para empresas</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-account-network" color="success" />
                    </template>
                    <v-list-item-title
                      >Primeira plataforma híbrida acadêmico-corporativa</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Target Audience Section -->
        <v-card class="mb-4" elevation="2">
          <v-card-title class="d-flex align-center pa-6">
            <v-icon icon="mdi-account-group" class="me-2" color="primary" />
            Público-Alvo
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-card color="primary" variant="tonal" class="text-center pa-4">
                  <v-icon icon="mdi-office-building" size="48" class="mb-2" />
                  <div class="text-h6 mb-2">500+</div>
                  <div class="text-body-2">Empresas médio/grande porte na região Norte</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card color="success" variant="tonal" class="text-center pa-4">
                  <v-icon icon="mdi-hand-heart" size="48" class="mb-2" />
                  <div class="text-h6 mb-2">200+</div>
                  <div class="text-body-2">ONGs e organizações do terceiro setor</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card color="info" variant="tonal" class="text-center pa-4">
                  <v-icon icon="mdi-school" size="48" class="mb-2" />
                  <div class="text-h6 mb-2">50+</div>
                  <div class="text-body-2">Instituições de ensino superior</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card color="warning" variant="tonal" class="text-center pa-4">
                  <v-icon icon="mdi-account-multiple" size="48" class="mb-2" />
                  <div class="text-h6 mb-2">2Mi+</div>
                  <div class="text-body-2">Potenciais beneficiários na região</div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Raw Data (for debugging) - Hidden by default -->
        <v-expansion-panels v-show="false" class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon icon="mdi-bug" class="me-2" />
              Dados de Debug (Desenvolvimento)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre class="text-caption">{{ JSON.stringify(projects, null, 2) }}</pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.page-container {
  position: relative;
  z-index: 1;
}

.login-card {
  background: rgba(33, 38, 45, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px !important;
}

.sticky-login {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.mission-card {
  background: rgba(33, 38, 45, 0.9) !important;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.mission-text {
  font-size: 1.1rem;
  line-height: 1.6;
}

.custom-alert {
  background: rgba(244, 67, 54, 0.15) !important;
  border: 1px solid rgba(244, 67, 54, 0.3) !important;
  color: #ffcdd2 !important;
}

.custom-alert strong {
  color: #ffffff !important;
}

/* Global rounded styles */
:deep(.v-card) {
  border-radius: 16px !important;
}

:deep(.v-btn) {
  border-radius: 12px !important;
}

:deep(.v-text-field .v-field) {
  border-radius: 12px !important;
}

:deep(.v-chip) {
  border-radius: 10px !important;
}

:deep(.v-alert) {
  border-radius: 12px !important;
}

:deep(.v-avatar) {
  border-radius: 12px !important;
}

:deep(.v-expansion-panel) {
  border-radius: 12px !important;
}

:deep(.v-progress-circular) {
  filter: drop-shadow(0 0 8px rgba(25, 118, 210, 0.4));
}

/* Enhanced visual effects */
:deep(.v-card) {
  background: rgba(33, 38, 45, 0.8) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.v-card--variant-tonal) {
  backdrop-filter: blur(10px);
}

/* Improved button styles */
:deep(.v-btn--variant-outlined) {
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
}

:deep(.v-btn--variant-outlined:hover) {
  background: rgba(255, 255, 255, 0.05);
}

/* Text field improvements */
:deep(.v-text-field--variant-outlined .v-field) {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.v-text-field--variant-outlined .v-field:hover) {
  border-color: rgba(25, 118, 210, 0.5);
}

/* Glassmorphism effect for chips */
:deep(.v-chip) {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(8px);
}

/* Enhanced shadows */
:deep(.v-card) {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
}

:deep(.v-btn) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

/* Logo styling */
:deep(.v-img) {
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Slider Styles */
.slider-card {
  background: rgba(33, 38, 45, 0.9) !important;
  border: 1px solid rgba(25, 118, 210, 0.2);
  overflow: hidden;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 0 0 16px 16px;
}

.slider-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide.active {
  opacity: 1;
  transform: translateX(0);
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.slide-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  padding: 32px 24px 24px;
}

.slide-content {
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.6s ease 0.2s;
}

.slide.active .slide-content {
  transform: translateY(0);
  opacity: 1;
}

/* Slider Controls */
.slider-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  pointer-events: none;
}

.control-btn {
  pointer-events: all;
  background: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(25, 118, 210, 0.8) !important;
  border-color: rgba(25, 118, 210, 0.8);
  transform: scale(1.1);
}

/* Slider Indicators */
.slider-indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: rgba(25, 118, 210, 0.9);
  border-color: rgba(25, 118, 210, 0.9);
  transform: scale(1.2);
}

.indicator:hover {
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .slider-container {
    height: 250px;
  }

  .slide-overlay {
    padding: 20px 16px 16px;
  }

  .slide-content h3 {
    font-size: 1.1rem;
  }
}
</style>
