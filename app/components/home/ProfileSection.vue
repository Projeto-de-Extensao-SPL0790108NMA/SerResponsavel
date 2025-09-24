<template>
  <div class="profile-section">
    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="tonal" rounded="xl" elevation="8" class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-account" class="me-2" color="primary" />
            Informações Pessoais
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-email" />
                </template>
                <v-list-item-title>Email</v-list-item-title>
                <v-list-item-subtitle>{{ user?.email || 'Não informado' }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-account-circle" />
                </template>
                <v-list-item-title>Nome</v-list-item-title>
                <v-list-item-subtitle>{{
                  user?.user_metadata?.full_name || 'Não informado'
                }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-calendar" />
                </template>
                <v-list-item-title>Membro desde</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(user?.created_at) }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card variant="tonal" rounded="xl" elevation="8" class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-cog" class="me-2" color="success" />
            Configurações
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Notificações</v-list-item-title>
                <template #append>
                  <v-switch color="primary" />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Tema Escuro</v-list-item-title>
                <template #append>
                  <v-switch color="primary" />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Updates por Email</v-list-item-title>
                <template #append>
                  <v-switch color="primary" />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Não informado'
  return new Date(dateString).toLocaleDateString('pt-BR')
}
</script>
