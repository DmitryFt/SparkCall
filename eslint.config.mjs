import { defineConfig, globalIgnores } from 'eslint/config'
import { createEslintConfig } from './eslint/shared-config.mjs'

export default defineConfig([
	globalIgnores([
		'**/ios/**',
		'**/android/**',
		'**/vendor/**',
		'**/.vscode/**',
		'**/*.config.*',
		'**/*.setup.*',
		'eslint/**',
		'index.js',
	]),
	...(await createEslintConfig()),
])
