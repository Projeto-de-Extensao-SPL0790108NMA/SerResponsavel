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
  <div>
    <!-- Animated Background Icons -->
    <div class="animated-background">
      <div class="floating-icon icon-1">
        <v-icon size="40" color="rgba(25, 118, 210, 0.3)">mdi-heart-outline</v-icon>
      </div>
      <div class="floating-icon icon-2">
        <v-icon size="35" color="rgba(76, 175, 80, 0.25)">mdi-earth</v-icon>
      </div>
      <div class="floating-icon icon-3">
        <v-icon size="30" color="rgba(255, 193, 7, 0.3)">mdi-hand-heart</v-icon>
      </div>
      <div class="floating-icon icon-4">
        <v-icon size="45" color="rgba(25, 118, 210, 0.25)">mdi-account-group</v-icon>
      </div>
      <div class="floating-icon icon-5">
        <v-icon size="32" color="rgba(76, 175, 80, 0.3)">mdi-tree</v-icon>
      </div>
      <div class="floating-icon icon-6">
        <v-icon size="38" color="rgba(156, 39, 176, 0.25)">mdi-school</v-icon>
      </div>
      <div class="floating-icon icon-7">
        <v-icon size="42" color="rgba(255, 193, 7, 0.25)">mdi-handshake</v-icon>
      </div>
      <div class="floating-icon icon-8">
        <v-icon size="28" color="rgba(25, 118, 210, 0.3)">mdi-shield-heart</v-icon>
      </div>
      <div class="floating-icon icon-9">
        <v-icon size="36" color="rgba(76, 175, 80, 0.25)">mdi-home-heart</v-icon>
      </div>
      <div class="floating-icon icon-10">
        <v-icon size="33" color="rgba(255, 193, 7, 0.3)">mdi-charity</v-icon>
      </div>
      <div class="floating-icon icon-11">
        <v-icon size="29" color="rgba(156, 39, 176, 0.3)">mdi-human-handsdown</v-icon>
      </div>
      <div class="floating-icon icon-12">
        <v-icon size="41" color="rgba(25, 118, 210, 0.25)">mdi-leaf</v-icon>
      </div>
    </div>

    <v-container class="container-position" max-width="1080">
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
                Centralizar, gerenciar e mensurar ações de responsabilidade social de empresas,
                ONGs, instituições de ensino e poder público, criando um ecossistema completo de
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
                      <v-list-item-title
                        >Dashboard ESG automatizado para empresas</v-list-item-title
                      >
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
  </div>
</template>

<style scoped>
/* Ícones animados de fundo */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  animation-duration: 20s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  filter: blur(1px);
  opacity: 0.4;
}

/* Animações de movimento flutuante */
@keyframes float-up-down {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-40px) rotate(0deg);
  }
  75% {
    transform: translateY(-20px) rotate(-5deg);
  }
}

@keyframes float-diagonal {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  25% {
    transform: translate(30px, -30px) rotate(90deg);
  }
  50% {
    transform: translate(60px, 0px) rotate(180deg);
  }
  75% {
    transform: translate(30px, 30px) rotate(270deg);
  }
  100% {
    transform: translate(0px, 0px) rotate(360deg);
  }
}

@keyframes float-circle {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  25% {
    transform: translate(40px, -40px) rotate(90deg);
  }
  50% {
    transform: translate(0px, -80px) rotate(180deg);
  }
  75% {
    transform: translate(-40px, -40px) rotate(270deg);
  }
  100% {
    transform: translate(0px, 0px) rotate(360deg);
  }
}

@keyframes float-wave {
  0%,
  100% {
    transform: translateX(0px) translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateX(50px) translateY(-25px) rotate(5deg);
  }
  50% {
    transform: translateX(100px) translateY(0px) rotate(0deg);
  }
  75% {
    transform: translateX(50px) translateY(25px) rotate(-5deg);
  }
}

/* Posicionamento dos ícones */
.icon-1 {
  top: 10%;
  left: 8%;
  animation: float-up-down 25s ease-in-out infinite;
  animation-delay: 0s;
}
.icon-2 {
  top: 20%;
  right: 15%;
  animation: float-circle 30s ease-in-out infinite;
  animation-delay: 3s;
}
.icon-3 {
  top: 35%;
  left: 5%;
  animation: float-diagonal 20s ease-in-out infinite;
  animation-delay: 6s;
}
.icon-4 {
  top: 15%;
  left: 50%;
  animation: float-wave 28s ease-in-out infinite;
  animation-delay: 2s;
}
.icon-5 {
  top: 60%;
  right: 8%;
  animation: float-up-down 22s ease-in-out infinite;
  animation-delay: 8s;
}
.icon-6 {
  top: 45%;
  left: 20%;
  animation: float-circle 26s ease-in-out infinite;
  animation-delay: 5s;
}
.icon-7 {
  top: 70%;
  left: 60%;
  animation: float-diagonal 24s ease-in-out infinite;
  animation-delay: 10s;
}
.icon-8 {
  top: 25%;
  right: 35%;
  animation: float-wave 21s ease-in-out infinite;
  animation-delay: 4s;
}
.icon-9 {
  top: 80%;
  left: 15%;
  animation: float-up-down 27s ease-in-out infinite;
  animation-delay: 7s;
}
.icon-10 {
  top: 55%;
  right: 25%;
  animation: float-circle 23s ease-in-out infinite;
  animation-delay: 9s;
}
.icon-11 {
  top: 40%;
  right: 45%;
  animation: float-diagonal 29s ease-in-out infinite;
  animation-delay: 1s;
}
.icon-12 {
  top: 85%;
  right: 40%;
  animation: float-wave 25s ease-in-out infinite;
  animation-delay: 11s;
}

/* Garantir que o conteúdo fique acima dos ícones animados */
.container-position {
  position: relative;
  z-index: 10;
}

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
