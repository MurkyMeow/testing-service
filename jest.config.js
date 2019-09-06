module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  cache: true,
  globals: {
    'ts-node': {
      isolatedModules: true,
      transpileOnly: true,
    },
  },
};
