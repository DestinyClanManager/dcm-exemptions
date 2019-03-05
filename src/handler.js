const exemptionRepository = require('./repositories/exemption-repository')
const { getStatusCodeFromError } = require('./utils')

function handleError(error, callback) {
  callback(error, {
    statusCode: getStatusCodeFromError(error),
    body: JSON.stringify(error)
  })
}

module.exports.getExemptions = async (event, _context, callback) => {
  const { clanId } = event.pathParameters
  let exemptions

  try {
    exemptions = await exemptionRepository.findAllByClanId(clanId)
  } catch (error) {
    handleError(error, callback)
    return
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(exemptions)
  }

  callback(null, response)
}

module.exports.createExemption = async (event, _context, callback) => {
  const { clanId } = event.pathParameters
  const exemption = JSON.parse(event.body)

  let createdExemption
  try {
    createdExemption = await exemptionRepository.create(clanId, exemption)
  } catch (error) {
    handleError(error, callback)
    return
  }

  const response = {
    statusCode: 201,
    body: JSON.stringify(createdExemption)
  }

  callback(null, response)
}

module.exports.editExemption = async (event, _context, callback) => {
  const { clanId, membershipId } = event.pathParameters
  const exemption = JSON.parse(event.body)

  let editedExemption
  try {
    editedExemption = await exemptionRepository.update(clanId, membershipId, exemption)
  } catch (error) {
    handleError(error, callback)
    return
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(editedExemption)
  }

  callback(null, response)
}
