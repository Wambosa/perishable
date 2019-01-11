const method = require('../src/api/get-rule-search'),
  request = require('./request.fake'),
  model = [
    'name',
  ]

describe('GIVEN the get-rule-search handler', () => {

  describe('WHEN envoking', () => {
    let conn
    beforeEach(() => {
      conn = {
        query: jasmine.createSpy().and.callFake( async () => [])
      }
    })

    it('THEN expect not to throw', () => {
      let f = () => method(request, conn)
      expect(f).not.toThrow()
    })

    it('THEN expect it to be promisified', () => {
      expect(method(request, conn)).toEqual(jasmine.any(Promise))
    })

    // make sure people are not calling queries in a loop
    it('THEN expect query toHaveBeenCalled only once', () => {
      method(request, conn)
      expect(conn.query).toHaveBeenCalledTimes(1)
    })
  })
})

describe('GIVEN valid db response', () => {
    let conn
    beforeEach(() => {
      conn = {
        query: jasmine.createSpy().and.callFake( async () => {
          return [{
            rule_name: 'destroyBuzzLightyear',
          }]
        })
      }
    })

  describe('WHEN transforming into api model', () => {
    let res

    beforeEach(async done => {
      res = await method(request, conn)
      done()
    })

    it('THEN a array result is returned', () => {
      expect(res.body).toEqual(jasmine.any(Array))
    })

    it('THEN return 200 statusCode', () => {
      expect(res.statusCode).toEqual(200)
    })

    model.forEach(key => {
      it(`THEN expect property rule.${key} toBeDefined`, () => {
        expect(res.body[0][key]).toBeDefined()
      })
    })
  })
})