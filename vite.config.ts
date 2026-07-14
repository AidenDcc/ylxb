import { defineConfig } from 'vite'

/**
 * YLXB 根 Vite 配置
 * 仅用于本地开发 —— 作为统一入口，代理所有子应用
 * 生产构建由 scripts/build.sh 负责
 */
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/patient': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/doctor': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/management': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
      '/platform': {
        target: 'http://localhost:3004',
        changeOrigin: true,
      },
    },
  },
})
