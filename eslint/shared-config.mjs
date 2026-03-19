import deMorgan from 'eslint-plugin-de-morgan'
import { defineConfig } from 'eslint/config'
import eslintPluginFormat from 'eslint-plugin-format'
import prettier from 'prettier'
import globals from 'globals'
import { createNodeResolver, importX } from 'eslint-plugin-import-x'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import eslintPluginJs from '@eslint/js'
import eslintJsonPlugin from 'eslint-plugin-jsonc'
import eslintJsxa11yPlugin from 'eslint-plugin-jsx-a11y'
import eslintReactPlugin from '@eslint-react/eslint-plugin'
import eslintReactHooksPlugin from 'eslint-plugin-react-hooks'
import * as regexpPlugin from 'eslint-plugin-regexp'
import tseslint, { parser } from 'typescript-eslint'
import eslintSonarPlugin from 'eslint-plugin-sonarjs'
import eslintTanstackQueryPlugin from '@tanstack/eslint-plugin-query'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintUnusedImportsPlugin from 'eslint-plugin-unused-imports'
import eslintStylisticPlugin from '@stylistic/eslint-plugin'

//#region src/shared/constants/globs.ts
const GLOB_JS = '**/*.?([cm])js'
const GLOB_JSX = '**/*.?([cm])jsx'
const GLOB_TS = '**/*.?([cm])ts'
const GLOB_TSX = '**/*.?([cm])tsx'
const GLOB_DTS = '**/*.d.?([cm])ts'
const GLOB_ALL_SRC = [GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX, GLOB_DTS]
const GLOB_JSON = '**/*.json'
const GLOB_JSON5 = '**/*.json5'
const GLOB_JSONC = '**/*.jsonc'
const GLOB_EXCLUDE = [
	'**/node_modules',
	'**/dist',
	'**/package.json',
	'**/package-lock.json',
	'**/yarn.lock',
	'**/pnpm-lock.yaml',
	'**/bun.lockb',
	'**/output',
	'**/coverage',
	'**/temp',
	'**/.temp',
	'**/tmp',
	'**/.tmp',
	'**/.history',
	'**/.vitepress/cache',
	'**/.nuxt',
	'**/.next',
	'**/.svelte-kit',
	'**/.vercel',
	'**/.changeset',
	'**/.idea',
	'**/.cache',
	'**/.output',
	'**/.vite-inspect',
	'**/.yarn',
	'**/vite.config.*.timestamp-*',
	'**/CHANGELOG*.md',
	'**/*.min.*',
	'**/LICENSE*',
	'**/__snapshots__',
	'**/auto-import?(s).d.ts',
	'**/components.d.ts',
]

//#endregion
//#region src/section/de-morgan/section/de-morgan-section.ts
async function createDeMorganSection() {
	return defineConfig({
		extends: [deMorgan.configs.recommended],
		files: GLOB_ALL_SRC,
		name: 'section:de-morgan:setup',
	})
}

//#endregion
//#region src/section/exclude/section/exclude-section.ts
async function createExcludeSection() {
	return defineConfig({
		ignores: GLOB_EXCLUDE,
		name: 'section:exclude:setup',
	})
}

//#endregion
//#region src/section/format/rules/format-rules.ts
function createFormatRules(prettierConfig) {
	return defineConfig(
		{
			name: 'section:format:rules:javascript',
			files: [GLOB_JS, GLOB_JSX],
			languageOptions: { parser: eslintPluginFormat.parserPlain },
			rules: {
				'format/prettier': [
					'error',
					{
						...prettierConfig,
						parser: 'babel',
					},
				],
			},
		},
		{
			name: 'section:format:rules:typescript',
			files: [GLOB_TS, GLOB_TSX, GLOB_DTS],
			languageOptions: { parser: eslintPluginFormat.parserPlain },
			rules: {
				'format/prettier': [
					'error',
					{
						...prettierConfig,
						parser: 'typescript',
					},
				],
			},
		},
		{
			name: 'section:format:rules:json',
			files: [GLOB_JSON],
			languageOptions: { parser: eslintPluginFormat.parserPlain },
			rules: {
				'format/prettier': [
					'error',
					{
						...prettierConfig,
						parser: 'json',
					},
				],
			},
		},
		{
			name: 'section:format:rules:json5',
			files: [GLOB_JSON5],
			languageOptions: { parser: eslintPluginFormat.parserPlain },
			rules: {
				'format/prettier': [
					'error',
					{
						...prettierConfig,
						parser: 'json5',
					},
				],
			},
		},
		{
			name: 'section:format:rules:jsonc',
			files: [GLOB_JSONC],
			languageOptions: { parser: eslintPluginFormat.parserPlain },
			rules: {
				'format/prettier': [
					'error',
					{
						...prettierConfig,
						parser: 'jsonc',
					},
				],
			},
		}
	)
}

