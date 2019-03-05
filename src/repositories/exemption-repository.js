const uuid = require('uuid/v4')
const dbProvider = require('../providers/database-provider')
const { ClanNotFoundError, MemberNotFoundError, InvalidExemptionError } = require('../errors')
const { now, isEmpty } = require('../utils')

async function getAllByClanId(clanId) {
  const db = dbProvider.getInstance()
  const query = {
    TableName: process.env.EXEMPTIONS_TABLE,
    Key: { id: clanId }
  }

  const result = await db.get(query).promise()
  return result.Item ? result.Item.exemptions : {}
}

async function saveClanExemptionProfile(clanId, exemptionProfile) {
  const db = dbProvider.getInstance()
  const query = {
    TableName: process.env.EXEMPTIONS_TABLE,
    Item: {
      id: clanId,
      exemptions: exemptionProfile
    }
  }

  return await db.put(query).promise()
}

module.exports.findAllByClanId = async clanId => {
  return await getAllByClanId(clanId)
}

module.exports.create = async (clanId, exemption) => {
  const { membershipId } = exemption
  const clanExemptionProfile = Object.assign({}, await getAllByClanId(clanId))

  exemption.id = uuid()

  const memberExemptionProfile = {
    membershipId,
    numberExemptions: 0,
    history: []
  }

  if (clanExemptionProfile[membershipId]) {
    memberExemptionProfile.numberExemptions = clanExemptionProfile[membershipId].numberExemptions
    memberExemptionProfile.history = clanExemptionProfile[membershipId].history
  }

  memberExemptionProfile.numberExemptions++
  memberExemptionProfile.history.push(exemption)

  clanExemptionProfile[membershipId] = memberExemptionProfile

  await saveClanExemptionProfile(clanId, clanExemptionProfile)

  return exemption
}

module.exports.update = async (clanId, membershipId, exemption) => {
  const clanExemptionProfile = Object.assign({}, await getAllByClanId(clanId))

  if (isEmpty(clanExemptionProfile)) {
    throw new ClanNotFoundError(clanId)
  }

  if (!clanExemptionProfile[membershipId]) {
    throw new MemberNotFoundError(membershipId)
  }

  const exemptionsHistory = JSON.parse(JSON.stringify(clanExemptionProfile[membershipId].history))
  exemptionsHistory.sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate)
  })

  const latestExemption = exemptionsHistory[exemptionsHistory.length - 1]

  if (now() > latestExemption.endDate) {
    throw new InvalidExemptionError(membershipId)
  }

  const index = clanExemptionProfile[membershipId].history.findIndex(h => h.id === latestExemption.id)
  clanExemptionProfile[membershipId].history[index] = exemption

  await saveClanExemptionProfile(clanId, clanExemptionProfile)

  return exemption
}
