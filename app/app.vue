<template>
  <v-app theme="dark" class="app-background">
    <NuxtPage />
  </v-app>
</template>
<script setup lang="ts">
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

.app-background {
  background: linear-gradient(135deg, 
    #0d1117 0%, 
    #161b22 25%, 
    #1c2128 50%, 
    #21262d 75%, 
    #0d1117 100%
  ) !important;
  background-attachment: fixed !important;
  min-height: 100vh !important;
}

.app-background::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(29, 155, 240, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 70%, rgba(34, 197, 94, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

/* Fix overscroll white background */
html {
  background: #0d1117 !important;
}
</style>
