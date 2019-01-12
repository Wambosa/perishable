module.exports = async (req, conn, context) => {
  const org_id = req.org_id

  let res = await conn.query(`
    select
      id,
      name,
      \`desc\`
    from unit_group
    where org_id = ?
  `, [
    org_id,
  ])

  return {
    statusCode: 200,
    body: res.map(r => ({id: r.id, name: r.name, desc: r.desc}))
  }
}