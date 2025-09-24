<script lang="ts" setup>
import type { CardData } from '~/types/ui'

definePageMeta({
  layout: 'default',
})

const user = useSupabaseUser()
const { toggleSection, activeSection, hasActiveSection } = useHomeNavigation()

const homeCards: CardData[] = [
  {
    icon: 'mdi-account-circle',
    title: 'Perfil',
    subtitle: 'Gerencie suas informações pessoais',
    color: 'primary',
  },
  {
    icon: 'mdi-handshake',
    title: 'Projetos',
    subtitle: 'Visualize e gerencie seus projetos',
    color: 'success',
  },
  {
    icon: 'mdi-chart-line',
    title: 'Relatórios',
    subtitle: 'Acompanhe métricas e resultados',
    color: 'info',
  },
]

const handleCardClick = (cardData: CardData) => {
  const sectionMap: Record<string, 'profile' | 'projects' | 'reports'> = {
    Perfil: 'profile',
    Projetos: 'projects',
    Relatórios: 'reports',
  }

  const section = sectionMap[cardData.title as string]
  if (section) {
    toggleSection(section)
  }
}

useSeoMeta({
  title: 'Home - SerResponsável',
  description: 'Dashboard da plataforma SerResponsável',
})
</script>

<template>
  <v-container>
    <!-- welcome message-->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4 borda-radial-branco-simples" rounded="xl" elevation="15">
          <v-card-title class="d-flex">
            <v-icon icon="mdi-home" class="me-2" color="primary" />
            Olá, {{ user?.user_metadata?.full_name }}! seja bem-vindo ao SerResponsável
          </v-card-title>
          <v-card-text>
            <p>Você está logado na plataforma SerResponsável.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- home cards-->
    <v-row>
      <v-col v-for="(card, index) in homeCards" :key="index" cols="12" md="4">
        <ui-simple-card :card-data="card" clickable @click="handleCardClick" />
      </v-col>
    </v-row>

    <!-- dynamic section content -->
    <v-row v-if="hasActiveSection" class="mt-4">
      <v-col cols="12">
        <v-card class="borda-radial-branco-simples" rounded="xl" elevation="15">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">
              {{
                activeSection === 'profile'
                  ? 'Perfil'
                  : activeSection === 'projects'
                    ? 'Projetos'
                    : 'Relatórios'
              }}
            </span>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              @click="toggleSection(activeSection!)"
            />
          </v-card-title>
          <v-card-text>
            <HomeProfileSection v-if="activeSection === 'profile'" />
            <HomeProjectsSection v-else-if="activeSection === 'projects'" />
            <HomeReportsSection v-else-if="activeSection === 'reports'" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
