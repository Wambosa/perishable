# Static Demo
_This is an example of the current deployed system working for convienience. 
You may run these methods and get similar results (ids would be different).
This example shows two different users in the system. Note: the apikeys are real.
Keep in mind that no one is using this system, 
so the first few methods fired will take some seconds for aws lambda to **"heat up"**.
This was mitigated with a 10-15 minute cloudwatch event that just envokes/pings the functions to keep them warm._

### User Alpha
_steps that this user takes_

###### creates new group concept

req
```
curl -X POST "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/group/create" \
-H "accept: application/json" \
-H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG" \
-H "Content-Type: application/json" \
-d "{\"name\":\"jam\",\"desc\":\"squished produce or chuchu product\",\"rules\":[{\"rule_name\":\"isHexColor\",\"key\":\"color\"},{\"rule_name\":\"inRange\",\"key\":\"worth\",\"params\":{\"min\":0,\"max\":10000}}]}"
```

res
```
{
  "id": 9
}
```

###### tries to add new jam
_fails because required custom property is missing_

req
```
curl -X POST "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/unit/create" -H \
"accept: application/json" \
-H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG" \
-H "Content-Type: application/json" \
-d "{\"name\":\"fire jelly\",\"group_id\":9,\"desc\":\"strike to cause a minor explosion\",\"mass\":15,\"ext\":{\"worth\":500}}"
```

res _(fail)_
```
{
  "message": "Expected a value of type `isHexColor` for `color` but received `undefined`."
}
```

###### tries again with required property

req
```
curl -X POST "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/unit/create" \
-H "accept: application/json" \
-H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG" \
-H "Content-Type: application/json" \
-d "{\"name\":\"fire jelly\",\"group_id\":9,\"desc\":\"strike to cause a minor explosion\",\"mass\":15,\"ext\":{\"worth\":500,\"color\":\"#F00\"}}"
```

res _(success)_
```
{
  "id": 12
}
```

###### gets the unit later

req
```
curl -X GET "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/unit/12" \
-H "accept: application/json" \
-H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG"
```

res
```
{
  "id": 12,
  "name": "fire jelly",
  "type": "jam",
  "creator": "Jennifer Allister",
  "mass": 15,
  "expire": null,
  "desc": "strike to cause a minor explosion",
  "ext": {
    "color": "#F00",
    "worth": 500
  }
}
```

###### users can find in search

req
```
curl -X GET "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/unit/search?desc=explosion" \
-H "accept: application/json" \
-H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG"
```

res
```
[
  {
    "id": 12,
    "name": "fire jelly",
    "type": "jam",
    "creator": "Jennifer Allister",
    "mass": 15,
    "expire": null,
    "desc": "strike to cause a minor explosion",
    "ext": {
      "color": "#F00",
      "worth": 500
    }
  }
]
```

### User Beta
_Uses a key from a diffferent orginization._

###### other users from diff orgs cannot see in search

req
```
curl -X GET "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/unit/search?desc=explosion" \
-H "accept: application/json" \
-H "apikey: jEE65cNPIf4gzzcESAHPZ3omTHigXd4911WM6I6T"
```

res _(nothing to view for this org for that search)_
```
[ ]
```