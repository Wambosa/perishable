module.exports = {
  headers: {},
  pathParameters: {id: 9000},
  queryStringParameters: { expireAfter: '2019-01-02', name: 'tomato' },
  body: {},
  apikey: 'kamehameha!',
  user_id: 0,
  org_id: 0,

  //for wrapper.js
  requestContext: {
    authorizer: {
      user_id: 0,
      org_id: 0,
    },
  },
}