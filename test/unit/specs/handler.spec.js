describe('handler', () => {
  let subject, exemptionRepository, callback, event

  beforeEach(() => {
    callback = td.func()
    event = {
      pathParameters: {
        clanId: 'clan-id'
      }
    }
    exemptionRepository = td.replace('../../../src/repositories/exemption-repository')
    subject = require('../../../src/handler')
  })

  describe('getExemptions', () => {
    describe('when everything is ok', () => {
      beforeEach(async () => {
        td.when(exemptionRepository.findAllByClanId('clan-id')).thenResolve(['the exemptions'])

        subject.getExemptions(event, null, callback)
      })

      it('responds with the clan exemptions', () => {
        td.verify(
          callback(null, {
            statusCode: 200,
            body: JSON.stringify(['the exemptions'])
          })
        )
      })
    })

    describe('when there is an error', () => {
      let error

      beforeEach(async () => {
        error = new Error('oh no')
        td.when(exemptionRepository.findAllByClanId('clan-id')).thenReject(error)

        subject.getExemptions(event, null, callback)
      })

      it('responds with the clan exemptions', () => {
        td.verify(
          callback(error, {
            statusCode: 500,
            body: JSON.stringify(error)
          })
        )
      })
    })
  })

  describe('createExemption', () => {
    describe('when everything is ok', () => {
      beforeEach(async () => {
        const exemption = {
          memershipId: 'membership-id'
        }

        const createdExemption = {
          membershipId: 'membership-id',
          id: 'exemption-id'
        }
        td.when(exemptionRepository.create('clan-id', exemption)).thenResolve(createdExemption)
        event.body = JSON.stringify(exemption)
        subject.createExemption(event, null, callback)
      })

      it('responds with the created exemptions', () => {
        td.verify(
          callback(null, {
            statusCode: 201,
            body: JSON.stringify({
              membershipId: 'membership-id',
              id: 'exemption-id'
            })
          })
        )
      })
    })

    describe('when there is an error', () => {
      let error

      beforeEach(async () => {
        error = new Error('oh no')
        const exemption = {
          memershipId: 'membership-id'
        }
        td.when(exemptionRepository.create('clan-id', exemption)).thenReject(error)
        event.body = JSON.stringify(exemption)
        subject.createExemption(event, null, callback)
      })

      it('responds with an error', () => {
        td.verify(
          callback(error, {
            statusCode: 500,
            body: JSON.stringify(error)
          })
        )
      })
    })
  })

  describe('editExemption', () => {
    describe('when everything is ok', () => {
      beforeEach(async () => {
        const exemption = {
          memershipId: 'membership-id',
          id: 'exemption-id'
        }

        const editedExemption = {
          membershipId: 'membership-id',
          id: 'exemption-id'
        }
        td.when(exemptionRepository.update('clan-id', 'membership-id', exemption)).thenResolve(editedExemption)
        event.pathParameters.membershipId = 'membership-id'
        event.body = JSON.stringify(exemption)
        subject.editExemption(event, null, callback)
      })

      it('responds with the edited exemption', () => {
        td.verify(
          callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              membershipId: 'membership-id',
              id: 'exemption-id'
            })
          })
        )
      })
    })

    describe('when there is an error', () => {
      let error

      beforeEach(async () => {
        const exemption = {
          memershipId: 'membership-id',
          id: 'exemption-id'
        }

        error = new Error('oh no')

        td.when(exemptionRepository.update('clan-id', 'membership-id', exemption)).thenReject(error)
        event.pathParameters.membershipId = 'membership-id'
        event.body = JSON.stringify(exemption)
        subject.editExemption(event, null, callback)
      })

      it('responds with an error', () => {
        td.verify(
          callback(error, {
            statusCode: 500,
            body: JSON.stringify(error)
          })
        )
      })
    })
  })
})
