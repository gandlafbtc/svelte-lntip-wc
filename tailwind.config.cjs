/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./packages/lib/src/**/*.{svelte}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui:{
		themes:['light','dark']
	}
};
