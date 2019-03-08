const supertest = require('supertest')
const idRegex = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)

describe('Exemption API', () => {
  let request, createdExemption, editedExemption

  beforeEach(() => {
    request = supertest(process.env.BASE_URL)
  })

  describe('createExemption', () => {
    beforeEach(async () => {
      const exemption = {
        adminMembershipId: 'admin-membership-id',
        adminMembershipType: 'bungienet',
        startDate: '2019-02-12',
        endDate: '2019-03-12',
        membershipId: 'membership-id'
      }
      const response = await request
        .post('/clan-id')
        .send(exemption)
        .expect(201)

      createdExemption = response.body
    })

    it('returns the created exemption', () => {
      expect(createdExemption.adminMembershipId).toEqual('admin-membership-id')
      expect(createdExemption.adminMembershipType).toEqual('bungienet')
      expect(createdExemption.startDate).toEqual('2019-02-12')
      expect(createdExemption.endDate).toEqual('2019-03-12')
      expect(createdExemption.membershipId).toEqual('membership-id')
      expect(createdExemption.id).toBeUUID()
    })
  })

  describe('editExemption', () => {
    beforeEach(async () => {
      const edit = Object.assign({}, createdExemption, {
        endDate: '2019-02-22'
      })
      const response = await request
        .put(`/clan-id/membership-id`)
        .send(edit)
        .expect(200)

      editedExemption = response.body
    })

    it('returns the edited exemption', () => {
      expect(editedExemption.adminMembershipId).toEqual('admin-membership-id')
      expect(editedExemption.adminMembershipType).toEqual('bungienet')
      expect(editedExemption.startDate).toEqual('2019-02-12')
      expect(editedExemption.endDate).toEqual('2019-02-22')
      expect(editedExemption.membershipId).toEqual('membership-id')
      expect(editedExemption.id).toEqual(createdExemption.id)
    })
  })

  describe('getExemptions', () => {
    let actual

    beforeEach(async () => {
      const response = await request.get('/clan-id').expect(200)
      actual = response.body
    })

    it('returns the clan exemption profile', () => {
      expect(actual).toEqual({
        'membership-id': {
          history: [editedExemption],
          numberExemptions: 1,
          membershipId: 'membership-id'
        }
      })
    })
  })
})
