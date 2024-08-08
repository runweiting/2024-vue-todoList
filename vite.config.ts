import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 要和 GitHub Repo 名稱一致
  base: '/Composition-API-todoList/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
      /*
      使用 path.resolve 函數來解析路徑。path.resolve(__dirname, './src') 會將當前文件夾（由 __dirname 表示）與 ./src 拼接成一個絕對路徑，將 @ 解析為 ./src 目錄的絕對路徑。
      適合在 CommonJS 模塊環境下使用，例如使用 require 代替 import。
      */
    }
  }
})
