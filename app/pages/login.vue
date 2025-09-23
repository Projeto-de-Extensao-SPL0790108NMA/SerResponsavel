<script lang="ts" setup>
// Imports
import { informativeCards, targetAudienceCards } from '~/constants/login'

// Layout
definePageMeta({
  layout: 'auth',
})

// SEO
useSeoMeta({
  title: 'SerResponsável - Plataforma de Transparência e Gestão de Responsabilidade Social',
  description:
    'Primeira plataforma brasileira que unifica gestão acadêmica e corporativa de responsabilidade social. Centraliza, gerencia e mensura ações de empresas, ONGs, instituições de ensino e poder público. Ranqueamento baseado em impacto real verificado.',
  ogTitle: 'SerResponsável - Transparência Social Verificada',
  ogDescription:
    'Transforme sua gestão de responsabilidade social com ranqueamento de impacto real, certificação digital e dashboard ESG automatizado.',
  ogImage: '/logoserresp600_598.png',
})
</script>

<template>
  <v-container>
    <!-- Hero Section -->
    <v-row class="text-center">
      <v-col class="hero-content fade-in-up">
        <v-img
          src="~/assets/img/logoserresp600_598.png"
          alt="SerResponsável Logo"
          max-width="200"
          class="mx-auto mb-4 logo-hover"
        />
        <h1 class="text-h3 font-weight-bold mb-4 text-gradient hero-title">SerResponsável</h1>
        <h2 class="text-h5 mb-4 text-grey-lighten-1 hero-subtitle">
          Plataforma de Transparência e Gestão de Responsabilidade Social
        </h2>
        <p class="text-h6 mb-6 text-grey-lighten-2 hero-description">
          <v-icon icon="mdi-school" color="primary" class="me-2" />
          Uninorte - Centro Universitário do Norte
        </p>

        <!-- Badge/Chips informativos -->
        <v-row class="d-flex justify-center flex-wrap gap-2">
          <v-col>
            <v-chip
              color="primary"
              variant="tonal"
              size="small"
              prepend-icon="mdi-trophy"
              class="hero-chip mx-3"
            >
              Pioneiro
            </v-chip>
            <v-chip
              color="success"
              variant="tonal"
              size="small"
              prepend-icon="mdi-check-circle"
              class="hero-chip"
            >
              Verificado
            </v-chip>
            <v-chip
              color="info"
              variant="tonal"
              size="small"
              prepend-icon="mdi-rocket-launch"
              class="hero-chip mx-3"
            >
              Inovador
            </v-chip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- mission/info cards -->
    <v-row class="fade-in-up">
      <!-- mission and info cards -->
      <v-col cols="12">
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
      </v-col>
    </v-row>

    <!-- info cards -->
    <v-row class="mb-6 fade-in-up">
      <v-col v-for="(card, index) in informativeCards" :key="index" cols="12" md="4">
        <ui-simple-card :card-data="card" animated />
      </v-col>
    </v-row>

    <v-divider class="mt-6 fade-in-up" />

    <!-- Image Slider Section -->
    <v-row class="mt-2 fade-in-up">
      <v-col cols="12">
        <SimpleSlider />
      </v-col>
    </v-row>

    <!-- Projects Management Section -->
    <v-row class="mt-4 fade-in-up" dense>
      <v-col cols="12">
        <ListActiveProjects />
      </v-col>
    </v-row>

    <!-- benefits, and target audience cards -->
    <v-row dense class="mt-0 fade-in-up">
      <v-col cols="12">
        <!-- Platform Benefits Section -->
        <v-card
          class="mt-5 mb-4 simple-border"
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
          class="mb-4 simple-border"
          elevation="15"
          rounded="xl"
          title="Público-Alvo"
          prepend-icon="mdi-account-group"
        >
          <v-card-text>
            <v-row>
              <v-col v-for="(card, index) in targetAudienceCards" :key="index" cols="12" md="3">
                <ui-simple-card :card-data="card" animated />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Background wrapper with image */

.mission-card {
  background: rgba(33, 38, 45, 0.9) !important;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.mission-text {
  font-size: 1.1rem;
  line-height: 1.6;
}

.logo-hover {
  transition: all 0.4s ease;
  filter: drop-shadow(0 4px 15px rgba(25, 118, 210, 0.3));
}

.logo-hover:hover {
  transform: scale(1.05) rotate(2deg);
  filter: drop-shadow(0 8px 25px rgba(25, 118, 210, 0.5));
}

.hero-title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
  animation: fadeInUp 1s ease-out 0.2s both;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.hero-description {
  animation: fadeInUp 1.2s ease-out 0.4s both;
}

.hero-chip {
  animation: fadeInUp 1.4s ease-out 0.6s both;
  transition: all 0.3s ease;
}

.hero-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4);
}
</style>
