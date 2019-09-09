module.exports = {
  cache: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
      transpileOnly: true,
    },
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
