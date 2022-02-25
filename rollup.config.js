import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

const isProduction = process.env.NODE_ENV === 'production'

export default {
	input: 'src/js/_common.js',
	output: [{
		file: 'docs/assets/js/common.js',
		format: 'iife',
	}, ],
	plugins: [
		resolve(),
		babel(),
		isProduction && terser(),
	]
}
