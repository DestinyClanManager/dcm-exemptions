describe('exemption repository', () => {
  let subject, dbProvider, get, put, ClanNotFoundError, MemberNotFoundError, InvalidExemptionError, utils

  beforeEach(() => {
    const errors = require('../../../../src/errors')

    ClanNotFoundError = errors.ClanNotFoundError
    MemberNotFoundError = errors.MemberNotFoundError
    InvalidExemptionError = errors.InvalidExemptionError
    utils = td.replace('../../../../src/utils')
    dbProvider = td.replace('../../../../src/providers/database-provider')
    subject = require('../../../../src/repositories/exemption-repository')

    get = td.func()
    put = td.func()
    td.when(dbProvider.getInstance()).thenReturn({ get, put })
  })

  describe('findAllByClanId', () => {
    let actual

    describe('when the clan has exemptions', () => {
      beforeEach(async () => {
        const promise = td.func()

        td.when(get(td.matchers.anything())).thenReturn({ promise })
        td.when(promise()).thenResolve({
          Item: {
            exemptions: 'the-exemptions'
          }
        })

        actual = await subject.findAllByClanId('clan-id')
      })

      it('builds the correct query', () => {
        const expectedQuery = {
          TableName: 'exemptions_table',
          Key: { id: 'clan-id' }
        }
        td.verify(get(expectedQuery))
      })

      it('returns the clans exemptions', () => {
        expect(actual).toEqual('the-exemptions')
      })
    })

    describe('when the clan has no exemptions', () => {
      beforeEach(async () => {
        const promise = td.func()

        td.when(get(td.matchers.anything())).thenReturn({ promise })
        td.when(promise()).thenResolve({})

        actual = await subject.findAllByClanId('clan-id')
      })

      it('builds the correct query', () => {
        const expectedQuery = {
          TableName: 'exemptions_table',
          Key: { id: 'clan-id' }
        }
        td.verify(get(expectedQuery))
      })

      it('returns the clans exemptions', () => {
        expect(actual).toEqual({})
      })
    })
  })

  describe('create', () => {
    let actual

    describe('when the clan has no exemptions', () => {
      beforeEach(async () => {
        const promise = td.func()

        const initialQuery = {
          TableName: 'exemptions_table',
          Key: { id: 'clan-id' }
        }
        td.when(get(initialQuery)).thenReturn({ promise })
        td.when(put(td.matchers.anything())).thenReturn({ promise })
        td.when(promise()).thenResolve({})

        const exemption = {
          membershipId: 'membership-id'
        }
        actual = await subject.create('clan-id', exemption)
      })

      it('creates an exemption profile', () => {
        const expectedQuery = {
          TableName: 'exemptions_table',
          Item: {
            id: 'clan-id',
            exemptions: {
              'membership-id': {
                history: [actual],
                numberExemptions: 1,
                membershipId: 'membership-id'
              }
            }
          }
        }
        td.verify(put(expectedQuery))
      })

      it('returns the created exemption', () => {
        expect(actual.membershipId).toEqual('membership-id')
        expect(actual.id).toBeAnUUID()
      })
    })

    describe('when there are exemptions, but not for the member', () => {
      beforeEach(async () => {
        const promise = td.func()

        const initialQuery = {
          TableName: 'exemptions_table',
          Key: { id: 'clan-id' }
        }
        td.when(get(initialQuery)).thenReturn({ promise })
        td.when(put(td.matchers.anything())).thenReturn({ promise })
        td.when(promise()).thenResolve({
          Item: {
            id: 'clan-id',
            exemptions: {
              'existing-membership-id': {}
            }
          }
        })

        const exemption = {
          membershipId: 'membership-id'
        }
        actual = await subject.create('clan-id', exemption)
      })

      it('creates an exemption profile', () => {
        const expectedQuery = {
          TableName: 'exemptions_table',
          Item: {
            id: 'clan-id',
            exemptions: {
              'existing-membership-id': {},
              'membership-id': {
                history: [actual],
                numberExemptions: 1,
                membershipId: 'membership-id'
              }
            }
          }
        }
        td.verify(put(expectedQuery))
      })
    })

    describe('when the member has previous exemptions', () => {
      beforeEach(async () => {
        const promise = td.func()

        const initialQuery = {
          TableName: 'exemptions_table',
          Key: { id: 'clan-id' }
        }
        td.when(get(initialQuery)).thenReturn({ promise })
        td.when(put(td.matchers.anything())).thenReturn({ promise })
        td.when(promise()).thenResolve({
          Item: {
            id: 'clan-id',
            exemptions: {
              'existing-membership-id': {},
              'membership-id': {
                membershipId: 'membership-id',
                numberExemptions: 3,
                history: ['exemption-1', 'exemption-2', 'exemption-3']
              }
            }
          }
        })

        const exemption = {
          membershipId: 'membership-id'
        }
        actual = await subject.create('clan-id', exemption)
      })

      it('creates an exemption profile', () => {
        const expectedQuery = {
          TableName: 'exemptions_table',
          Item: {
            id: 'clan-id',
            exemptions: {
              'existing-membership-id': {},
              'membership-id': {
                membershipId: 'membership-id',
                numberExemptions: 4,
                history: ['exemption-1', 'exemption-2', 'exemption-3', actual]
              }
            }
          }
        }
        td.verify(put(expectedQuery))
      })
    })
  })

  describe('update', () => {
    let actual

    describe('when the clan has no exemptions', () => {
      let error

      beforeEach(async () => {
        const promise = td.func()

        const initialQuery = {
          TableName: 'exemptions_table',
          Key: { id: 'clan-id' }
        }

        td.when(utils.isEmpty({})).thenReturn(true)
        td.when(get(initialQuery)).thenReturn({ promise })
        td.when(promise()).thenResolve({})

        const exemption = {
          membershipId: 'membership-id'
        }
        try {
          actual = await subject.update('clan-id', 'membership-id', exemption)
        } catch (e) {
          error = e
        }
      })

      it('throws a ClanNotFound error', () => {
        expect(error).toBeInstanceOf(ClanNotFoundError)
      })
    })

    describe('when the member has no exemptions', () => {
      let error

      beforeEach(async () => {
        const promise = td.func()

        const initialQuery = {
          TableName: 'exemptions_table',
          Key: { id: 'clan-id' }
        }

        td.when(utils.isEmpty(td.matchers.anything())).thenReturn(false)
        td.when(get(initialQuery)).thenReturn({ promise })
        td.when(promise()).thenResolve({
          Item: {
            exemptions: {
              'other-membership-id': 'exemptions'
            }
          }
        })

        const exemption = {
          membershipId: 'membership-id'
        }
        try {
          actual = await subject.update('clan-id', 'membership-id', exemption)
        } catch (e) {
          error = e
        }
      })

      it('throws a MemberNotFound error', () => {
        expect(error).toBeInstanceOf(MemberNotFoundError)
      })
    })

    describe('when the member does not have an active exemption', () => {
      let error

      beforeEach(async () => {
        const promise = td.func()

        const initialQuery = {
          TableName: 'exemptions_table',
          Key: { id: 'clan-id' }
        }

        td.when(utils.isEmpty(td.matchers.anything())).thenReturn(false)
        td.when(utils.now()).thenReturn('2019-03-04')
        td.when(get(initialQuery)).thenReturn({ promise })
        td.when(promise()).thenResolve({
          Item: {
            exemptions: {
              'membership-id': {
                history: [{ startDate: '1983-02-19', endDate: '1983-03-19' }, { startDate: '1983-06-04', endDate: '1983-07-04' }]
              }
            }
          }
        })

        const exemption = {
          membershipId: 'membership-id'
        }
        try {
          actual = await subject.update('clan-id', 'membership-id', exemption)
        } catch (e) {
          error = e
        }
      })

      it('throws an InvalidExemptionError error', () => {
        expect(error).toBeInstanceOf(InvalidExemptionError)
      })
    })

    describe('when the member has an active exemption', () => {
      beforeEach(async () => {
        const promise = td.func()
        const putPromise = td.func()

        const initialQuery = {
          TableName: 'exemptions_table',
          Key: { id: 'clan-id' }
        }
        td.when(utils.now()).thenReturn('2019-03-16')
        td.when(get(initialQuery)).thenReturn({ promise })
        td.when(promise()).thenResolve({
          Item: {
            exemptions: {
              'membership-id': {
                history: [
                  {
                    adminMembershipId: 'admin-membership-id',
                    adminMembershipType: 'bungienet',
                    membershipId: 'membership-id',
                    id: 'exemption-1',
                    startDate: '1983-02-19',
                    endDate: '1983-03-19'
                  },
                  {
                    adminMembershipId: 'admin-membership-id',
                    adminMembershipType: 'bungienet',
                    membershipId: 'membership-id',
                    id: 'exemption-2',
                    startDate: '2019-03-04',
                    endDate: '2019-04-04'
                  }
                ]
              }
            }
          }
        })

        td.when(put(td.matchers.anything())).thenReturn({ promise: putPromise })

        const exemption = {
          adminMembershipId: 'admin-membership-id',
          adminMembershipType: 'bungienet',
          membershipId: 'membership-id',
          startDate: '2019-03-04',
          endDate: '2019-03-25',
          id: 'exemption-2'
        }
        actual = await subject.update('clan-id', 'membership-id', exemption)
      })

      it('updates the exemption with new values', () => {
        const expectedQuery = {
          TableName: 'exemptions_table',
          Item: {
            id: 'clan-id',
            exemptions: {
              'membership-id': {
                history: [
                  {
                    adminMembershipId: 'admin-membership-id',
                    adminMembershipType: 'bungienet',
                    membershipId: 'membership-id',
                    id: 'exemption-1',
                    startDate: '1983-02-19',
                    endDate: '1983-03-19'
                  },
                  {
                    adminMembershipId: 'admin-membership-id',
                    adminMembershipType: 'bungienet',
                    membershipId: 'membership-id',
                    id: 'exemption-2',
                    startDate: '2019-03-04',
                    endDate: '2019-03-25'
                  }
                ]
              }
            }
          }
        }
        td.verify(put(expectedQuery))
      })

      it('returns the edited exemption', () => {
        expect(actual).toEqual({
          adminMembershipId: 'admin-membership-id',
          adminMembershipType: 'bungienet',
          membershipId: 'membership-id',
          startDate: '2019-03-04',
          endDate: '2019-03-25',
          id: 'exemption-2'
        })
      })
    })
  })
})
