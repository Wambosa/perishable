# perishable
a code challenge



### notes

whole world of database management, 
decided to have simple scripts that are manually run at this point to get going 
instead of an ORM or something like knex


### initialize a new environment
- existing aws account(s) with permissions
- aws cli
- s3 bucket for infrastructure state
- .env file
- make prerequisite
- make deploy TARGET=core ENV=staging
- make deploy TARGET=datastore ENV=staging
- make deploy TARGET=gateway ENV=staging
- make deploy TARGET=lambda ENV=staging
- connect to database cluster write endpoint and run scripts in order found in `src/db/up` 


### contributing to api
_workflow_

- edit method file in `src/api` (ex: )
- npm test
- commit (might not do this in a week)
- make deploy (should be idempotetnt)


### gotchas
- moving secretsmanager to different terraform modules does not properly delete the secret for 7 days
- solve with `aws secretsmanager delete-secret --secret-id /database/password --force-delete-without-recovery`
- api gateway does not support the full openapi 3 spec
- the `api_key_source = "AUTHORIZER"` in api.tf doesn't take on the first run. It effects nothing but documentation of intent. So the app still works regardless of this value.

### simplifications
- auth (just using key) / could abstract the auth layer to before the api method is ever called and give the method the `org_id` and `user_id`
- minimal methods implemented (ex: can create unit but not update it)
- no location data (these units represent physical objects, maybe it would be nice to know where they are? store number/aisle etc)
- available rules/validations are limited (the database shows support for variable number of rules, however i just skipped to the string name of the rule to keep it simple for now)
- unit-ext _could_ have been a mapping table where each key/value is a row instead of a json blob for all the props.
- there is no ci, deployments are manual with `make deploy TARGET=myModule ENV=dev` 
- no pagination, would need to implement that (mention page params)
- db mock is simple (didn't need to use sinon since the api methods are injectable)
- logging is super basic (console.log), unstandardized, just using cloudwatch lambda (and maybe api gateway)
- error handling is pretty basic. could be hardened and made more verbose in the docs.

### future
- maybe each unit can be a part of multiple groups? can refactor database to use a mapping table instead of just a 1-1 unit-group_id relationship
- template the oas spec (so that the aws account number / region isn't hardcoded)
- general security hardening (minimal roles, tighter access)
- find a way for customer facing api spec docs to be generated and not manually updated
- setup with circle (create specific account on aws for deployments and add secrets or create custom image for builds that has terraform installed)
- shrink deployment size by removing test libs on lambda deploys
- vanity domain
- auth caching
- try out cognito for abstracted auth
- other cost reduction and perf
- cluster autoscaling
- profiling/benchmarks
- local docker database (to test sql up/down scripts and local dev)
- down scripts
- maybe a sql migration tool
- integration tests with seeded data
- front end demo client
- unit conversion/localization (support for weight approximate match)
- more robust filtering of custom parameters
- createFilter is in need of unit tests
- pagination
- git commit prehook unit test run
- test runner
- create proper validator lib
- transactional database changes
- async validations (group_id may be a valid number, but you may not have access to that id or it may not exist)
- abstract the validation away from the post/update methods
- true multi-rule support (build validator functions on the fly)
- i might have already said this, better logging
- the parameterizedValidators could use a pretty error name instead of <Function>
- change column names that are reserved keywords -_- (key, desc, group)

### aws cli
_from a new vm or ec2_

```
sudo apt update
sudo apt-get install python-dev
sudo pip install -U setuptools
curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
unzip awscli-bundle.zip
./awscli-bundle/install -b ~/bin/aws
```

----------


[aws cli install]: https://docs.aws.amazon.com/cli/latest/userguide/install-bundle.html