<script lang="ts" setup>
// Imports
import { informativeCards, targetAudienceCards, createStatisticsCards } from '~/constants/login'

// Use the projects store
const projectsStore = useProjectsStore()
const { projects } = storeToRefs(projectsStore)

// Statistics cards computed from projects data
const statisticsCards = computed(() => createStatisticsCards(projects.value))

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
  ogImage: '/logoserresp600_598.png',
})
</script>

<template>
  <v-container class="page-container">
    <!-- Hero Section -->
    <v-row class="text-center mb-6">
      <v-col>
        <v-img
          src="~/assets/img/logoserresp600_598.png"
          alt="SerResponsável Logo"
          max-width="200"
          class="mx-auto mb-4"
        />
        <h1 class="text-h3 font-weight-bold mb-4 text-primary">SerResponsável</h1>
        <h2 class="text-h5 mb-4 text-grey-lighten-1">
          Plataforma de Transparência e Gestão de Responsabilidade Social
        </h2>
        <p class="text-h6 mb-6 text-grey-lighten-2">Uninorte - Centro Universitário do Norte</p>
      </v-col>
    </v-row>

    <!-- login and mission/info cards -->
    <v-row>
      <!-- Login Section -->
      <v-col cols="12" lg="4">
        <LoginComponent />
      </v-col>

      <!-- mission and info cards -->
      <v-col cols="12" lg="8">
        <!-- mission -->
        <v-card elevation="15" class="mission-card pa-6 mb-6" rounded="xl">
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

        <!-- info cards -->
        <v-row class="mb-6">
          <v-col v-for="(card, index) in informativeCards" :key="index" cols="12" md="4">
            <ui-simple-card :card-data="card" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Image Slider Section -->
    <v-row class="mt-2">
      <v-col cols="12">
        <SimpleSlider />
      </v-col>
    </v-row>

    <!-- Projects Management Section -->
    <v-row class="mt-4" dense>
      <v-col cols="12">
        <ListActiveProjects />
      </v-col>
    </v-row>

    <!-- statistics, benefits, and target audience cards -->
    <v-row dense class="mt-0">
      <v-col cols="12">
        <!-- Statistics Cards -->
        <v-row class="mt-1">
          <v-col v-for="(card, index) in statisticsCards" :key="index" cols="12" md="4">
            <ui-simple-card :card-data="card" size="big" />
          </v-col>
        </v-row>

        <!-- Platform Benefits Section -->
        <v-card
          class="mt-5 mb-4"
          elevation="15"
          rounded="xl"
          title="Diferenciais da Plataforma"
          prepend-icon="mdi-star"
        >
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-list rounded="xl">
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-trophy" color="warning" />
                    </template>
                    <v-list-item-title
                      >Sistema de ranqueamento baseado em impacto real verificado
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-gamepad-variant" color="success" />
                    </template>
                    <v-list-item-title
                      >Gamificação e sistema de recompensas para engajamento
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-api" color="info" />
                    </template>
                    <v-list-item-title
                      >Integração com APIs governamentais para validação
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6">
                <v-list rounded="xl">
                  <v-list-item>
                    <template #prepend>
                      <v-icon icon="mdi-certificate" color="primary" />
                    </template>
                    <v-list-item-title
                      >Certificação digital verificável de impacto
                    </v-list-item-title>
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
                      >Primeira plataforma híbrida acadêmico-corporativa
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Target Audience Section -->
        <v-card
          class="mb-4"
          elevation="15"
          rounded="xl"
          title="Público-Alvo"
          prepend-icon="mdi-account-group"
        >
          <v-card-text>
            <v-row>
              <v-col v-for="(card, index) in targetAudienceCards" :key="index" cols="12" md="3">
                <ui-simple-card :card-data="card" />
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

.mission-card {
  background: rgba(33, 38, 45, 0.9) !important;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.mission-text {
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Improved button styles */
:deep(.v-btn--variant-outlined) {
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
}

/* Text field improvements */
:deep(.v-text-field--variant-outlined .v-field) {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.v-text-field--variant-outlined .v-field:hover) {
  border-color: rgba(25, 118, 210, 0.5);
}

/* Enhanced shadows */

:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
</style>
