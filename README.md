# Perishable
_a code challenge_



## Table of Contents

* [Initialize a new environment](#initialize-a-new-environment)
* [Database Management](#database-management)
* [Production](#production)
* [Contributing](#contributing)
* [Adding a new Method](#adding-a-new-method)
* [Stack & Toolchain](./doc/stack.md)
* [List of Simplifications](./doc/future.md#list-of-simplifications)
* [Next Steps](./doc/future.md#next-steps)



----------



### Initialize a new environment
_first time run_

###### 1. aws account(s) with admin permissions
You'll need an aws account for all the infrastructure to live in.
Terraform is used for idempotent environment deployments.

Once you have an `iam` user created, 
obtain the access key and secret key in the aws `iam` module.

Then create the following directory & file (with your credentials.)

`config/secrets-dev.env`
```
export AWS_ACCESS_KEY_ID=AAAAAAAABBBBBBBCCCCCC
export AWS_SECRET_ACCESS_KEY=******************************
export AWS_DEFAULT_REGION=us-east-1
export DATABASE_PASS=supersecretpassword
```

###### 1a. (optional) aws cli
_useful tool for working with aws_

```
sudo apt update
sudo apt-get install python-dev
sudo pip install -U setuptools
curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
unzip awscli-bundle.zip
./awscli-bundle/install -b ~/bin/aws
```

###### 2. create a bucket for terraform state
_if you have awscli, then you can run one command to create `perishable-dev-terraform-state`_

Keep in mind that I have already created the `dev` environment and the **aws s3 namespace is global**.
This means that you have to use a different environment name if this tutorial is followed.

`aws s3api create-bucket --bucket perishable-dev-terraform-state --region us-east-1`

###### 3. terraform
_infrastructure as code_

if you do not have terraform installed, run `make prerequisite` to install it.

`terraform -v` should output `Terraform v0.11.11`

**warn:** it is very important that you use at least this version of terraform.

###### 4. Node & npm & nvm
_package.json will mention the lambda nodejs supported version 8.10. 
nvm can be used to swap versions quickly. 
Once the proper version of node and npm are installed, 
then install the remaining dependencies with `npm install`_

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
nvm install 8.10

npm install
```

###### 5. stand up aws environment
_remember to change the 'ENV' parameter to meet your unique environment name_

The terraform commands will take about ~20 minutes to complete 
because the datastore step takes awhile to stand up an aurora cluster. 
The other 3 steps are usually done in seconds.

```
make deploy TARGET=core ENV=dev
make deploy TARGET=datastore ENV=dev
make deploy TARGET=gateway ENV=dev
make deploy TARGET=lambda ENV=dev
```



### Database Management
_what you need to know to get the schema in place_

###### 1. db host & proxy host network address
_Use these commands to get the endpoints for database access. You can also find this information in the aws console if you prefer._

**db WRITER endpoint:** `aws rds describe-db-cluster-endpoints`  
**ec2 proxy**: `aws ec2 describe-instances --query "Reservations[].Instances[][PublicIpAddress]"`  
note: You **must** have the [private key mentioned here](./infra/core/ssh.tf#L3) in order to connect to the ec2-proxy.

###### 2. network access
_The database is secured behind a vpc. You must connect through a proxy ssh host in order to even hit it._

In a tool such as putty, datagrip, openssh, etc; 
these settings will allow you to connect to the proxy host.

```
proxy host: (ec2 proxy endpoint from step 1)
proxy user: ubuntu
auth type: private key (the private key mentioned in step 1)
port: 22
```

###### 3. database connection config
_Once in the same network as database, connect with the following._
```
host: (make sure you put the db WRITER endpoint from step 1)
database: perishable
user: mom
password: (env var DATABASE_PASS in config/secrets-*.env)
port: 3306
```

###### 4. (only if initializing system) run "up scripts"
Connect to database cluster write endpoint and run scripts in order found in `src/db/up`.
This final step makes the system live!

###### 5. grant user access
In order for users _(people with api keys that want access to perishable systems)_ 
to actually be able to hit the system;
you'll need to associate [one of the generated api keys](./infra/gateway/api.tf) with a user in the database.
Then users will be able to authenticate with the perishable system.


### Contributing
_Changing the system, adding a new method or updating an existing method. 
Tests can be invoked with `npm test` or `make test`._

###### changes to `./infra/*`
Changes made to infrastructure will require a deploy command in order to take effect.

ex:  
1. dev makes changes to `./infra/core/network.tf`
2. `make deploy TARGET=core ENV=dev`
3. changes are reflected in aws

###### changes to `./src/api/*`
Changes made to api methods will require a lambda redeploy.

ex:  
1. dev makes changes to `./src/api/get-unit-id.js`
2. `make deploy TARGET=lambda ENV=dev`
3. changes are live right away, all new requests will pass through the new function

###### changes to `./src/db/*`
The scripts here are for record keeping and for standing up a new environment. 
Synchronizing the scripts here with the environment is currently a manually effort.

ex:  
1. dev makes changes to `./src/db/up/unit.sql`
2. dev connects to database and runs alter
3. changes are live right away, all new requests will pass through the new function



### Production
_what to expect_

In `./infra/gateway/api.tf` the rules of access to the api are defined. Here are some notable takeaways from the current environment:  

a. There is a limit of 1000 hits per day per key.

b. There are two keys that are generated and two fake companies. Each of these keys are to be associated with a member from each different org.

c. No vanity url exists; instead aws generates one for us. https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1

d. While the api is itself secured with https, the [demo page][demo-url] is a simple static site over http. A non-issue, but should be noted.

e. Since no one is using this system, **the first time you hit a lambda** may require it to **"heat up"**. This can take 1-3 seconds. After that "heat up" the methods are then lightning fast.



### Adding a new Method
_There are a few places that need to be touched in order to create a new method._

1. `src/api/new-method.js`
2. `spec/new-method.spec.js`
3. `infra/lambda/new-method.tf`
4. `infra/gateway/oas-integrations.yml`
5. `doc/api-spec.yml`

Once development is satisfactory;

6. `make deploy TARGET=gateway ENV=dev`
7. `make deploy TARGET=lambda ENV=dev`

Finally remember to make the endpoint public by creating a _new deployment_ for the `v1` stage in api-gateway 
(either with a command or in the aws console)

`aws apigateway create-deployment --rest-api-id <value> --stage-name v1`



----------

[demo-url]: http://shondiaz.com/demo/perishable/
[prod-url]: https://hgembpmlo6.execute-api.us-east-1.amazonaws.com/v1
[aws cli install]: https://docs.aws.amazon.com/cli/latest/userguide/install-bundle.html