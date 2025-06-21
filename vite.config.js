import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  server: {
    host: '0.0.0.0', // Para Codespaces
    port: 3000,
    open: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4000
  },
  build: {
    outDir: '../dist',
    lib: {
      entry: {
        index: 'index.js',
        utils: 'shared/utils/index.js'
      },
      formats: ['es', 'umd'],
      name: 'RebelComponents'
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'styles.css'
          return assetInfo.name
        }
      }
    }
  }
})