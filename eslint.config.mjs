// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(prettier, {
  ignores: ['supabase/functions/**', '.output/**', '.nuxt/**', 'dist/**'],
})
