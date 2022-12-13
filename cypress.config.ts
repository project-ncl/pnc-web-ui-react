import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    baseUrl: 'http://localhost:3000/pnc-web/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
