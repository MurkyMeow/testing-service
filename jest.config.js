module.exports = {
  testEnvironment: 'node',
  cache: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
      transpileOnly: true,
    },
  },
  moduleFileExtensions: ['js', 'ts', 'vue', 'json'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
  },
};
