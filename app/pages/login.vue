<script lang="ts" setup>
// Use the projects store
const projectsStore = useProjectsStore()
const { projects, loading, error, isCached } = storeToRefs(projectsStore)
const { fetchProjects, refreshProjects, invalidateCache } = projectsStore

// Load projects when page mounts
onMounted(async () => {
  await fetchProjects()
})

// SEO
useSeoMeta({
  title: 'Login - Projects',
  description: 'Login page with projects integration test'
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-alert type="info" class="mb-4">
          <div class="d-flex justify-space-between align-center">
            <span>Testing Projects Integration</span>
            <div>
              <v-chip 
                :color="isCached ? 'success' : 'warning'" 
                size="small"
                class="me-2"
              >
                {{ isCached ? '📦 Cached' : '🌐 Fresh' }}
              </v-chip>
              <v-btn 
                size="small" 
                variant="outlined"
                class="me-2"
                :loading="loading"
                @click="refreshProjects"
              >
                Refresh
              </v-btn>
              <v-btn 
                size="small" 
                variant="outlined" 
                color="warning"
                @click="invalidateCache"
              >
                Clear Cache
              </v-btn>
            </div>
          </div>
        </v-alert>

        <!-- Loading State -->
        <v-card v-if="loading" class="mb-4">
          <v-card-text class="text-center">
            <v-progress-circular indeterminate color="primary" />
            <div class="mt-2">Loading projects...</div>
          </v-card-text>
        </v-card>

        <!-- Error State -->
        <v-alert v-if="error" type="error" class="mb-4">
          Error: {{ error }}
        </v-alert>

        <!-- Projects Display -->
        <v-card v-if="!loading && projects">
          <v-card-title>
            Projects ({{ projects.length }})
          </v-card-title>
          <v-card-text>
            <div v-if="projects.length === 0" class="text-center text-grey">
              No projects found
            </div>
            <v-list v-else>
              <v-list-item
                v-for="project in projects"
                :key="project.id"
                :title="project.name"
                :subtitle="project.description || 'No description'"
              >
                <template #prepend>
                  <v-chip
                    :color="project.status === 'completed' ? 'success' : 'warning'"
                    size="small"
                  >
                    {{ project.status }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Raw Data (for debugging) -->
        <v-expansion-panels class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              Raw Projects Data (Debug)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre>{{ JSON.stringify(projects, null, 2) }}</pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>
