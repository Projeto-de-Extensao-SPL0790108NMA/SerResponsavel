<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Acesso negado',
})

const goHome = () => navigateTo('/home')
</script>

<template>
  <section class="access-denied">
    <v-container class="py-16 text-center">
      <v-icon icon="mdi-cancel" size="64" color="error" class="mb-4" />
      <h1 class="text-h4 mb-2">Sem permissão</h1>
      <p class="text-body-1 text-grey-lighten-1 mb-6">
        Você não tem autorização para acessar este recurso. Entre em contato com um administrador
        caso precise de permissão.
      </p>
      <v-btn color="primary" variant="elevated" @click="goHome">Voltar para a página inicial</v-btn>
    </v-container>
  </section>
</template>

<style scoped>
.access-denied {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
