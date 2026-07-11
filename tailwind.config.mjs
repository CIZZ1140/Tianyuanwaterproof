/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1.5rem',
				sm: '2rem',
				lg: '3rem',
				xl: '4rem',
				'2xl': '5rem',
			},
		},
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
