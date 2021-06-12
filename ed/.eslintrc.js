module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: [ 'eslint:recommended' ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {
    'max-len': [
      'error',
      {
        code: 140,
        tabWidth: 2,
        comments: 140,
        ignoreUrls: true,
      },
    ],
    'keyword-spacing': 2,
    'key-spacing': [ 'error', { beforeColon: false } ],
    indent: [
      2,
      2,
      {
        VariableDeclarator: {
          var: 2,
          let: 2,
          const: 3,
        },
        SwitchCase: 1,
      },
    ],
    semi: [ 2, 'always' ],
    'no-console': 0,
    'space-before-blocks': 2,
    'prefer-template': 'error',
    quotes: [ 2, 'single', { allowTemplateLiterals: true } ],
    'space-infix-ops': 2,
    'comma-dangle': [ 'error', 'always-multiline' ],
    'comma-spacing': [ 'error', { before: false, after: true } ],
    'object-curly-spacing': [
      'error',
      'always',
      { objectsInObjects: true, arraysInObjects: true },
    ],
    'array-bracket-spacing': [ 'error', 'always', { singleValue: true } ],
    'arrow-spacing': [ 'error', { before: true, after: true } ],
    'no-trailing-spaces': 'error',
    'no-irregular-whitespace': [
      'error',
      {
        skipStrings: true,
        skipComments: true,
        skipRegExps: true,
        skipTemplates: true,
      },
    ],
    'no-multi-spaces': [
      'error',
      {
        ignoreEOLComments: false,
      },
    ],
    strict: [ 'error', 'global' ],
    curly: [ 'error', 'all' ],
    'no-var': 'error',
    'one-var': [ 'error', 'never' ],
    'no-buffer-constructor': 2,
    'brace-style': [ 2, '1tbs', { allowSingleLine: true } ],
  },
  globals: {
    window: true,
    document: true,
  },
};
