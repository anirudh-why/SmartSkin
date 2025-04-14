module.exports = {
  extends: ['react-app'],
  // Disable the problematic ESLint rules
  rules: {
    'import/no-anonymous-default-export': 'off',
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.jsx'],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
    },
  ],
}; 