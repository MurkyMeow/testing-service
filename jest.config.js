module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  cache: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
      transpileOnly: true,
    },
  },
};
