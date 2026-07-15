import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { resolve } from 'path'

export default defineConfig({
  base: '/doctor/',
  plugins: [
    vue(),
    Components({ resolvers: [VantResolver()] }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ylxb/shared': resolve(__dirname, '../shared/src'),
      '@images': resolve(__dirname, '../shared/images'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3002,
  },
})
