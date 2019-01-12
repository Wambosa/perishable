const { superstruct } = require('superstruct'),
  input = superstruct({
    types: {
      'required': val => !!val,
      'yyyy-mm-dd': val => /^\d{4}-\d{1,2}-\d{1,2}$/.test(val),
      'isLetter': val => /^[a-zA-Z]{1}$/.test(val),
      'isHexColor': val => /^(#|)([0-9A-F]{3}|[0-9A-F]{6})$/i.test(val),
      'isInteger': val => Number.isInteger(val),
    }
  })

const method = async (req, conn, context) => {
  const org_id = req.org_id,
    user_id = req.user_id,
    hasRules = !!req.body.rules && req.body.rules.length

  // 1. validate group properties
  let err = method.validateGroup(req.body)
  if(err)
    return {
      statusCode: 400,
      body: { message: err.message }
    }

  //2. IF rules are assosiacted, then validate the input
  if(hasRules)
    err = method.validateRuleMap(req.body.rules)
  if(err)
    return {
      statusCode: 400,
      body: { message: err.message }
    }

  //3. insert group
  let newGroup = await conn.query(`
    INSERT INTO unit_group (name, user_id, org_id, \`desc\`)
      VALUES (?, ?, ?, ?)
  `,
  method.flattenParams({
    user_id,
    org_id,
    ...req.body
  }, ['name', 'user_id', 'org_id', 'desc']))

  //3a. fail if there was an insert error
  const group_id = newGroup.insertId
  if(!group_id){
    return {
      statusCode: 500,
      body: {message: `Fatal: Database failed to insert new group.`}
    }
  }

  // 4. insert extended properties if they exist
  if(hasRules)
    await conn.query(`
      INSERT INTO rule_map (unit_group_id, rule_name, \`key\`, params)
      VALUES ${req.body.rules.map(_ => `(${group_id}, ?, ?, ?)`).join(', ')}
    `,
      method.expandValues(req.body.rules, ['rule_name', 'key', 'params'])
    )

  //5. check for rule insert failure

  //6. return success with new group id
  return {
    statusCode: 200,
    body: {
      id: group_id
    }
  }
}

method.flattenParams = (obj, order) => {
  return order.map(k => obj[k] || null)
}

method.validateGroup = body => {
  const model = input.partial({
    name: 'string',
    desc: 'string',
  })

  let err

  try {
    let report = model.validate(body)
    err = report[0]
  } catch (e) {
    err = e
  }

  return err
}

method.validateRuleMap = rules => {
  const model = input.partial({
    rule_name: 'string',
    key: 'string',
  })

  let err

  try {
    let report
    rules.find(r => {
      report = model.validate(r)
      return !!report[0]
    })

    err = report[0]
  } catch (e) {
    err = e
  }

  return err
}

method.expandValues = (rows, order) => {
  return rows.map(r => method.flattenParams(r, order))
    .reduce((a,b) => a.concat(b), [])
}

module.exports = method