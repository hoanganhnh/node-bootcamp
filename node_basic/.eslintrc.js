module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: [
		'airbnb-base',
		'prettier',
		'plugin:prettier/recommended',
		'plugin:node/recommended',
	],
	parserOptions: {
		ecmaVersion: 12,
	},
	plugins: ['prettier'],
	rules: {
		'linebreak-style': 0,
		'no-console': 1,
		'no-tabs': 0,
		'no-empty': 1,
		'eol-last': 0,
		'no-undef': 1,
		'no-unused-vars': 1,
		'quote-props': ['error', 'consistent', { keywords: true }],
		'no-useless-escape': 0,
		'import/newline-after-import': [1, { count: 1 }],
		'prettier/prettier': [
			'warn',
			{
				trailingComma: 'all',
				semi: true,
				singleQuote: true,
				useTabs: true,
				endOfLine: 'auto',
				bracketSpacing: true,
			},
		],
	},
};
