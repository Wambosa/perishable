### gotchas
- moving secretsmanager to different terraform modules does not properly delete the secret for 7 days
  - solve with `aws secretsmanager delete-secret --secret-id /database/password --force-delete-without-recovery`
- api gateway does not support the full openapi 3 spec
- the `api_key_source = "AUTHORIZER"` in api.tf doesn't take on the first run. It effects nothing but documentation of intent. So the app still works regardless of this value.