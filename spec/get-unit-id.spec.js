const method = require('../src/api/get-unit-id'),
  request = require('./request.fake'),
  model = [
    'id',
    'name',
    'type',
    'creator',
    'desc',
    'mass',
    'expire',
    'ext'
  ]

describe('GIVEN the get-unit-id handler', () => {

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
            id: 1,
            name: 'coffee crate',
            group_name: 'coffee',
            user_name: 'Jimmy Foulin',
            weight: 9001,
            expire: '2019-01-18 00:00:00',
            ext: '{ "treeType": "Birch", "cuppingScore": 55 }',
            desc: null
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

    it('THEN a single result is returned', () => {
      expect(res.body).not.toEqual(jasmine.any(Array))
      expect(res.body).toEqual(jasmine.any(Object))
    })

    it('THEN return 200 statusCode', () => {
      expect(res.statusCode).toEqual(200)
    })

    it('THEN extended properties are derialized', () => {
      expect(res.body.ext).toEqual(jasmine.any(Object))
      expect(res.body.ext).not.toEqual(jasmine.any(String))
    })

    model.forEach(key => {
      it(`THEN expect property unit.${key} toBeDefined`, () => {
        expect(res.body[key]).toBeDefined()
      })
    })
  })
})

describe('GIVEN INVALID db response', () => {
    let conn
    beforeEach(() => {
      conn = {
        query: jasmine.createSpy().and.callFake( async () => [])
      }
    })

  describe('WHEN transforming into api model', () => {
    let res

    beforeEach(async done => {
      res = await method(request, conn)
      done()
    })

    it('THEN an error object is returned', () => {
      expect(res.body.message).toBeDefined()
    })

    it('THEN return 400 statusCode', () => {
      expect(res.statusCode).toEqual(400)
    })
  })
})