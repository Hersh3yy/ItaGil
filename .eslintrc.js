module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
    },
    extends: ['plugin:nuxt/recommended'],
    plugins: ['nuxt'],
    // Add custom rules if needed
    parserOptions: {
        ecmaVersion: 2022
    },
    rules: {},
};