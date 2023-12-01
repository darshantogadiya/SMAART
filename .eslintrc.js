module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@babel/eslint-parser',
  plugins: ['react'],
  extends: ['plugin:react/recommended'],
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/prop-types': 'off',
  },
};
