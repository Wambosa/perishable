module.exports = async (req, conn, context) => {
  const org_id = req.org_id,
    { where, params } = createFilter(req.queryStringParameters)

  let res = await conn.query(`
    select
      u.id,
      u.name,
      g.name as group_name,
      p.name as user_name,
      u.weight,
      u.expire,
      x.ext,
      u.desc
    from unit u

      join user p
        on u.user_id = p.id

      join unit_group g
        on u.group_id = g.id
        and p.org_id = ?

      left join unit_ext x
        on u.id = x.unit_id

      ${where}
  `, [
    org_id,
    ...params,
  ])

  let unpacked = res.map(row => {
    return {
      id: row.id,
      name: row.name,
      type: row.group_name,
      creator: row.user_name,
      mass: row.weight,
      expire: row.expire,
      desc: row.desc,
      ext: JSON.parse(row.ext),
    }
  })

  return {
    statusCode: 200,
    body: unpacked
  }
}

const clause = {
  expiredBy: "and u.expire < ?",
  mass: "and u.weight = ?",
  name: "and u.name LIKE CONCAT('%', ?, '%')",
  desc: "and u.`desc` LIKE CONCAT('%', ?, '%')",
}

function createFilter(qsParams) {
  let where = [],
    params = []

  for ( let arg in qsParams) {
    let line = clause[arg],
      val = qsParams[arg]

    if(!line) // then assume extended unknown param
      line =  `and x.ext->"$.${arg.replace(/[^a-z0-9]/gi,'')}" LIKE CONCAT('%', ? ,'%')`
    where.push(line)
    params.push(val)
  }

  if(where.length)
    where[0] = `where${where[0].slice(3)}`

  where = where.join(' ')
  return { where, params }
}