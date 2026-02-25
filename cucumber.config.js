const base = {
  requireModule: ['ts-node/register'],
  require: ['tests/steps/**/*.ts'],
  paths: ['tests/features/**/*.feature'],
  timeout: parseInt(process.env.STEP_TIMEOUT ?? '15000', 10),
  retry: parseInt(process.env.CUCUMBER_RETRY ?? '0', 10),
  parallel: 1,
  worldParameters: {
    userServiceUrl: process.env.USER_SERVICE_URL ?? 'http://localhost:3001',
    orderServiceUrl: process.env.ORDER_SERVICE_URL ?? 'http://localhost:3002',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT ?? '10000', 10),
  },
};

module.exports = {
  default: {
    ...base,
    format: ['progress-bar', 'summary'],
  },

  report: {
    ...base,
    format: ['progress-bar', 'html:reports/test-report.html'],
  },

  ci: {
    ...base,
    format: ['json:reports/test-results.json', 'summary'],
    retry: parseInt(process.env.CUCUMBER_RETRY ?? '1', 10),
  },

  allure: {
    ...base,
    format: ['progress-bar', 'allure-cucumberjs/reporter'],
  },
};
