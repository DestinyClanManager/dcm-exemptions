describe('utils', () => {
  let subject, errors

  beforeEach(() => {
    errors = require('../../../src/errors')
    subject = require('../../../src/utils')
  })

  describe('getStatusCodeFromError', () => {
    let actual

    describe('when the error is a ClanNotFoundError', () => {
      beforeEach(() => {
        actual = subject.getStatusCodeFromError(new errors.ClanNotFoundError())
      })

      it('returns 404', () => {
        expect(actual).toEqual(404)
      })
    })

    describe('when the error is a MemberNotFoundError', () => {
      beforeEach(() => {
        actual = subject.getStatusCodeFromError(new errors.MemberNotFoundError())
      })

      it('returns 404', () => {
        expect(actual).toEqual(404)
      })
    })

    describe('when the error is an InvalidExemptionError', () => {
      beforeEach(() => {
        actual = subject.getStatusCodeFromError(new errors.InvalidExemptionError())
      })

      it('returns 400', () => {
        expect(actual).toEqual(400)
      })
    })

    describe('when the error is any other error', () => {
      beforeEach(() => {
        actual = subject.getStatusCodeFromError(new Error())
      })

      it('returns 500', () => {
        expect(actual).toEqual(500)
      })
    })
  })

  describe('isEmpty', () => {
    describe('array', () => {
      it('returns true for an empty array', () => {
        expect(subject.isEmpty([])).toEqual(true)
      })

      it('returns false for an array with items', () => {
        expect(subject.isEmpty([1, 2])).toEqual(false)
      })
    })

    describe('string', () => {
      it('returns true for an empty string', () => {
        expect(subject.isEmpty('')).toEqual(true)
      })

      it('returns false for a string with characters', () => {
        expect(subject.isEmpty('not empty')).toEqual(false)
      })
    })

    describe('object', () => {
      it('returns true for an empty object', () => {
        expect(subject.isEmpty({})).toEqual(true)
      })

      it('returns false for an object with keys', () => {
        expect(subject.isEmpty({ foo: 'bar' })).toEqual(false)
      })
    })
  })
})
