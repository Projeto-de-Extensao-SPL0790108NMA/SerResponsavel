<template>
  <div class="organizations-section">
    <v-card
      v-if="hasOrganizations"
      class="organizations-card"
      variant="tonal"
      rounded="xl"
      elevation="10"
    >
      <v-card-title class="d-flex justify-space-between align-center flex-wrap gap-3">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-domain" color="primary" />
          <span class="text-subtitle-1 font-weight-medium">Organizações vinculadas</span>
        </div>
        <v-chip size="small" variant="tonal" color="primary">
          {{ organizationSummaries.length }}
          {{ organizationSummaries.length === 1 ? 'organização' : 'organizações' }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <v-row class="g-3">
          <v-col
            v-for="organization in organizationSummaries"
            :key="organization.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-sheet class="organizations-card__item" rounded="lg" border>
              <div class="d-flex align-center gap-3">
                <v-avatar size="48" rounded="lg" color="primary">
                  <template v-if="organization.logoUrl">
                    <v-img :src="organization.logoUrl" :alt="organization.name" cover />
                  </template>
                  <template v-else>
                    <v-icon icon="mdi-domain" />
                  </template>
                </v-avatar>
                <div class="organizations-card__details">
                  <span class="organizations-card__name">{{ organization.name }}</span>
                  <span class="text-caption text-grey-lighten-1">
                    {{ organization.projectCount }}
                    {{
                      organization.projectCount === 1 ? 'projeto vinculado' : 'projetos vinculados'
                    }}
                  </span>
                </div>
              </div>

              <div class="organizations-card__footer">
                <v-chip
                  v-if="organization.bio"
                  size="x-small"
                  variant="tonal"
                  color="info"
                  class="organizations-card__chip"
                >
                  {{
                    organization.bio.length > 50
                      ? `${organization.bio.slice(0, 50)}…`
                      : organization.bio
                  }}
                </v-chip>

                <v-btn
                  variant="outlined"
                  size="small"
                  rounded="xl"
                  prepend-icon="mdi-pencil-outline"
                  class="organizations-card__button"
                  @click="openOrganizationDialog(organization)"
                >
                  Ajustar
                </v-btn>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-alert v-else type="info" variant="tonal" border="start" class="mt-3">
      <v-icon icon="mdi-information" start />
      Nenhuma organização vinculada encontrada. Cadastre projetos para iniciar o acompanhamento.
    </v-alert>

    <v-dialog v-model="organizationDialogOpen" max-width="540">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Ajustar organização</span>
          <v-btn icon variant="text" size="small" @click="closeOrganizationDialog">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-alert
            v-if="organizationError"
            type="error"
            variant="tonal"
            class="mb-3"
            density="comfortable"
          >
            {{ organizationError }}
          </v-alert>

          <v-text-field
            v-model="organizationForm.name"
            label="Nome da organização"
            prepend-inner-icon="mdi-domain"
            variant="outlined"
            density="comfortable"
            required
            class="mb-3"
            :disabled="isSubmitting"
          />

          <v-textarea
            v-model="organizationForm.bio"
            label="Descrição/Biografia"
            prepend-inner-icon="mdi-text"
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            class="mb-3"
            :disabled="isSubmitting"
          />

          <v-file-input
            v-model="organizationForm.logoFile"
            label="Enviar nova logo"
            prepend-icon="mdi-upload"
            variant="outlined"
            density="comfortable"
            accept="image/*"
            class="mb-3"
            :disabled="isSubmitting || organizationForm.removeLogo"
          />

          <v-switch
            v-if="organizationForm.currentLogoUrl"
            v-model="organizationForm.removeLogo"
            label="Remover logo atual"
            color="warning"
            inset
            :disabled="isSubmitting"
          />

          <div v-if="previewLogoUrl" class="mt-4 d-flex flex-column align-center gap-2">
            <span class="text-caption text-grey-lighten-1">Pré-visualização</span>
            <v-avatar size="88" rounded="lg" color="primary">
              <v-img :src="previewLogoUrl" alt="Logo da organização" cover />
            </v-avatar>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" :disabled="isSubmitting" @click="closeOrganizationDialog">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            prepend-icon="mdi-content-save"
            :loading="isSubmitting"
            @click="handleOrganizationSubmit"
          >
            Salvar ajustes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="bottom">
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { Database } from '~~/database/types'
import { useOrganizationLogoStorage } from '@/composables/useOrganizationLogoStorage'

const projectsStore = useProjectsStore()
const supabase = useSupabaseClient<Database>()
const {
  uploadLogo,
  removeLogo: removeLogoFromStorage,
  loading: logoStorageLoading,
} = useOrganizationLogoStorage()

const organizationDialogOpen = ref(false)
const organizationSaving = ref(false)
const organizationError = ref<string | null>(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref<'success' | 'error'>('success')
const previewLogoUrl = ref<string | null>(null)

type OrganizationFormState = {
  id: string
  name: string
  bio: string
  logoUrl: string
  currentLogoUrl: string
  logoFile: File | null
  removeLogo: boolean
}

const defaultOrganizationForm = (): OrganizationFormState => ({
  id: '',
  name: '',
  bio: '',
  logoUrl: '',
  currentLogoUrl: '',
  logoFile: null,
  removeLogo: false,
})

const organizationForm = reactive<OrganizationFormState>(defaultOrganizationForm())

const resetOrganizationForm = () => {
  Object.assign(organizationForm, defaultOrganizationForm())
  previewLogoUrl.value = null
}

type OrganizationSummary = {
  id: string
  name: string
  logoUrl: string | null
  bio: string | null
  projectCount: number
}

const allProjectsCache = computed(() => projectsStore.getCachedProjects('all') ?? [])

const organizationSummaries = computed<OrganizationSummary[]>(() => {
  const accumulator = new Map<string, OrganizationSummary>()

  allProjectsCache.value.forEach((project) => {
    const organization = project.organization
    if (!organization?.id) return

    const existing = accumulator.get(organization.id)
    if (existing) {
      existing.projectCount += 1
      return
    }

    accumulator.set(organization.id, {
      id: organization.id,
      name: organization.name,
      logoUrl: organization.logo_url,
      bio: organization.bio,
      projectCount: 1,
    })
  })

  return Array.from(accumulator.values()).sort((a, b) => a.name.localeCompare(b.name))
})

const hasOrganizations = computed(() => organizationSummaries.value.length > 0)
const isSubmitting = computed(() => organizationSaving.value || logoStorageLoading.value)

const showSnackbar = (message: string, color: 'success' | 'error' = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

const openOrganizationDialog = (organization: OrganizationSummary) => {
  Object.assign(organizationForm, {
    id: organization.id,
    name: organization.name,
    bio: organization.bio ?? '',
    logoUrl: organization.logoUrl ?? '',
    currentLogoUrl: organization.logoUrl ?? '',
    logoFile: null,
    removeLogo: false,
  })
  organizationError.value = null
  previewLogoUrl.value = organization.logoUrl ?? null
  organizationDialogOpen.value = true
}

const closeOrganizationDialog = () => {
  organizationDialogOpen.value = false
  resetOrganizationForm()
}

const refreshProjectsCache = async () => {
  await projectsStore.refreshProjects('all')
}

const handleOrganizationSubmit = async () => {
  if (!organizationForm.id) {
    return
  }

  const name = organizationForm.name.trim()
  if (!name) {
    organizationError.value = 'Informe o nome da organização.'
    return
  }

  organizationSaving.value = true
  organizationError.value = null

  let uploadedLogo: { path: string; url: string } | null = null
  const previousLogoUrl = organizationForm.currentLogoUrl
  const trimmedManualUrl = organizationForm.logoUrl.trim()
  const shouldRemove = organizationForm.removeLogo && !organizationForm.logoFile

  try {
    if (organizationForm.logoFile) {
      uploadedLogo = await uploadLogo(organizationForm.logoFile, organizationForm.id)
    }

    const logoUrlToPersist =
      uploadedLogo?.url ?? (shouldRemove ? null : trimmedManualUrl || previousLogoUrl || null)

    const { error } = await supabase
      .from('organizations')
      .update({
        name,
        bio: organizationForm.bio.trim() || null,
        logo_url: logoUrlToPersist,
      })
      .eq('id', organizationForm.id)

    if (error) {
      throw new Error(error.message)
    }

    if (uploadedLogo && previousLogoUrl) {
      await removeLogoFromStorage(previousLogoUrl)
    } else if (shouldRemove && previousLogoUrl) {
      await removeLogoFromStorage(previousLogoUrl)
    }

    showSnackbar('Organização atualizada com sucesso!')
    closeOrganizationDialog()
    await refreshProjectsCache()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Não foi possível atualizar a organização.'
    organizationError.value = message
    showSnackbar(message, 'error')

    if (uploadedLogo?.path) {
      await removeLogoFromStorage(uploadedLogo.path)
    }
  } finally {
    organizationSaving.value = false
  }
}

watch(
  () => organizationForm.logoFile,
  (file) => {
    if (file) {
      organizationForm.removeLogo = false
      previewLogoUrl.value = URL.createObjectURL(file)
    }
  },
)

watch(
  () => organizationForm.removeLogo,
  (value) => {
    if (value) {
      organizationForm.logoFile = null
      organizationForm.logoUrl = ''
      previewLogoUrl.value = null
    } else if (!organizationForm.logoFile) {
      previewLogoUrl.value = organizationForm.currentLogoUrl || null
    }
  },
)

onMounted(() => {
  if (!projectsStore.getCachedProjects('all')) {
    void projectsStore.fetchProjects(false, 'all')
  }
})
</script>

<style scoped>
.organizations-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.organizations-card {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(0, 0, 0, 0.25));
}

.organizations-card__item {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  min-height: 150px;
  background-color: rgba(15, 23, 42, 0.18);
  border-color: rgba(255, 255, 255, 0.08);
}

.organizations-card__details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.organizations-card__name {
  font-weight: 600;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.95);
}

.organizations-card__footer {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.organizations-card__chip {
  max-width: 65%;
  text-transform: none;
}

.organizations-card__button {
  margin-left: auto;
  text-transform: none;
}

@media (max-width: 960px) {
  .organizations-card__chip {
    max-width: 100%;
  }
}
</style>
