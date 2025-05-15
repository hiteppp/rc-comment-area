// vite.config.js 或 vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // 如果需要自定义主题，可以在这里添加 modifyVars
        // modifyVars: {
        //   '@primary-color': '#1DA57A', // 自定义主题颜色
        // },
      },
    },
  },
});