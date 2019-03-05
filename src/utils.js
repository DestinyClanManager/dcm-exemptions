const moment = require('moment')
const { ClanNotFoundError, MemberNotFoundError, InvalidExemptionError } = require('./errors')

module.exports.now = () => moment.utc().format()

module.exports.getStatusCodeFromError = error => {
  if (error instanceof ClanNotFoundError) {
    return 404
  }

  if (error instanceof MemberNotFoundError) {
    return 404
  }

  if (error instanceof InvalidExemptionError) {
    return 400
  }

  return 500
}

module.exports.isEmpty = obj => {
  if (Array.isArray(obj)) {
    return obj.length === 0
  }

  if (typeof obj === 'string') {
    return obj.length === 0
  }

  return Object.keys(obj).length === 0
}
