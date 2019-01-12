const method = require('../src/api/post-unit-create'),
  request = require('./request.fake').setBody({
      name: "",
      group_id: 0
    }),
  model = [
    'id',
  ]

describe('GIVEN the post-unit-create handler', () => {

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

describe('GIVEN valid COMMON unit inputs', () => {
  let fullCommonRequest = Object.freeze({
    body: {
      name: "string",
      group_id: 0,
      desc: "string",
      mass: 0,
      expire: "2019-01-11",
    },
    user_id: 0,
  }),
  missingDesc = Object.freeze({
    body: {
      name: "string",
      group_id: 0,
      mass: 0,
      expire: "2019-01-11",
    },
    user_id: 0,
  }),
  missingMass = Object.freeze({
    body: {
      name: "string",
      group_id: 0,
      desc: "string",
      expire: "2019-01-11",
    },
    user_id: 0,
  }),
  missingExpire = Object.freeze({
    body: {
      name: "string",
      group_id: 0,
      desc: "string",
      mass: 0,
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

    it('THEN optional property unit.desc is supported', async done => {
      let res = await method(missingDesc, conn)
      expect(res.statusCode).toEqual(200)
      expect(res.body.id).toBeDefined()
      done()
    })

    it('THEN optional property unit.mass is supported', async done => {
      let res = await method(missingMass, conn)
      expect(res.statusCode).toEqual(200)
      expect(res.body.id).toBeDefined()
      done()
    })

    it('THEN optional property unit.expire is supported', async done => {
      let res = await method(missingExpire, conn)
      expect(res.statusCode).toEqual(200)
      expect(res.body.id).toBeDefined()
      done()
    })
  })
})

describe('GIVEN MISSING required common unit inputs', () => {
  let missingName = Object.freeze({
    body: {
      group_id: 0,
      desc: "string",
      mass: 0,
      expire: "2019-01-11",
    },
    user_id: 0,
  }),
  missingGroupId = Object.freeze({
    body: {
      name: "string",
      desc: "string",
      mass: 0,
      expire: "2019-01-11",
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

    it('THEN excluded property unit.name fails', async done => {
      let res = await method(missingName, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })

    it('THEN excluded property unit.group_id fails', async done => {
      let res = await method(missingGroupId, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })
  })
})

describe('GIVEN INVALID common unit inputs', () => {
  let badName = Object.freeze({
    body: {
      name: 55,
      group_id: 0,
      desc: "string",
      mass: 0,
      expire: "2019-01-11",
    },
    user_id: 0,
  }),
  badGroup = Object.freeze({
    body: {
      name: "string",
      group_id: "string",
      desc: "string",
      mass: 0,
      expire: "2019-01-11",
    },
    user_id: 0,
  }),
  badDesc = Object.freeze({
    body: {
      name: "string",
      group_id: "string",
      desc: 4352345,
      mass: 0,
      expire: "2019-01-11",
    },
    user_id: 0,
  }),
  badMass = Object.freeze({
    body: {
      name: "string",
      group_id: "string",
      desc: "string",
      mass: '100lbs',
      expire: "2019-01-11",
    },
    user_id: 0,
  }),
  badDate = Object.freeze({
    body: {
      name: "string",
      group_id: "string",
      desc: "string",
      mass: 0,
      expire: "January 1st 1945",
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

    it('THEN bad property unit.name fails', async done => {
      let res = await method(badName, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })

    it('THEN bad property unit.group_id fails', async done => {
      let res = await method(badGroup, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })

    it('THEN bad property unit.desc fails', async done => {
      let res = await method(badDesc, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })

    it('THEN bad property unit.mass fails', async done => {
      let res = await method(badMass, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })

    it('THEN bad property unit.expire fails', async done => {
      let res = await method(badDate, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })
  })
})

describe('GIVEN MISSING EXTENDED unit inputs', () => {
  let missingAll = Object.freeze({
    body: {
      name: "string",
      group_id: 0,
    },
    user_id: 0,
  }),
  missingOne = Object.freeze({
    body: {
      name: "string",
      group_id: 0,
      ext: {
        color: '#FFF'
      }
    },
    user_id: 0,
  })

  describe('WHEN validating', () => {
    let conn
    beforeEach(() => {
      conn = {
        query: jasmine.createSpy().and.callFake( async () => {
          return [
            { rule_name: 'isHexadecimal', key: 'color', params: null },
            { rule_name: 'isLetter', key: 'mood', params: null },
            { rule_name: 'required', key: 'mood', params: null },
          ]
        })
      }
    })

    it('THEN excluded unit.ext', async done => {
      let res = await method(missingAll, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })

    it('THEN excluded property fails', async done => {
      let res = await method(missingOne, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })
  })
})

describe('GIVEN INVALID EXTENDED unit inputs', () => {
  let badColor = Object.freeze({
    body: {
      name: "string",
      group_id: 0,
      desc: "string",
      mass: 0,
      expire: "2019-01-11",
      ext: {
        color: 'burgandy'
      }
    },
    user_id: 0,
  }),
  badMood = Object.freeze({
    body: {
      name: "string",
      group_id: 0,
      desc: "string",
      mass: 0,
      expire: "2019-01-11",
      ext: {
        color: '#ABABAB',
        mood: 'grumpy',
      }
    },
    user_id: 0,
  })

  describe('WHEN validating', () => {
    let conn
    beforeEach(() => {
      conn = {
        query: jasmine.createSpy().and.callFake( async () => {
          return [
            { rule_name: 'isHexadecimal', key: 'color', params: null },
            { rule_name: 'isLetter', key: 'mood', params: null },
            { rule_name: 'required', key: 'mood', params: null },
          ]
        })
      }
    })

    it('THEN bad value for unit.ext.color fails', async done => {
      let res = await method(badColor, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })

    it('THEN bad value for unit.ext.mood fails', async done => {
      let res = await method(badMood, conn)
      expect(res.statusCode).toEqual(400)
      expect(res.body.message).toBeDefined()
      done()
    })

  })
})