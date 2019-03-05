const jestExpect = global.expect

jestExpect.extend({
  toBeAnUUID(received) {
    const regex = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
    const pass = regex.test(received)
    const message = pass ? () => `Expected ${received} not to be an UUID` : () => `Expected ${received} to be an UUID`
    return { pass, message }
  }
})
