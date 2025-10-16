import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // 可选：自定义类名生成规则
      generateScopedName: '[name]__[local]___[hash:5]'
    }
  }
})
