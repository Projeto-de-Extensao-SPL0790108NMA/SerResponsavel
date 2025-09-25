import type { LoginForm } from '@/types/AuthForm'
import type { AuthError } from '@supabase/supabase-js'

type UseFormErrors<T> = {
  [K in keyof T]: string[]
}

const createEmptyLoginErrors = (): UseFormErrors<LoginForm> => ({
  email: [],
  password: [],
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
