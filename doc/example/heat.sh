curl -X POST "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/group/create" \
-H "accept: application/json" \
-H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG" \
-H "Content-Type: application/json" \
-d "\"jam\",\"desc\":\"squished produce or chuchu product\",\"rules\":[{\"rule_name\":\"isHexColor\",\"key\":\"color\"},{\"rule_name\":\"inRange\",\"key\":\"worth\",\"params\":{\"min\":0,\"max\":10000}}]}"

curl -X POST "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/unit/create" -H \
"accept: application/json" \
-H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG" \
-H "Content-Type: application/json" \
-d "me\":\"fire jelly\",\"group_id\":9,\"desc\":\"strike to cause a minor explosion\",\"mass\":15,\"ext\":{\"worth\":500}}"

curl -X GET "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/unit/12" \
-H "accept: application/json" \
-H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG"

curl -X GET "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/unit/search?desc=explosion" \
-H "accept: application/json" \
-H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG"

curl -X GET "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/rule/search" -H "accept: application/json" -H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG"

curl -X GET "https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1/group/search" -H "accept: application/json" -H "apikey: JCms8MSDRV7TKO5bER66A6H0JYTrPeOM3JhFQ7RG"
