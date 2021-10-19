module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  rules : {
    'lines-between-class-members': 0,
    "@typescript-eslint/lines-between-class-members": 0,
    'class-methods-use-this': 0,
    "object-curly-newline": ["error", {
      "ImportDeclaration": "never",
    }],
    "import/no-dynamic-require": 0,
    "global-require": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "max-len": ["error", 120]
  },
  "ignorePatterns": ["src/**/*.js", "db-migrations/**/*.js", ".eslintrc.js"],
};
