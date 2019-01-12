const method = require('../src/api/post-group-create'),
  request = require('./request.fake').setBody({
      name: "pear",
      desc: "a strange apple",
      rules: [{rule_name: 'boolean', key: "hasStem", params: null }]
    }),
  model = [
    'id',
  ]

describe('GIVEN the post-group-create handler', () => {

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
  })
})

describe('GIVEN valid db response', () => {
    let conn
    beforeEach(() => {
      conn = {
        query: jasmine.createSpy().and.callFake( async () => {
          return {
            fieldCount: 0,
            affectedRows: 0,
            insertId: 42,
            serverStatus: 0,
            warningCount: 0,
            message: 'Records:0  Duplicated: 0  Warnings: 0',
            changedRows: 0
          }
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

    model.forEach(key => {
      it(`THEN expect property response.${key} toBeDefined`, () => {
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

    it('THEN return 500 statusCode', () => {
      expect(res.statusCode).toEqual(500)
    })
  })
})

describe('GIVEN valid COMMON group inputs', () => {
  let fullCommonRequest = Object.freeze({
    body: {
      name: "string",
      desc: "string",
    },
    user_id: 0,
  })

  describe('WHEN validating', () => {
    let conn
    beforeEach(() => {
      conn = {
        query: jasmine.createSpy().and.callFake( async () => {
          return {
            fieldCount: 0,
            affectedRows: 0,
            insertId: 42,
            serverStatus: 0,
            warningCount: 0,
            message: 'Records:0  Duplicated: 0  Warnings: 0',
            changedRows: 0
          }
        })
      }
    })

    it('THEN all properties are accepted', async done => {
      let res = await method(fullCommonRequest, conn)
      expect(res.statusCode).toEqual(200)
      expect(res.body.id).toBeDefined()
      done()
    })
  })
})

describe('GIVEN MISSING required common group inputs', () => {
  let missingName = Object.freeze({
    body: {
      desc: "string",
    },
    user_id: 0,
  }),
  missingDesc = Object.freeze({
    body: {
      name: "string",
    },
    user_id: 0,
  })

  describe('WHEN validating', () => {
    let conn
    beforeEach(() => {
      conn = {
        query: jasmine.createSpy().and.callFake( async () => {
          return {
            fieldCount: 0,
            affectedRows: 0,
            insertId: 42,
            serverStatus: 0,
            warningCount: 0,
            message: 'Records:0  Duplicated: 0  Warnings: 0',
            changedRows: 0
          }
        })
      }
    })

    it('THEN excluded property group.name fails', async done => {
      let res = await method(missingName, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })

    it('THEN excluded property group.desc fails', async done => {
      let res = await method(missingDesc, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })
  })
})

describe('GIVEN INVALID common group inputs', () => {
  let badName = Object.freeze({
    body: {
      name: 55,
      desc: "string",
    },
    user_id: 0,
  }),
  badDesc = Object.freeze({
    body: {
      name: "string",
      desc: 4352345,
    },
    user_id: 0,
  })

  describe('WHEN validating', () => {
    let conn
    beforeEach(() => {
      conn = {
        query: jasmine.createSpy().and.callFake( async () => {
          return {
            fieldCount: 0,
            affectedRows: 0,
            insertId: 42,
            serverStatus: 0,
            warningCount: 0,
            message: 'Records:0  Duplicated: 0  Warnings: 0',
            changedRows: 0
          }
        })
      }
    })

    it('THEN bad property group.name fails', async done => {
      let res = await method(badName, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })

    it('THEN bad property group.desc fails', async done => {
      let res = await method(badDesc, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })
  })
})

describe('GIVEN MISSING rule inputs', () => {
  let missingAll = Object.freeze({
    body: {
      name: "string",
      desc: "string",
    },
    user_id: 0,
  }),
  missingOne = Object.freeze({
    body: {
      name: "string",
      desc: "string",
      rules: [
        { rule_name: "string", key: "string" }
      ]
    },
    user_id: 0,
  }),
  missingRuleName = Object.freeze({
    body: {
      name: "string",
      desc: "string",
      rules: [
        { key: "string", params: null }
      ]
    },
    user_id: 0,
  }),
  missingKey = Object.freeze({
    body: {
      name: "string",
      desc: "string",
      rules: [
        { rule_name: "string", params: null }
      ]
    },
    user_id: 0,
  })

  describe('WHEN validating', () => {
    let conn
    beforeEach(() => {
      conn = {
        query: jasmine.createSpy().and.callFake( async () => {
          return {
            fieldCount: 0,
            affectedRows: 0,
            insertId: 42,
            serverStatus: 0,
            warningCount: 0,
            message: 'Records:0  Duplicated: 0  Warnings: 0',
            changedRows: 0
          }
        })
      }
    })

    it('THEN excluded group.rules is allowed', async done => {
      let res = await method(missingAll, conn)
      expect(res.statusCode).toEqual(200)
      done()
    })

    it('THEN excluded group.rules.params allowed', async done => {
      let res = await method(missingOne, conn)
      expect(res.statusCode).toEqual(200)
      done()
    })

    it('THEN excluded group.rules.rule_name fails', async done => {
      let res = await method(missingRuleName, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })
    it('THEN excluded group.rules.key fails', async done => {
      let res = await method(missingKey, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })
  })
})