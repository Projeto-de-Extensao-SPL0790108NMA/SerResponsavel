import { computed, ref } from 'vue'
import type { LoginForm, RegisterForm } from '@/types/AuthForm'
import type { AuthError } from '@supabase/supabase-js'

type UseFormErrors<T> = {
  [K in keyof T]: string[]
}

const createEmptyLoginErrors = (): UseFormErrors<LoginForm> => ({
  email: [],
  password: [],
})

const createEmptyRegisterErrors = (): UseFormErrors<RegisterForm> => ({
  email: [],
  password: [],
  confirmPassword: [],
  username: [],
  firstName: [],
  lastName: [],
  bio: [],
  avatarUrl: [],
})

export const useFormErrors = () => {
  const serverError = ref('')
  const realtimeErrors = ref<UseFormErrors<LoginForm>>(createEmptyLoginErrors())

  const handleServerError = (error: AuthError) => {
    if (error.message === 'Invalid login credentials') {
      serverError.value = 'Email ou senha incorretos'
    } else if (error.message === 'Email not confirmed') {
      serverError.value =
        'Email não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.'
    } else {
      serverError.value = error.message
    }
  }

  const handleLoginForm = async (formData: LoginForm) => {
    realtimeErrors.value = createEmptyLoginErrors()

    const { validateEmail, validatePassword } = await import('@/utils/formValidations')

    const emailErrors = validateEmail(formData.email)
    if (emailErrors.length) realtimeErrors.value.email = emailErrors

    const passwordErrors = validatePassword(formData.password)
    if (passwordErrors.length) realtimeErrors.value.password = passwordErrors
  }

  return {
    serverError,
    handleServerError,
    realtimeErrors,
    handleLoginForm,
  }
}

export const useRegisterFormErrors = () => {
  const serverError = ref('')
  const realtimeErrors = ref<UseFormErrors<RegisterForm>>(createEmptyRegisterErrors())

  const handleServerError = (error: AuthError) => {
    switch (error.message) {
      case 'User already registered':
        serverError.value = 'Este email já está cadastrado.'
        break
      case 'Password should be at least 6 characters':
        serverError.value = 'A senha deve ter pelo menos 6 caracteres.'
        break
      default:
        serverError.value = error.message
        break
    }
  }

  const handleRegisterForm = async (formData: RegisterForm) => {
    realtimeErrors.value = createEmptyRegisterErrors()

    const {
      validateEmail,
      validatePassword,
      validateRequiredField,
      validateUsername,
      validateConfirmPassword,
    } = await import('@/utils/formValidations')

    const firstNameErrors = validateRequiredField(formData.firstName, 'Nome')
    if (firstNameErrors.length) realtimeErrors.value.firstName = firstNameErrors

    const lastNameErrors = validateRequiredField(formData.lastName, 'Sobrenome')
    if (lastNameErrors.length) realtimeErrors.value.lastName = lastNameErrors

    const usernameErrors = validateUsername(formData.username)
    if (usernameErrors.length) realtimeErrors.value.username = usernameErrors

    const emailErrors = validateEmail(formData.email)
    if (emailErrors.length) realtimeErrors.value.email = emailErrors

    const passwordErrors = validatePassword(formData.password)
    if (passwordErrors.length) realtimeErrors.value.password = passwordErrors

    const confirmErrors = validateConfirmPassword(formData.password, formData.confirmPassword)
    if (confirmErrors.length) realtimeErrors.value.confirmPassword = confirmErrors
  }

  const hasRealtimeErrors = computed(() =>
    Object.values(realtimeErrors.value).some((errors) => errors.length > 0),
  )

  return {
    serverError,
    realtimeErrors,
    handleServerError,
    handleRegisterForm,
    hasRealtimeErrors,
  }
}
