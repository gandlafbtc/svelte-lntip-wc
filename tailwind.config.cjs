/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./packages/lib/src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui:{
		themes:['light','dark']
	}
};
