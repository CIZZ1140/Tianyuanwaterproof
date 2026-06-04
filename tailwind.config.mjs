/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B2A4A',
        industrial: '#0F3D66',
        accent: '#F59E0B',
        slateText: '#334155'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.10)'
      }
    }
  },
  plugins: []
};
