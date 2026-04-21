// Console setup for jest tests
// Fails tests on console errors

const failOnConsole = require('jest-fail-on-console');

failOnConsole({
  shouldFailOnWarn: false,
  shouldFailOnError: true,
  shouldFailOnDebug: false,
  shouldFailOnInfo: false,
  shouldFailOnLog: false,
});