const { validate } = require('./validate')

const method = async (req, conn, context) => {
  const org_id = req.org_id,
    user_id = req.user_id,
    hasRules = !!req.body.rules && req.body.rules.length

  // 1. validate group properties
  let err = validate.unitGroup(req.body)
  if(err)
    return {
      statusCode: 400,
      body: { message: err.message }
    }

  //2. IF rules are assosiacted, then validate the input
  if(hasRules)
    err = validate.ruleMap(req.body.rules)
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
      method.expandValues(stringify(req.body.rules), ['rule_name', 'key', 'params'])
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

method.expandValues = (rows, order) => {
  return rows.map(r => method.flattenParams(r, order))
    .reduce((a,b) => a.concat(b), [])
}

function stringify(rules) {
  return rules.map(r => ({...r, params: r.params && JSON.stringify(r.params) || null}))
}

module.exports = method