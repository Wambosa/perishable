const method = require('./method.js'),
  mysql = require('serverless-mysql')({
    config: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
    }
  }),
  headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*',
  }

exports.handler = async (event, context) => {
  console.log('event:', event)

  let parsedBody
  try {
    parsedBody = JSON.parse(event.body)
  } catch(e) {
    console.error(e.message)
    return {
        isBase64Encoded: false,
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({message: e.message})
      }
  }
  
  let request = {
    headers: event.headers,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
    body: parsedBody,
    apiKey: event.apiKey,
    user_id: event.requestContext.authorizer.user_id,
    org_id: event.requestContext.authorizer.org_id,
  }

  let res = await method(request, mysql, context)

  console.log('results', res)

  await mysql.end()

  return {
    isBase64Encoded: false,
    statusCode: res.statusCode,
    headers: headers,
    body: JSON.stringify(res.body)
  }
}