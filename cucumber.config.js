/**
 * PHASE 2: BDD TEST RUNNER CONFIGURATION
 * This file acts as the "Control Center" for Cucumber.js.
 * It tells the runner where to find the Feature files and the Step Definitions.
 */
const base = {
  // Enables TypeScript support so we can run .ts files directly without pre-compiling.
  requireModule: ['ts-node/register'],
  
  // PATH MAPPING: Tells Cucumber where the 'How' (Steps) and 'What' (Features) live.
  require: ['tests/steps/**/*.ts'],
  paths: ['tests/features/**/*.feature'],
  
  // EXECUTION LIMITS: Prevents the test from hanging indefinitely if a service is slow.
  timeout: parseInt(process.env.STEP_TIMEOUT ?? '15000', 10),
  retry: parseInt(process.env.CUCUMBER_RETRY ?? '0', 10),
  parallel: 1, // Set to 1 to ensure the User-to-Order journey runs in the correct sequence.

  // WORLD PARAMETERS: These are the global variables passed into the Step Definitions.
  // This allows us to point to different URLs (localhost vs Docker) without changing code.
  worldParameters: {
    userServiceUrl: process.env.USER_SERVICE_URL ?? 'http://localhost:3001',
    orderServiceUrl: process.env.ORDER_SERVICE_URL ?? 'http://localhost:3002',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT ?? '10000', 10),
  },
};

module.exports = {
  // DEFAULT PROFILE: Used for local development (npm test).
  // Shows a clean progress bar and a text summary in the terminal.
  default: {
    ...base,
    format: ['progress-bar', 'summary'],
  },

  // REPORT PROFILE: Generates a standard HTML report for a quick local visual check.
  report: {
    ...base,
    format: ['progress-bar', 'html:reports/test-report.html'],
  },

  // CI PROFILE: Optimized for GitHub Actions.
  // Generates a JSON file for the pipeline to parse and enables 1 retry for stability.
  ci: {
    ...base,
    format: ['json:reports/test-results.json', 'summary'],
    retry: parseInt(process.env.CUCUMBER_RETRY ?? '1', 10),
  },

  // ALLURE PROFILE: Generates the advanced data needed for the Allure Dashboard.
  // This satisfies the "Reporting" requirement of the assessment.
  allure: {
    ...base,
    format: ['progress-bar', 'allure-cucumberjs/reporter'],
  },
};
