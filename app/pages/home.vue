<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/login')
}

useSeoMeta({
  title: 'Home - SerResponsável',
  description: 'Dashboard da plataforma SerResponsável',
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon icon="mdi-home" class="me-2" color="primary" />
              Bem-vindo ao SerResponsável
            </div>
            <v-btn variant="outlined" color="error" prepend-icon="mdi-logout" @click="logout">
              Sair
            </v-btn>
          </v-card-title>
          <v-card-text>
            <p class="text-h6 mb-4">Olá, {{ user?.email }}!</p>
            <p>
              Você está logado na plataforma SerResponsável. Esta é a página inicial protegida por
              autenticação.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card color="primary" variant="tonal">
          <v-card-text class="text-center">
            <v-icon icon="mdi-account-circle" size="48" class="mb-2" />
            <div class="text-h6">Perfil</div>
            <div class="text-body-2">Gerencie suas informações pessoais</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="success" variant="tonal">
          <v-card-text class="text-center">
            <v-icon icon="mdi-handshake" size="48" class="mb-2" />
            <div class="text-h6">Projetos</div>
            <div class="text-body-2">Visualize e gerencie seus projetos</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="info" variant="tonal">
          <v-card-text class="text-center">
            <v-icon icon="mdi-chart-line" size="48" class="mb-2" />
            <div class="text-h6">Relatórios</div>
            <div class="text-body-2">Acompanhe métricas e resultados</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
