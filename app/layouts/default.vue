<script setup lang="ts"></script>
<template>
  <v-app class="app-background" theme="dark">
    <!-- Navigation Bar -->
    <nav-bar />

    <!-- Main Content -->
    <v-main>
      <div class="main-layout">
        <v-container fluid class="pa-0">
          <NuxtPage />
        </v-container>
      </div>
    </v-main>

    <footer-component />
  </v-app>
</template>

<style scoped>
.main-layout {
  min-height: calc(100vh - 64px); /* Full height minus navbar only */
  padding-top: 64px; /* Account for fixed navbar */
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .main-layout {
    min-height: calc(100vh - 56px);
    padding-top: 56px; /* Slightly smaller navbar on mobile */
  }
}
</style>
