<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { CardData } from '~/types/ui'

definePageMeta({
  layout: 'default',
})

const user = useSupabaseUser()
const { toggleSection, activeSection, hasActiveSection } = useHomeNavigation()
const projectsStore = useProjectsStore()
const preferencesStore = usePreferencesStore()
const { theme } = storeToRefs(preferencesStore)

await callOnce(async () => {
  await Promise.all([
    projectsStore.fetchProjects(false, 'all'),
    projectsStore.fetchCompletedProjectsCount(),
  ])
})

type HomeSection = 'profile' | 'projects' | 'reports' | 'organizations'

const sectionLabels: Record<HomeSection, string> = {
  profile: 'Perfil',
  projects: 'Projetos',
  reports: 'Relatórios',
  organizations: 'Organizações',
}

const homeCards: Array<CardData & { section: HomeSection }> = [
  {
    icon: 'mdi-account-circle',
    title: sectionLabels.profile,
    subtitle: 'Gerencie suas informações pessoais',
    color: 'primary',
    section: 'profile',
  },
  {
    icon: 'mdi-handshake',
    title: sectionLabels.projects,
    subtitle: 'Visualize e gerencie seus projetos',
    color: 'success',
    section: 'projects',
  },
  {
    icon: 'mdi-chart-line',
    title: sectionLabels.reports,
    subtitle: 'Acompanhe métricas e resultados',
    color: 'info',
    section: 'reports',
  },
  {
    icon: 'mdi-domain',
    title: sectionLabels.organizations,
    subtitle: 'Consulte e ajuste organizações vinculadas',
    color: 'secondary',
    section: 'organizations',
  },
]

const handleCardClick = (cardData: CardData) => {
  const section = (cardData.section ?? null) as HomeSection | null
  if (!section) {
    return
  }
  toggleSection(section)
}

useSeoMeta({
  title: 'Home - SerResponsável',
  description: 'Dashboard da plataforma SerResponsável',
})

const homeBackgroundClass = computed(() =>
  theme.value === 'dark' ? 'home-background-dark' : 'home-background-light',
)

const cardBorderSimpleClass = computed(() =>
  theme.value === 'dark' ? 'borda-radial-branco-simples' : 'borda-radial-clara-simples',
)

const activeSectionLabel = computed(() =>
  activeSection.value ? sectionLabels[activeSection.value as HomeSection] : '',
)
</script>

<template>
  <div :class="homeBackgroundClass" class="home-page-wrapper">
    <v-container max-width="1080">
      <!-- welcome message-->
      <v-row>
        <v-col cols="12">
          <v-card :class="['mb-4', cardBorderSimpleClass]" rounded="xl" elevation="15">
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
        <v-col v-for="(card, index) in homeCards" :key="index" cols="12" md="3">
          <ui-simple-card :card-data="card" clickable @click="handleCardClick" />
        </v-col>
      </v-row>

      <!-- dynamic section content -->
      <v-row v-if="hasActiveSection" class="mt-4">
        <v-col cols="12">
          <v-card :class="[cardBorderSimpleClass]" rounded="xl" elevation="15">
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-h5">{{ activeSectionLabel }}</span>
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
              <HomeOrganizationsSection v-else-if="activeSection === 'organizations'" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