//#endregion
//#region src/section/format/section/format-section.ts
async function createFormatSection() {
	let prettierConfig = {}
	const prettierConfigPath = await prettier.resolveConfigFile()
	if (prettierConfigPath) {
		const resolvedPrettierConfig = await prettier.resolveConfig(prettierConfigPath)
		if (resolvedPrettierConfig)
			if ('default' in resolvedPrettierConfig) prettierConfig = resolvedPrettierConfig['default']
			else prettierConfig = resolvedPrettierConfig
	}
	return defineConfig(
		{
			name: 'section:format:setup',
			plugins: { format: eslintPluginFormat },
		},
		createFormatRules(prettierConfig)
	)
}

//#endregion
//#region src/section/global/section/global-section.ts
async function createGlobalSectionFabric() {
	return defineConfig({
		name: 'section:global:setup',
		files: GLOB_ALL_SRC,
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.builtin,
				...globals.browser,
				...globals.node,
				...globals.serviceworker,
			},
		},
	})
}

//#endregion
//#region src/section/import/rules/import-rules.ts
function createImportRules() {
	return defineConfig({
		name: 'section:import:rules',
		files: GLOB_ALL_SRC,
		rules: { 'import-x/order': 'error' },
	})
}

//#endregion
//#region src/section/import/section/import-section.ts
async function createImportSection() {
	return defineConfig(
		{
			name: 'section:import:setup',
			extends: [importX.configs['flat/recommended'], importX.configs['flat/typescript']],
			plugins: { 'import-x': importX },
			settings: {
				'import-x/resolver-next': [createTypeScriptImportResolver({ alwaysTryTypes: true }), createNodeResolver()],
			},
		},
		createImportRules()
	)
}

//#endregion
//#region src/section/javascript/section/javascript-section.ts
async function createJavascriptSection() {
	return defineConfig({
		name: 'section:javascript:setup',
		files: GLOB_ALL_SRC,
		extends: [eslintPluginJs.configs.recommended],
	})
}

//#endregion
//#region src/section/json/section/json-section.ts
async function createJsonSection() {
	return defineConfig(
		{
			name: 'section:json:setup',
			files: [GLOB_JSON],
			extends: [...eslintJsonPlugin.configs['flat/recommended-with-json']],
		},
		{
			name: 'section:json5:setup',
			files: [GLOB_JSON5],
			extends: [...eslintJsonPlugin.configs['flat/recommended-with-json5']],
		},
		{
			name: 'section:jsonc:setup',
			files: [GLOB_JSONC],
			extends: [...eslintJsonPlugin.configs['flat/recommended-with-jsonc']],
		}
	)
}

//#endregion
//#region src/section/jsx-a11y/section/jsx-a11y-section.ts
async function createJsxA11ySection() {
	return defineConfig({
		name: 'section:jsx-a11y:setup',
		files: GLOB_ALL_SRC,
		extends: [eslintJsxa11yPlugin.flatConfigs.recommended],
	})
}

//#endregion
//#region src/section/react/rules/react-rules.ts
function createReactRules() {
	return defineConfig({
		name: 'section:react:rules',
		files: [GLOB_JSX, GLOB_TSX],
		rules: {
			// "@eslint-react/naming-convention/filename": ["error", { rule: "kebab-case" }],
			// "@eslint-react/naming-convention/filename-extension": ["error", "as-needed"]
		},
	})
}

//#endregion
//#region src/section/react/section/react-section.ts
async function createReactSection() {
	return defineConfig(
		{
			name: 'section:react:setup:strict',
			files: [GLOB_JS, GLOB_JSX],
			extends: [eslintReactPlugin.configs.strict],
		},
		{
			name: 'section:react:setup:strict-type-checked',
			files: [GLOB_TS, GLOB_TSX],
			extends: [eslintReactPlugin.configs['strict-type-checked']],
		},
		createReactRules()
	)
}

//#endregion
//#region src/section/react-hooks/section/react-hooks-section.ts
async function createReactHooksSection() {
	return defineConfig({
		name: 'section:react-hooks:setup',
		files: GLOB_ALL_SRC,
		extends: [eslintReactHooksPlugin.configs.flat['recommended-latest']],
	})
}

//#endregion
//#region src/section/regexp/section/regexp-section.ts
async function createRegexpSection() {
	return defineConfig({
		name: 'section:regexp:setup',
		files: GLOB_ALL_SRC,
		extends: [regexpPlugin.configs['flat/recommended']],
	})
}

