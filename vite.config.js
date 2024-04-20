import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        demo: './demo.html',
        watch: './watch.html',
        random: './random.html',
        // Add more entries for additional HTML files
      }
    }
  }
})
