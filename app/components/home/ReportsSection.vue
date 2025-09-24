<template>
  <div class="reports-section">
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-card variant="tonal" rounded="xl" elevation="8" color="success">
          <v-card-text class="text-center">
            <v-icon icon="mdi-account-group" size="48" class="mb-2" />
            <div class="text-h4 font-weight-bold">{{ totalUsers }}</div>
            <div class="text-subtitle-1">Usuários Cadastrados</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="tonal" rounded="xl" elevation="8" color="primary">
          <v-card-text class="text-center">
            <v-icon icon="mdi-handshake" size="48" class="mb-2" />
            <div class="text-h4 font-weight-bold">{{ totalProjects }}</div>
            <div class="text-subtitle-1">Projetos Ativos</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="tonal" rounded="xl" elevation="8" color="warning">
          <v-card-text class="text-center">
            <v-icon icon="mdi-chart-line" size="48" class="mb-2" />
            <div class="text-h4 font-weight-bold">{{ impactScore }}</div>
            <div class="text-subtitle-1">Score de Impacto</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card variant="tonal" rounded="xl" elevation="8">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-chart-bar" class="me-2" color="primary" />
            Atividade dos Projetos
          </v-card-title>
          <v-card-text>
            <div class="chart-placeholder">
              <v-icon icon="mdi-chart-timeline-variant" size="64" color="grey-lighten-1" />
              <p class="text-center text-grey-lighten-1 mt-2">
                Gráfico de atividades será implementado aqui
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="tonal" rounded="xl" elevation="8">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-trophy" class="me-2" color="warning" />
            Conquistas
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-medal" color="gold" />
                </template>
                <v-list-item-title>Primeiro Projeto</v-list-item-title>
                <v-list-item-subtitle>Completado</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-account-plus" color="primary" />
                </template>
                <v-list-item-title>Bem-vindo</v-list-item-title>
                <v-list-item-subtitle>Perfil criado</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-calendar-check" color="success" />
                </template>
                <v-list-item-title>Ativo 30 dias</v-list-item-title>
                <v-list-item-subtitle>Em progresso</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card variant="tonal" rounded="xl" elevation="8">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-clock-outline" class="me-2" color="info" />
            Atividades Recentes
          </v-card-title>
          <v-card-text>
            <v-timeline density="compact">
              <v-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :dot-color="activity.color"
                size="small"
              >
                <template #icon>
                  <v-icon :icon="activity.icon" size="small" />
                </template>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <strong>{{ activity.title }}</strong>
                    <div class="text-caption">{{ activity.description }}</div>
                  </div>
                  <div class="text-caption">{{ activity.time }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const totalUsers = ref(42)
const totalProjects = ref(8)
const impactScore = ref(85)

const recentActivities = ref([
  {
    id: 1,
    title: 'Projeto "Limpeza da Praia" iniciado',
    description: 'Novo projeto de sustentabilidade criado',
    time: 'Há 2 horas',
    icon: 'mdi-plus-circle',
    color: 'success',
  },
  {
    id: 2,
    title: 'Relatório mensal gerado',
    description: 'Métricas de impacto atualizadas',
    time: 'Há 1 dia',
    icon: 'mdi-file-chart',
    color: 'info',
  },
  {
    id: 3,
    title: 'Novo voluntário cadastrado',
    description: 'Maria Silva se juntou à plataforma',
    time: 'Há 2 dias',
    icon: 'mdi-account-plus',
    color: 'primary',
  },
  {
    id: 4,
    title: 'Projeto "Horta Comunitária" concluído',
    description: 'Impacto: 150 pessoas beneficiadas',
    time: 'Há 1 semana',
    icon: 'mdi-check-circle',
    color: 'success',
  },
])
</script>

<style scoped>
.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 12px;
}
</style>
