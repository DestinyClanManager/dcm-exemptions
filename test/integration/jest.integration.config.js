const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname),
  moduleFileExtensions: ['js', 'json'],
  setupFiles: ['<rootDir>/integration.env.setup'],
  setupFilesAfterEnv: ['<rootDir>/jest-uuid'],
  testResultsProcessor: '<rootDir>/integration-result-reporter.js'
}