//#endregion
//#region src/section/typescript/section/typescript-section.ts
async function createTypescriptSection() {
	return defineConfig(
		{
			name: 'section:typescript:setup-typescript',
			files: [GLOB_TS, GLOB_TSX, GLOB_DTS],
			extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
			languageOptions: {
				parser,
				parserOptions: {
					tsconfigRootDir: process.cwd(),
					projectService: true,
					sourceType: 'module',
					ecmaVersion: 'latest',
					ecmaFeatures: { jsx: true },
				},
			},
		},
		{
			name: 'section:typescript:setup-javascript',
			files: [GLOB_JS, GLOB_JSX],
			extends: [tseslint.configs.disableTypeChecked],
		}
	)
}

//#endregion
//#region src/section/sonar/section/sonar-sections.ts
async function createSonarSection() {
	return defineConfig({
		name: 'section:sonar:setup',
		files: GLOB_ALL_SRC,
		extends: [eslintSonarPlugin.configs.recommended],
	})
}

//#endregion
//#region src/section/tanstack-query/section/tanstack-query-section.ts
async function createTanstackQuerySection() {
	return defineConfig({
		name: 'section:tanstack-query:setup',
		files: GLOB_ALL_SRC,
		extends: [eslintTanstackQueryPlugin.configs['flat/recommended']],
	})
}

//#endregion
//#region src/section/unicorn/rules/unicorn-rules.ts
function createUnicornRules() {
	return defineConfig({
		name: 'section:unicorn:rules',
		files: GLOB_ALL_SRC,
		rules: {
			'unicorn/filename-case': ['error', { cases: { kebabCase: true } }],
			'unicorn/prefer-ternary': 'off',
			'unicorn/no-null': 'off',
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-useless-undefined': 'off',
		},
	})
}

//#endregion
//#region src/section/unicorn/section/unicorn-section.ts
async function createUnicornSection() {
	return defineConfig(
		{
			name: 'section:unicorn:setup',
			files: GLOB_ALL_SRC,
			extends: [eslintPluginUnicorn.configs.recommended],
		},
		createUnicornRules()
	)
}

//#endregion
//#region src/section/unused-imports/rules/unused-imports-rules.ts
function createUnusedImportsRules() {
	return defineConfig({
		name: 'section:unused-imports:rules',
		files: GLOB_ALL_SRC,
		rules: {
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
		},
	})
}

//#endregion
//#region src/section/unused-imports/section/unused-imports-sections.ts
async function createUnusedImportsSection() {
	return defineConfig(
		{
			name: 'section:unused-imports:setup',
			files: GLOB_ALL_SRC,
			plugins: { 'unused-imports': eslintUnusedImportsPlugin },
		},
		createUnusedImportsRules()
	)
}

//#endregion
//#region src/section/stylistic/rules/stylistic-rules.ts
function createStylisticRules() {
	return defineConfig({
		name: 'section:stylistic:rules:jsx',
		files: [GLOB_JSX, GLOB_TSX],
		rules: {
			'@stylistic/jsx-curly-brace-presence': [
				'error',
				{
					props: 'never',
					children: 'never',
					propElementValues: 'always',
				},
			],
			// "@stylistic/jsx-sort-props": ["error", {
			// 	callbacksLast: true,
			// 	shorthandFirst: true,
			// 	shorthandLast: false,
			// 	multiline: "last",
			// 	ignoreCase: true,
			// 	noSortAlphabetically: false,
			// 	reservedFirst: [
			// 		"key",
			// 		"ref",
			// 		"className",
			// 		"as"
			// 	],
			// 	locale: "en-US"
			// }],
			'@stylistic/jsx-self-closing-comp': [
				'error',
				{
					component: true,
					html: false,
				},
			],
		},
	})
}

//#endregion
//#region src/section/stylistic/section/stylistic-section.ts
async function createStylisticSection() {
	return defineConfig(
		{
			name: 'section:stylistic:setup',
			plugins: { '@stylistic': eslintStylisticPlugin },
		},
		createStylisticRules()
	)
}

//#endregion
//#region src/fabric/eslint-config/fabric/eslint-config-fabric.ts
async function createEslintConfig() {
	const awaitingSections = [
		createExcludeSection(),
		createGlobalSectionFabric(),
		createFormatSection(),
		createStylisticSection(),
		createJavascriptSection(),
		createTypescriptSection(),
		createDeMorganSection(),
		createImportSection(),
		createJsonSection(),
		createJsxA11ySection(),
		createReactSection(),
		createReactHooksSection(),
		createRegexpSection(),
		createSonarSection(),
		createTanstackQuerySection(),
		createUnicornSection(),
		createUnusedImportsSection(),
	]
	return defineConfig(await Promise.all(awaitingSections))
}

//#endregion
export { createEslintConfig }
//# sourceMappingURL=index.mjs.map
