
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    video: false, // this will create a vdo folder an create vdo file for test record if we does not want that make it false 
    screenshotOnRunFailure: true,
  },
});
