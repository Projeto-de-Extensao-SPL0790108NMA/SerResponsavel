<template>
  <v-app>
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Main Content -->
    <v-main>
      <div class="main-layout">
        <v-container fluid class="pa-0">
          <NuxtPage />
        </v-container>
      </div>
    </v-main>

    <!-- Footer (Optional) -->
    <v-footer app color="grey-lighten-3" class="text-center pa-4">
      <div class="text-caption">
        © {{ currentYear }} SerResponsável - Plataforma de Transparência Social
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
// Computed properties
const currentYear = computed(() => new Date().getFullYear())

// Layout meta
definePageMeta({
  layout: false,
  middleware: 'auth',
})
</script>

<style scoped>
.main-layout {
  min-height: calc(100vh - 64px - 64px); /* Full height minus navbar and footer */
  padding-top: 64px; /* Account for fixed navbar */
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .main-layout {
    min-height: calc(100vh - 56px - 64px);
    padding-top: 56px; /* Slightly smaller navbar on mobile */
  }
}
</style>
