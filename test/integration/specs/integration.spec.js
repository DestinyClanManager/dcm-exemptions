const supertest = require('supertest')
const moment = require('moment')

describe('Exemption API', () => {
  let request, createdExemption, editedExemption, startDate, endDate, newEndDate

  beforeEach(() => {
    request = supertest(process.env.BASE_URL)
  })

  describe('createExemption', () => {
    beforeEach(async () => {
      startDate = moment().format('YYYY-MM-DD')
      endDate = moment()
        .add(1, 'month')
        .format('YYYY-MM-DD')
      const exemption = {
        adminMembershipId: 'admin-membership-id',
        adminMembershipType: 'bungienet',
        startDate,
        endDate,
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
      expect(createdExemption.startDate).toEqual(startDate)
      expect(createdExemption.endDate).toEqual(endDate)
      expect(createdExemption.membershipId).toEqual('membership-id')
      expect(createdExemption.id).toBeUUID()
    })
  })

  describe('editExemption', () => {
    beforeEach(async () => {
      newEndDate = moment()
        .add(14, 'days')
        .format('YYYY-MM-DD')
      const edit = Object.assign({}, createdExemption, {
        endDate: newEndDate
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
      expect(editedExemption.startDate).toEqual(startDate)
      expect(editedExemption.endDate).toEqual(newEndDate)
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
