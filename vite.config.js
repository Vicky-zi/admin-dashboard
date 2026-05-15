import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  base: '/admin-dashboard/',
  plugins: [
    vue(),
    vuetify({ autoImport: true }),

    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: true,
    }),

    Components({
      resolvers: [VuetifyResolver()],
      dirs: ['src/components'],
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 混淆器設定
  esbuild: {
    /** 打包時移除 console.log */
    pure: ['console.log'],
    /** 打包時移除 debugger */
    drop: ['debugger'],
    /** 打包時移除所有註解 */
    legalComments: 'none',
  },
})
