const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8100', // URL de tu app Ionic en ejecución
    supportFile: false,
  },
});
