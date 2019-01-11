const mysql = require('serverless-mysql')({
  config: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
  }
})

exports.handler = async (event, context) => {
  let apikey = event.headers.apikey

  console.log('begin auth')

  let res = await mysql.query(`
    select
      id,
      org_id
    from user
    where apikey = ?
  `, [ apikey ])

  if(!res.length)
    return 'Unauthorized'

  await mysql.end()

  console.log('user exists! allow traffic')

  let user = res[0]

  return {
    ...buildAllowAllPolicy(event, user.id),
    context: {
      user_id: user.id,
      org_id: user.org_id,
    }
  }
}

function buildAllowAllPolicy (event, uniqueId) {

  let arn = event.methodArn.split(':'),
    method = event.httpMethod,
    gatewayArn = arn[5].split('/'),
    account = arn[4],
    region = arn[3],
    apiId = gatewayArn[0],
    stage = gatewayArn[1],
    allowedArn = `arn:aws:execute-api:${region}:${account}:${apiId}/${stage}/${method}/*`

  const policy = {
    principalId: `user_${uniqueId}`,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: [ allowedArn ]
        }
      ]
    }
  }

  return policy
}