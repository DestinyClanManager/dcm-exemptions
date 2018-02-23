const uuid = require('uuid/v4')
const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

function handleError(error, callback) {
  callback(error, {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
}

module.exports.getExemptions = (event, context, callback) => {
  const clanId = event.pathParameters.clanId
  const query = {
    TableName: process.env.EXEMPTIONS_TABLE,
    Key: { id: `${clanId}` }
  }

  dynamoDb.get(query, (error, result) => {
    if (error) {
      handleError(error, callback)
    }

    const response = {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' }
    }

    if (!result.Item) {
      response.body = '{}'
    } else {
      response.body = JSON.stringify(result.Item.exemptions)
    }

    callback(null, response)
  })
}

module.exports.createExemption = (event, context, callback) => {
  const clanId = event.pathParameters.clanId
  const newExemption = JSON.parse(event.body)

  newExemption.id = uuid()

  const getExemptionsQuery = {
    TableName: process.env.EXEMPTIONS_TABLE,
    Key: { id: `${clanId}` }
  }

  dynamoDb.get(getExemptionsQuery, (error, result) => {
    if (error) {
      handleError(error, callback)
    }

    if (!result.Item) {
      createExemptionProfile(clanId, newExemption, callback)
      return
    }

    const exemptions = result.Item.exemptions

    if (exemptions[newExemption.membershipId]) {
      const memberExemptionProfile = exemptions[newExemption.membershipId]

      memberExemptionProfile.history.push(newExemption)
      memberExemptionProfile.numberExemptions++
    } else {
      exemptions[newExemption.membershipId] = {
        membershipId: newExemption.membershipId,
        numberExemptions: 1,
        history: [newExemption]
      }
    }

    const putQuery = {
      TableName: process.env.EXEMPTIONS_TABLE,
      Item: {
        id: `${clanId}`,
        exemptions
      }
    }

    dynamoDb.put(putQuery, error => {
      if (error) {
        handleError(error, callback)
      }

      callback(null, {
        statusCode: 201,
        body: JSON.stringify(newExemption),
        headers: { 'Access-Control-Allow-Origin': '*' }
      })
    })
  })
}

function createExemptionProfile(clanId, newExemption, callback) {
  const exemptions = {}
  exemptions[newExemption.membershipId] = {
    membershipId: newExemption.membershipId,
    numberExemptions: 1,
    history: [newExemption]
  }

  const createClanQuery = {
    TableName: process.env.EXEMPTIONS_TABLE,
    Item: {
      id: `${clanId}`,
      exemptions
    }
  }

  dynamoDb.put(createClanQuery, error => {
    if (error) {
      handleError(error, callback)
    }

    callback(null, {
      statusCode: 201,
      body: JSON.stringify(newExemption)
    })
  })
}
