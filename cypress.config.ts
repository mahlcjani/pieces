import { defineConfig } from "cypress";

export default defineConfig({
  reporter: "json",
  reporterOptions: {
    output: "cypress/test-results/e2e.json"
  },
//https://github.com/you54f/cypress-multi-reporters
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
