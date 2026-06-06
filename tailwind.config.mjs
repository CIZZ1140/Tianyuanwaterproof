/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				navy: '#06284c',
				deep: '#031b33',
				brand: '#005bd8',
				accent: '#ff7a1a',
				line: '#dbe7f5'
			},
			boxShadow: {
				card: '0 10px 30px rgba(6, 40, 76, 0.08)'
			}
		},
	},
	plugins: [],
}
