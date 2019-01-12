// yes this really can and should live in its own module!
const flattenParams = require('../src/api/post-unit-create').flattenParams

describe('GIVEN a params object', () => {
  let params = Object.freeze({
    user_id: 99,
    ...{
      'vegeta': 8000,
      'goku': 9000,
      'trunks': 1000000,
    }
  })

  describe('WHEN flattening for db.query', () => {
    let flattened
    beforeEach(() => {
      flattened = flattenParams(
        params, 
        ['goku', 'trunks', 'vegeta', 'goten']
      )
    })

    it('THEN order is honored', () => {
      expect(flattened).toEqual([9000, 1000000, 8000, null])
    })

    it('THEN an array is returned', () => {
      expect(flattened).toEqual(jasmine.any(Array))
    })

    it('THEN missing param becomes null', () => {
      expect(flattened[3]).toEqual(null)
    })
  })
})