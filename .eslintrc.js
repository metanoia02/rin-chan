module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: ['google', 'plugin:import/warnings'],
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ['spellcheck'],
  rules: {
    'linebreak-style': 0,
    'max-len': ['error', {code: 120}],
    'spellcheck/spell-checker': [
      'warn',
      {
        identifiers: false,
        strings: true,
        lang: 'en_GB',
        skipIfMatch: [
          'http://[^s]*',
          '^[-\\w]+/[-\\w\\.]+$', // For MIME Types
          '<:\\w+:[0-9]+>',
          '.png',
          '.jpg',
        ],
        skipWords: [
          'dict',
          'aff',
          'hunspellchecker',
          'hunspell',
          'utils',
          'headpat',
          'Rin',
          'Rin-chan',
          'gimme',
          'sql',
        ],
      },
    ],
  },
};
