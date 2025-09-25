<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePreferencesStore } from '@/stores/preferences'
import { useProfile } from '@/composables/useProfile'

const authStore = useAuthStore()
const { profile } = storeToRefs(authStore)

const supabaseUser = useSupabaseUser()
const preferencesStore = usePreferencesStore()
const { theme } = storeToRefs(preferencesStore)
const organizationsStore = useOrganizationsStore()

const { updateProfile } = useProfile()

const themeLoading = ref(false)
const themeError = ref('')
const isEditDialogOpen = ref(false)
const successMessage = ref('')
const showSuccessSnackbar = ref(false)

watch(
  () => profile.value?.organization_id,
  (id) => {
    if (id) {
      void organizationsStore.fetchOrganization(id)
    }
  },
  { immediate: true },
)

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Não informado'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'Não informado'
  return new Date(dateString).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

const personalInfo = computed(() => {
  const organization = organizationsStore.getOrganization(profile.value?.organization_id || null)
  const fullName =
    profile.value?.full_name || supabaseUser.value?.user_metadata?.full_name || 'Não informado'

  return {
    fullName,
    email: supabaseUser.value?.email || 'Não informado',
    username: profile.value?.username || 'Não informado',
    bio: profile.value?.bio || 'Nenhuma bio cadastrada',
    organization: organization?.name || 'Não informado',
    memberSince:
      formatDate(profile.value?.created_at || supabaseUser.value?.created_at) || 'Não informado',
    lastSignIn: formatDateTime(supabaseUser.value?.last_sign_in_at),
    themeLabel: theme.value === 'dark' ? 'Escuro' : 'Claro',
  }
})

const themeModel = computed({
  get: () => theme.value === 'dark',
  set: (value: boolean) => {
    void handleThemeChange(value)
  },
})

const handleThemeChange = async (value: boolean) => {
  const newMode: 'light' | 'dark' = value ? 'dark' : 'light'

  if (newMode === theme.value) {
    return
  }

  const previousMode = theme.value
  preferencesStore.setTheme(newMode)
  themeLoading.value = true
  themeError.value = ''

  try {
    const { error } = await updateProfile({ mode: newMode })

    if (error) {
      preferencesStore.setTheme(previousMode)
      themeError.value = 'Não foi possível atualizar o tema. Tente novamente.'
      console.error('Failed to update theme preference:', error)
      return
    }
  } catch (error) {
    preferencesStore.setTheme(previousMode)
    themeError.value = 'Não foi possível atualizar o tema. Tente novamente.'
    console.error('Failed to update theme preference:', error)
  } finally {
    themeLoading.value = false
  }
}

const openEditDialog = () => {
  isEditDialogOpen.value = true
}

const handleProfileSaved = () => {
  successMessage.value = 'Perfil atualizado com sucesso.'
  showSuccessSnackbar.value = true
}
</script>

<template>
  <div class="profile-section">
    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="tonal" rounded="xl" elevation="8" class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-account" class="me-2" color="primary" />
            Informações Pessoais
            <v-spacer />
            <v-btn
              size="small"
              variant="outlined"
              rounded="xl"
              class="light-btn-outlined-variant"
              color="primary"
              prepend-icon="mdi-account-edit"
              @click="openEditDialog"
            >
              Editar Perfil
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-account-circle" />
                </template>
                <v-list-item-title>Nome</v-list-item-title>
                <v-list-item-subtitle>{{ personalInfo.fullName }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-email" />
                </template>
                <v-list-item-title>Email</v-list-item-title>
                <v-list-item-subtitle>{{ personalInfo.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-account-badge-outline" />
                </template>
                <v-list-item-title>Username</v-list-item-title>
                <v-list-item-subtitle>{{ personalInfo.username }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-domain" />
                </template>
                <v-list-item-title>Organização</v-list-item-title>
                <v-list-item-subtitle>{{ personalInfo.organization }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-text" />
                </template>
                <v-list-item-title>Bio</v-list-item-title>
                <v-list-item-subtitle>{{ personalInfo.bio }}</v-list-item-subtitle>
              </v-list-item>
              <v-divider class="my-2" />
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-calendar" />
                </template>
                <v-list-item-title>Membro desde</v-list-item-title>
                <v-list-item-subtitle>{{ personalInfo.memberSince }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-clock-outline" />
                </template>
                <v-list-item-title>Último acesso</v-list-item-title>
                <v-list-item-subtitle>{{ personalInfo.lastSignIn }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-palette" />
                </template>
                <v-list-item-title>Tema preferido</v-list-item-title>
                <v-list-item-subtitle>{{ personalInfo.themeLabel }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card variant="tonal" rounded="xl" elevation="8" class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-cog" class="me-2" color="success" />
            Preferências
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Tema Escuro</v-list-item-title>
                <v-list-item-subtitle>
                  Alterna entre tema claro e escuro da interface
                </v-list-item-subtitle>
                <template #append>
                  <v-switch
                    v-model="themeModel"
                    color="primary"
                    :loading="themeLoading"
                    :disabled="themeLoading"
                  />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Notificações</v-list-item-title>
                <v-list-item-subtitle>Em breve</v-list-item-subtitle>
                <template #append>
                  <v-switch color="primary" disabled />
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Updates por Email</v-list-item-title>
                <v-list-item-subtitle>Em breve</v-list-item-subtitle>
                <template #append>
                  <v-switch color="primary" disabled />
                </template>
              </v-list-item>
            </v-list>
            <v-alert v-if="themeError" type="error" density="compact" variant="tonal" class="mt-3">
              {{ themeError }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <HomeProfileEditDialog
    v-model="isEditDialogOpen"
    :profile="profile"
    @saved="handleProfileSaved"
  />
  <v-snackbar v-model="showSuccessSnackbar" color="success" timeout="4000" location="bottom">
    {{ successMessage }}
  </v-snackbar>
</template>
