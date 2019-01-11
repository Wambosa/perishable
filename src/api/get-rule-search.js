module.exports = async (req, conn, context) => {
  const org_id = req.org_id

  let res = await conn.query(`
    select distinct r.rule_name
    from rule_map r

      join unit_group g
      on r.unit_group_id = g.id

      join org o
      on g.org_id = o.id
      and o.id = ?

  `, [
    org_id,
  ])

  let unpacked = res.map(row => {
    return {
      name: row.rule_name,
    }
  })

  return {
    statusCode: 200,
    body: unpacked
  }
}