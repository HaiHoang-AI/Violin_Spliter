import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Sử dụng đường dẫn tương đối để chạy được ở mọi thư mục trên GitHub Pages / Vercel
  build: {
    outDir: 'dist',
  }
});
