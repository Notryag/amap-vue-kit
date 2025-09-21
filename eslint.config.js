import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'dist',
    'packages/*/dist',
    'docs/.vitepress/cache',
    'docs/.vitepress/dist',
    'examples/*/dist'
  ],
  vue: true,
  typescript: true
})
