const { validate, build } = require('./validate')

const method = async (req, conn, context) => {
  const user_id = req.user_id,
    hasExt = !!req.body.ext

  // 1. validate common properties
  let err = validate.unit(req.body)
  if(err)
    return {
      statusCode: 400,
      body: { message: err.message }
    }

  // 2. find any custom user defined rules
  let rules = await conn.query(`
    select distinct \`key\`, rule_name, params
    from rule_map r

      join unit_group g
      on r.unit_group_id = ?

      order by \`key\` asc, rule_name asc
  `, [
    req.body.group_id,
  ])

  rules = unpackParams(rules)

  //3. make sure user supplied minimal ext IF required-rules exist
  let requiredExt = validate.hasRequired(rules)
  if(!hasExt && requiredExt)
    return {
      statusCode: 400,
      body: { message: requiredExt }
    }

  //4. run custom user-defined validators on extended properties
  if(hasExt) {
    err = validate.extraProps(req.body.ext, build(rules))
    if(err)
      return {
        statusCode: 400,
        body: { message: err.message }
      }
  }

  //5. insert unit
  let unit = await conn.query(`
    INSERT INTO unit (name, user_id, group_id, weight, expire, \`desc\`)
      VALUES (?, ?, ?, ?, ?, ?)
  `,
  method.flattenParams({
    user_id, 
    ...req.body
  }, ['name', 'user_id', 'group_id', 'mass', 'expire', 'desc']))

  //5a. fail if there was an insert error (bad group_id can cause this)
  const unit_id = unit.insertId
  if(!unit_id){
    return {
      statusCode: 500,
      body: {message: `Fatal: Database failed to insert new unit.`}
    }
  }

  // 6. insert extended properties if they exist
  if(hasExt)
    await conn.query(
      `INSERT INTO unit_ext (unit_id, ext) VALUES(?, ?)`,
      method.flattenParams({ unit_id, ext: JSON.stringify(req.body.ext)},
      ['unit_id', 'ext'])
    )

  //7. check for extended property insert failure

  //8. return success with new unit id
  return {
    statusCode: 200,
    body: {
      id: unit_id
    }
  }
}

method.flattenParams = (obj, order) => {
  return order.map(k => obj[k] || null)
}

function unpackParams(rules) {
  let parsed = rules
  if(rules.map)
    parsed = rules.map(r => ({...r, params: JSON.parse(r.params)}))
  return parsed
}

module.exports = method