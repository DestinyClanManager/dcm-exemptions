const { spawn } = require('child_process')
const argv = require('yargs')
  .usage('Usage: $0 --aws-access-key-id your-acess-id --aws-secret-key your-secret-key')
  .example('$0 --aws-access-key-id {AWS_ACCESS_KEY} --aws-secret-key {AWS_SECRET_KEY}', 'Run the integration test suite and clean up the test database when finished')
  .describe('aws-access-key-id', 'The access key ID for your IAM account')
  .describe('aws-secret-key', 'The secret key for your IAM account')
  .demandOption(['aws-access-key-id', 'aws-secret-key'])
  .help('h')
  .alias('h', 'help').argv

function runIntegrationSuite() {
  const awsVars = {
    AWS_ACCESS_KEY_ID: argv.awsAccessKeyId,
    AWS_SECRET_ACCESS_KEY: argv.awsSecretKey
  }
  const env = Object.assign({}, process.env, awsVars)
  const jestArgs = ['--config', 'test/integration/jest.integration.config.js']
  return spawn('./node_modules/.bin/jest', jestArgs, {
    cwd: undefined,
    env
  })
}

const jest = runIntegrationSuite()
jest.stdout.on('data', data => console.log(data.toString()))
jest.stderr.on('data', data => console.error(data.toString()))
jest.on('close', code => process.exit(code))
