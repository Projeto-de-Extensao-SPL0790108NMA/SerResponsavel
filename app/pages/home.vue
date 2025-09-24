<script lang="ts" setup>
import type { CardData } from '~/types/ui'

definePageMeta({
  layout: 'default',
})

const user = useSupabaseUser()

const homeCards: CardData[] = [
  {
    icon: 'mdi-account-circle',
    title: 'Perfil',
    subtitle: 'Gerencie suas informações pessoais',
    color: 'primary',
    to: '/home',
  },
  {
    icon: 'mdi-handshake',
    title: 'Projetos',
    subtitle: 'Visualize e gerencie seus projetos',
    color: 'success',
    to: '/home',
  },
  {
    icon: 'mdi-chart-line',
    title: 'Relatórios',
    subtitle: 'Acompanhe métricas e resultados',
    color: 'info',
    to: '/home',
  },
]

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
        <ui-simple-card :card-data="card" clickable />
      </v-col>
    </v-row>
  </v-container>
</template>
