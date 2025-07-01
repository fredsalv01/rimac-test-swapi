// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|mjs)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    // Transforma p-limit y yocto-queue, pero ignora otros node_modules
    'node_modules/(?!p-limit|yocto-queue)'
  ],
};
