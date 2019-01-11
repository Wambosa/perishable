module.exports = async (req, conn, context) => {
  const unit_id = req.pathParameters.id,
    org_id = req.org_id

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

      join unit_ext x
        on u.id = x.unit_id

    where u.id = ?
  `, [
    org_id,
    unit_id,
  ])

  if(!res.length)
    return {
      statusCode: 400,
      body: {message: `You have requested unit_id: ${unit_id}. This is a bad request.`}
    }

  let first = res[0]

  return {
    statusCode: 200,
    body: {
      id: first.id,
      name: first.name,
      type: first.group_name,
      creator: first.user_name,
      mass: first.weight,
      expire: first.expire,
      desc: first.desc,
      ext: JSON.parse(first.ext),
    }
  }
}