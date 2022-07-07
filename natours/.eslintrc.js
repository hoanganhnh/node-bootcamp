module.exports = {
	env: {
		browser: true,
		es2021: true,
		commonjs: true,
	},
	extends: [
		'airbnb-base',
		'prettier',
		'plugin:prettier/recommended',
		'plugin:node/recommended',
	],
	plugins: ['prettier'],
	parserOptions: {
		ecmaVersion: 13,
	},
	rules: {
		'no-console': 0,
		'no-tabs': 0,
		'no-empty': 1,
		'eol-last': 0,
		'no-undef': 2,
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
