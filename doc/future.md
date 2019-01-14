### List of Simplifications



###### Secrets
Although you find no hardcoded secrets anywhere in the project,
there is more that can be done to improve security and secret storage.
At first I set up a secretsmanager in `../infra/datastore/secrets.tf`, 
however I found the overhead in my lambda wrapper and cost was not justified at this point.
It did work, but overall unnecessary right now. 
(Really I was just curious how it would feel to use it, so I did for a bit and left the store in for later use)

###### Minimal Methods
Currently the api supports creating a unit, creating a group with associated rules, 
and searching the system for units/groups/rules. 
There where more methods that I looked at providing such as full CRUD, user login, getting user preferences, and creating custom validation rules.
In the end I decided to keep this short (yet extendable).

###### Client Auth
Just an apikey is supported currently. 
The auth layer could stand to be abstracted further by something like kong or cognito. 
It is currently a lightweight lambda authorizor (custom) that validates the apikey. 
Also should be noted that the key must be associated with an apigateway usage plan as well (so that each key is throttled).

As of now, I just need to know:
1. is the key valid?
2. who is using the system?
3. what org do they belong to?

###### Basic Unit Concept
No location data. These units represent physical objects, it would be nice to know where they are (store number/aisle etc).
Right now I have no such information in the system. Only the basic properties and whatever extended properties that users declare.

###### Database Migrations
There is a whole world of database management techniques. 
I pretty much avoided most of them for this first pass. 
The decision was to have simple scripts that are manually run at to get a schema going 
instead of an ORM or something like knex.

###### Database not normalized
While I was inventing a dynamic rule system, I kept the database design pretty flat around rules. 
A single table `rule_map` is used to contain the one-to-many relationship (group-rules). 
While this isn't the worst thing ever, it could be improved too by creating a true rule concept at the database level.

alternative: unit-ext _could_ have been a mapping table where each key/value is a row instead of a json blob for all the props.

###### No CI/CD (There is no continuous deployment)
Totally skipped that for this demo. The overhead for automating terraform changes is particularly complex. 
I've done it before and makes a great next step. Deployments are manual via `make deploy TARGET=myModule ENV=dev`.

###### No Pagination
Since there isn't a ton of data, 
this didn't even cross my mind until I was adding new units in and seeing all the results come back.
Something like this eventually with the N result responses.
```
  count: int
  per_page: int
  page: int
  pages: int
  has_prev: bool
  has_next: bool
```

###### Logging is console.log
This is fine for now, but needs to change pretty quick.

###### Error handing covers common paths
There are some edge cases I know about that I'd like to be covered too. 
For now they are skipped over since they are very very unlikely to be hit.
I decided to spend time on other aspects and just add this to tech debt.




### Next Steps
_in no particular order_

###### CI/CD
Establish github flow where tagging a release deploys to prod and push to master deploys to nonprod.
Create a build box ubuntu image to run tests and deploy OR docker container that does the same. 
Link up a circle file to the `make` commands for automatic testing on commit and good build logs.

###### Improved Tests
I want to test even more with a better db mock like `sinon`.
I also want to create a local docker database that can be used for quick integration tests before the engineer deploys changes.
This is particularly more important on teams, because people can block eachother too easily if everyone has to deploy to test the actual sql they wrote.
The docker database can additionally be utilized for integration tests with seeded data.
Oh yeah and a test runner, those make coding feel more gamified.

###### Logging
Use something like `bunyan`, to be able to set a log level and switch em on or off via configuration.

###### Hardened Error handling
Just have to close up the remaining edge cases once the improved tests are written. 
This can be done at the same time.

###### Complicated Units?
Maybe each unit can be a part of multiple groups?
Can refactor database to use a mapping table instead of just a 1-1 unit-group_id relationship.

###### Automatic Open API Spec
Template the oas spec (so that the aws account number / region isn't hardcoded).
Find a way for customer facing api spec docs to be generated and not manually updated

###### General Security Hardening 
(minimal roles, tighter access)

###### Minimal Deployments 
Shrink deployment size by removing test libs on lambda deploys.
Only recopy `node_modules` in zip when it has changed.

###### Vanity Domain
because hflshdfbla.aws.com is not fun to type, read, or remember.

###### Auth caching
Save costs and boost performance by 30ms

###### Flexible auth
Try out cognito for abstracted auth.
Haven't used it before, but want to give it a shot.

###### Profiling/Benchmarks
Ideally this system's only bottleneck would be database. 
It was designed to be totally serverless and completely parallelizable.
I'd want to put this to the test. 

###### Database Cluster Autoscaling
Can only be done after some kind of SLA or usage pattern is known. 
After some benchmarks, can establish some autoscaling rules.

###### Front-end Demo Client
Swagger-ui is nice, but an experience that captures a persona is great for selling.


###### unit conversion/localization 
Support for weight approximate match. For example, you must search for identical mass/weight. 
You can't use pounds or kilograms. 
It must be exact grams. 
So I'd want this to be way more friendly before filter by weight/mass is user worthy I think.

###### More robust search filtering
Right now all filtering is done as `%value%`, maybe you want to do a greater than, less than, strict equal, etc.

###### Transactional database changes
It is possible for a method to fail halfway leaving an undesireable half-state.
This can be resolved with transactions.

###### Async validator support
We already have custom validators, 
extending the engine a bit to support async is possible 
and would be useful to validate if a rule exists dynamically for example.

This would also help address a minor security breach where creation of new units cannot easily validate if the group is valid for that unit, 
only if the id is a valid int.

###### Pretty Errors for custom validators
The `parameterizedValidators` could use a pretty error name instead of `<Function>`

###### Remove keywords from schema
Change column names that are reserved keywords -_- (key, desc, group).

###### Code duplication in infra/lambda
Create a terraform module for common api method pattern.