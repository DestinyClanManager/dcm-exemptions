class ClanNotFoundError extends Error {
  constructor(clanId, ...rest) {
    const message = `Clan Not Found: No exemptions for clan: ${clanId}`
    super(message, ...rest)
    Error.captureStackTrace(this, ClanNotFoundError)
  }
}

class MemberNotFoundError extends Error {
  constructor(membershipId, ...rest) {
    const message = `Member Not Found: No exemptions for member: ${membershipId}`
    super(message, ...rest)
    Error.captureStackTrace(this, MemberNotFoundError)
  }
}

class InvalidExemptionError extends Error {
  constructor(membershipId, ...rest) {
    const message = `Invalid Exemption: No editible exemptions for member: ${membershipId}`
    super(message, ...rest)
    Error.captureStackTrace(this, InvalidExemptionError)
  }
}

module.exports = {
  ClanNotFoundError,
  MemberNotFoundError,
  InvalidExemptionError
}
