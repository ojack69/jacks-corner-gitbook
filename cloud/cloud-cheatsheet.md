Title: Cloud Cheatsheet
Slug: cloud/cheatsheet
Date: 1957-01-01 00:00
Category: Cheatsheet


Cool resource: [Hacking the Cloud](https://hackingthe.cloud/)

## AWS

Setup AWS CLI client configuring credentials, region, etc:

~~~
aws configure [--profile <profile name>]
~~~

ARN format - [reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html):

~~~
arn:partition:service:region:account-id:resource-id
arn:partition:service:region:account-id:resource-type/resource-id
arn:partition:service:region:account-id:resource-type:resource-id
~~~

### Users & Permissions - IAM

User credentials file path:

~~~
<user>/.aws/credentials
~~~

Get current authenticated user info:

~~~shell
aws sts get-caller-identity
aws iam get-user [--user-name <user>]
~~~

Get account id from an access key id:

~~~shell
aws sts get-access-key-info --access-key-id=<access key>
~~~

Get account id from an access key id with `pacu`:

~~~pacu
# Current Profile
> run iam__decode_accesskey_id

# Specified Access Key
> run iam__decode_accesskey_id <access key>
~~~

When `sts get-caller-identity` is disabled or the main goal is to remain stealthy, an alternative method to obtain the principal name associate to current keys is to trigger some errors for particular services; AWS leaks the calling role and the account ID in those errors:

~~~shell
aws sqs list-queues
aws pinpoint-sms-voice send-voice-message
aws timestream-query describe-endpoints
~~~

**Note**: these services **are not logged in CloudTrail**!

Enumerate user's permissions with `pacu`:

~~~pacu
> run iam__enum_permissions
# OR, when no IAM privileges are grante - should be similar to aws-enumerator - more noisy
> run iam__bruteforce_permissions
> whoami
~~~

Enumerate users, roles, policies and groups with `pacu`:

~~~pacu
> run iam__enum_users_roles_policies_groups
~~~

Get **inline** user policies (policies specifically written for that user):

~~~shell
aws iam list-user-policies --user-name <username>
~~~

Get inline policy details:

~~~shell
aws iam get-user-policy --policy-name <policy name> --user-name <username>
~~~

Get user attached policies:

~~~shell
aws iam list-attached-user-policies --user-name <username>
~~~

List policies (might be interesting policies with "AttachmentCount" > 0):

~~~shell
aws iam list-policies
~~~

List policy versions:

~~~shell
aws iam list-policy-versions --policy-arn <policy arn>
~~~

Get policy version and associated permissions:

~~~shell
aws iam get-policy-version --policy-arn <policy arn> --version-id <version id>
~~~

Get user's group membership:

~~~shell
aws iam list-groups-for-user --user-name <username>
~~~

List group policies:

~~~shell
aws iam list-group-policies --group-name <group name>
~~~

List group attached policies:

~~~shell
aws iam list-attached-group-policies --group-name <group name>
~~~

List roles:

~~~shell
aws iam list-roles
~~~

Get role details and assume policy:

~~~shell
aws iam get-role --role-name <role name>
~~~

List **inline** role policies (policy specifically written for that role):

~~~shell
aws iam list-role-policies --role-name <role name>
~~~

List role attached policies:

~~~shell
aws iam list-attached-role-policies --role-name <role name>
~~~

Get details for policy attached to role:

~~~shell
aws iam get-role-policy --role-name <role name> --policy-name <policy name>
~~~

Request temporary credentials (**assume role**) to access AWS resources with a particular role:

~~~shell
aws sts assume-role --role-arn <role ARN> --role-session-name <any session name> [--external-id <external id>]
~~~

Enumerate all user permissions with [aws-enumerator](https://github.com/shabarkin/aws-enumerator):

~~~shell
# Setup credentials
aws-enumerator cred -aws_access_key_id <access key> -aws_region <region> -aws_secret_access_key <secret access key> 

# Enumerate all services
aws-enumerator enum --services all
## Filter only services to which the credentials have actual permissions
aws-enumerator enum --services all | grep -v '0 /' 

# Get permissions for each found service
aws-enumerator dump --services <services list>
~~~

AWS IAM Console Credentials Spraying/Bruteforcing using [GoAWSConsoleSpray](https://github.com/WhiteOakSecurity/GoAWSConsoleSpray):

~~~
# User/Password spraying against an AccountID (get it from sts)
GoAWSConsoleSpray -a <AccountID> -u <users list file> -p <password list files>
~~~

**Note**: **it seems that the tools does not strip hidden chars/spaces/newline and therefore the attack may fail even with valid credentials!** - if that's the case, try to rewrite the password wordlist.


Predefined groups:

- **Authenticated Users** - `http://acs.amazonaws.com/groups/global/AuthenticatedUsers` - All existing and authenticated AWS accounts.
- **All Users** - `http://acs.amazonaws.com/groups/global/AllUsers` - worldwide access to the resource (no authentication).
- **Log Delivery** - `http://acs.amazonaws.com/groups/s3/LogDelivery` - write access to the bucket to write server access logs.

###  Simple Storage Service - S3

AWS Buckets' resources location:

~~~
https://<bucket name>.s3.<region code>.amazonaws.com/<resource name>
https://s3.<region code>.amazonaws.com/<bucket name>/<resource name>
https://s3.amazonaws.com/<bucket name>/<resource name> # Deprecated
~~~

Get bucket region:

~~~shell
curl -Is https://<bucket URL> | grep 'x-amz-bucket-region' | awk -F ' ' '{print $2}'
~~~

Regions wordlist:

~~~
us-west-1
us-west-2
us-east-1
us-east-2
cn-north-1
cn-northwest-1
eu-central-1
eu-north-1
eu-west-1
eu-west-2
eu-west-3
ap-northeast-1
ap-northeast-2
ap-northeast-3
ap-south-1
ap-southeast-1
ap-southeast-2
ca-central-1
me-south-1
sa-east-1
us-gov-east-1
us-gov-west-1
ap-east-1
~~~

Most common s3 bucket names: [https://github.com/koaj/aws-s3-bucket-wordlist](aws-s3-bucket-wordlist)

From browser, if the root of a bucket it's not accessible, try appending `?prefix=&delimiter=/`. By default, AWS cli includes this parameters automatically:

~~~
# Not accessible!
https://<bucket name>.s3.<region code>.amazonaws.com/

# Accessible!
https://<bucket name>.s3.<region code>.amazonaws.com/?prefix=&delimiter=/
~~~

List all buckets that current user can access:

~~~shell
aws s3 ls
~~~

List content in a Bucket:

~~~shell
aws s3 ls s3://<bucket name>/ --recursive
aws s3api list-objects-v2 --bucket <bucket name> [--region <region>]
~~~

Copy a file from and to the bucket to a local path:

~~~shell
# From bucket to local
aws s3 cp s3://<bucket name>/<resource name> <destination path>

# From local to bucket
aws s3 cp <file path> s3://<bucket name>/<resource name>

# From bucket to local
aws s3api get-object --bucket <bucket name> --key <resource key> [--region <region>] <output file>
~~~

List bucket's versioning:

~~~shell
aws s3api get-bucket-versioning --bucket <bucket name> --region <region>
~~~

List bucket object's versioning:

~~~shell
aws s3api get-bucket-versioning --bucket <bucket name> [--region <region>]

# Get only objects that actually have versions
aws s3api get-bucket-versioning --bucket <bucket name> [--region <region>] | jq  '.Versions[]|select(.VersionId != "null")'

aws s3api get-bucket-versioning --bucket <bucket name> [--region <region>] --query "Versions[?VersionId!='null']"
~~~

Get specific object version:

~~~shell
aws s3api get-object --bucket <bucket name> --key <resource key> --version-id <version id> [--region <region>] <output file>
~~~

List bucket's policy:

~~~shell
aws s3api get-bucket-policy --bucket <bucket name>
~~~

List bucket's ACLs:

~~~shell
aws s3api get-bucket-acl --bucket <bucket name>
~~~

**Note**: Even though no particular privileges are found on current profile, **it's always worth trying the previous two commands**!

**Note**: If getting `Access Denined` try appending `--no-sign-request` to AWS cli commands.

Find the Account ID to which a S3 bucket belongs to using [s3-account-search](https://github.com/WeAreCloudar/s3-account-search):

~~~shell
s3-account-search --profile [<profile> ] <known role> s3://<bucket>
~~~

where `<known role>` is a role with one of the following permissions:

- `s3:getObject`: download a file from the bucket
- `s3:ListBucket`: list the content of the bucket

**Note**: current account must have the `sts:AssumeRole` permission on the `<known role>`

### Secrets Manager

Enumerate Secret Manager with `pacu`:

~~~pacu
> run secrets__enum
~~~

List secrets:

~~~shell
aws secretsmanager list-secrets --region <region>
~~~

Get secret:

~~~shell
aws secretsmanager get-secret-value --secret-id <secret id> --region <region>
~~~

### Elastic Compute Cloud -  EC2

Enumerate EC2 with `pacu`:

~~~pacu
> run ec2__enum
~~~

List images owned by current user:

~~~shell
aws ec2 describe-images --owners self
~~~

List instances for current user:

~~~shell
aws ec2 describe-instances --region <region>
~~~

List volumes for current user:

~~~shell
aws ec2 describe-volumes --region <region>
~~~

List snapshots owned by current user:

~~~shell
aws ec2 describe-snapshots --owner-ids self
~~~

List snapshots with tags (useful to filter out automatic snapshots):

~~~shell
aws ec2 describe-snapshots --query 'Snapshots[?Tags!=null]'
~~~

Enumerate EBS snapshots with `pacu`:

~~~pacu
> ebs__enum_volumes_snapshots
~~~

Create a volume from the specified snapshot - see [AWS Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.htm):

~~~shell
aws ec2 create-volume --availability-zone <target availability zone> --snapshot-id  <snapshot id> --region <region>
~~~

List available Availability Zone for specified region:

~~~shell
aws ec2 describe-availability-zones --query 'AvailabilityZones[].ZoneName' --region <region>
~~~

Having the volume, it's possible to create an EC2 instance from the AWS Console and then attach the volume. **Note that the instance must be in the same availability zone as the volume!** It should also be possible to attach the volume directly in the instance creation wizard.

**Loot Public EBS Snapshot** - A possible attack path is:

1. Find a misconfigured snapshot or abuse dumped credentials
2. Get snapshot id
3. Create a volume with that snapshot (in the same region)
4. Create an instance using this volume
5. Explore the snapshot content

List available launch templates:

~~~shell
aws ec2 describe-launch-templates
~~~

Get launch template details:

~~~shell
aws ec2 describe-launch-template-versions --launch-template-id <launch template id>
~~~

Get admin password for an instance - please note that the private key is required in order to obtain the cleartext password:

~~~shell
aws ec2 get-password-data --instance-id <instance id> --priv-launch-key <private key> --region <region>
~~~

### Lambda & API

Enumerate Lambda with `pacu`:

~~~pacu
> run lambda__enum
~~~

List available rest API:

~~~shell
aws apigateway get-rest-apis
~~~

Get rest API detail:

~~~shell
aws apigateway get-rest-api --rest-api-id <rest api id>
~~~

Get rest API stages:

~~~shell
aws apigateway get-stages --rest-api-id <rest api id>
~~~

Rest API URL is :

~~~
https://<rest api id>.execute-api.<region>.amazonaws.com/<stage>/<lambda function>
~~~

List available lambda functions:

~~~shell
aws lambda list-functions
~~~

Invoke lambda functions:

~~~shell
aws lambda invoke --function-name <function name> [--payload "<json formatted payload>"] <output file>
~~~

Invoke lambda function from URL:

~~~
https://<url-id>.lambda-url.<region>.on.aws
~~~

where  `<url-id>` is randomly generated when the lambda function is created.
Refer to [Lambda URLs Invocation](https://docs.aws.amazon.com/en_us/lambda/latest/dg/urls-invocation.html)

Get lambda function associated policy:

~~~shell
aws lambda get-policy --function-name <function name>
~~~

Useful resource: [Tutorial: Create a REST API with a Lambda proxy integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html)

### Elastic Container Registry - ECR

Enumerate ECR with `pacu`:

~~~pacu
> run ecr__enum
~~~

Describe registry:

~~~
aws ecr describe-registry
~~~

Describe repositories:

~~~
aws ecr describe-repositories [--registry-id <registry id>]
~~~

Note that `registry id` should be equal to the `account id`.

List images in repository:

~~~
aws ecr list-images --repository-name <repository name>
aws ecr describe-images --repository-name <repository name>
~~~

Repository URL structure:

~~~
<aws account id>.dkr.ecr.<region>.amazonaws.com
~~~

Get login password to registry:

~~~
aws ecr get-login
aws ecr get-login-password
~~~

Pull image from registry:

~~~shell
# By tag
docker pull <registry>/<repository>:<tag>

# By digest
docker pull <registry>/<repository>@<image digest>
~~~

Sometimes could be interesting to take a look to an image history containing the last Dockerfile commands:

~~~
docker history <image id or name>
~~~


### Relational Database Service - RDS

Enumerate RDS with `pacu`:

~~~pacu
> run rds__enum
> rds__enum_snapshots
~~~

List current user DB and DB clusters:

~~~shell
aws rds describe-db-instances --region <region>
aws rds describe-db-clusters --region <region>
~~~

List current user DB and DB clusters snapshots:

~~~shell
aws rds describe-db-snapshots --region <region>

aws rds describe-db-cluster-snapshots --region <region>
~~~

List public DB and DB clusters snaphots:

~~~shell
aws rds describe-db-snapshots --snapshot-type public --include-public --region <region>

aws rds describe-db-cluster-snapshots --snapshot-type public --include-public --region <region>
~~~

Having the account id of an user, it's possible to find its public snapshots since the **account id** is contained into the ARN of each snapshot. Use `grep` to filter those snapshots by **account id**.

Get snapshot by id:

~~~shell
aws rds describe-db-snapshots [--include-public --snapshot-type public] --region <region> --db-cluster-snapshot-identifier <snapshot identifier>

aws rds describe-db-cluster-snapshots [--include-public --snapshot-type public] --region <region> --db-cluster-snapshot-identifier <snapshot identifier>
~~~

**Plunder Public RDS Snapshots**: 

1. From the AWS console, restore the public snapshot 
2. If restoring as private DB, create a connected EC2 instance and associate it
3. Change the root password (if not known the original)
4. Access the content via the EC2 instance (if private) or directly if restored as public RDS instance.

### Simple Queue Service - SQS

List queues:

~~~shell
aws sqs list-queues
~~~

Receive messages:

~~~shell
aws sqs receive-message --queue-url <queue URL> [--message-attribute-names [All|<attributes>]]
~~~

Send messages:

~~~shell
aws sqs send-message --queue-url <queue URL> --message-attributes '{ "<attribute>": { "StringValue": "<value>", "DataType":"<type>"},...}' --message-body "<message body>"
~~~

Refer to [SQS Message Attributes](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-metadata.html#sqs-message-attributes).

### DynamoDB

Enumerate DynamoDB with `pacu`:

~~~pacu
> run dynamodb__enum
~~~

List available endpoints:

~~~shell
aws dynamodb describe-endpoints --region <region>
~~~

List available tables:

~~~shell
aws dynamodb list-tables --region <region>
~~~

List available global tables:

~~~shell
aws dynamodb list-global-tables --region <region>
~~~

Describe table (useful to get key attributes to be used for querying):

~~~shell
aws dynamodb describe-table --table-name <table name> --region <region>
~~~

See there how to perform queries with that shitty format: [Querying tables in DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html)

Get table content:

~~~shell
aws dynamodb scan --table-name <table name> --region <region>
~~~

List available backups:

~~~shell
aws dynamodb list-backups --region <region>
~~~

### CodeCommit

List repositories:

~~~shell
aws codecommit list-repositories --region <region>
~~~

Get repository details:

~~~shell
aws codecommit get-repository --repository-name <repository name> --region <region>
~~~

Get repository credentials:

~~~shell
echo -e "protocol=https\npath=<repository path>\nhost=<repository host>" | aws codecommit credential-helper get
~~~

List repository branches:

~~~shell
aws codecommit list-branches --repository-name <repository name> --region <region>
~~~

Get branch last commit:

~~~shell
aws codecommit get-branch --branch-name <branch name> --repository-name <repository name> --region <region>
~~~

Get commit:

~~~shell
aws codecommit get-commit --commit-id <commit id> --repository-name <repository name> --region <region>
~~~

Get differences between two or more commits:

~~~shell
aws codecommit get-differences --before-commit-specifier <older commit> --after-commit-specifier <later commit> --repository-name <repository name> --region <region>
~~~

Get file content:

~~~shell
aws codecommit get-file --file-path "<file path>" --commit-specifier <commit id> --repository-name <repository name>  --region <region> | jq -r .fileContent | base64 -d
~~~

### Cognito

![[aws-cognito-auth-flow.png]]

\*Note: Cognito could be configured to allow anonymous users. In that case step 1 and 2 are skipped.

Enumerate Cognito with `pacu`:

~~~pacu
> run cognito__enum
~~~

Get an Identity from an identity pool (step 3.1) - Anonymously:

~~~shell
aws cognito-identity get-id --identity-pool-id <user pool> [--no-sign-request] --region <region>
~~~

Get temporary AWS credentials (step 3.2) - Anonymously:

~~~shell
aws cognito-identity get-credentials-for-identity --identity-id <identity id> --no-sign-request --region <region>
~~~

Signup to a user pool (step 0):

~~~shell
aws cognito-idp sign-up --client-id <client id> --username <username> --password <password> --region <region>
~~~

\*Note: it's possible to perform username enumeration with this command since "User already exists" is returned when signing up with an existing username.

Get Access and ID JWTs (step 1-2):

~~~shell
cognito-idp.us-east-1.amazonaws.com/us-east-1_8rcK7abtz
~~~

\*Notes: 

- Auth flow may vary depending on the authentication scheme configured for the user pool.
- The user pool id is contained in the `iss` claim of the issued JWT access token.

If getting `UserNotConfirmedException`, signup specifying the email to which receive the confirmation code ("Allow Cognito to automatically send messages to verify and confirm" setting should be enabled - this is generally true):

~~~shell
aws cognito-idp sign-up --client-id <client id> --username <username> --password <password> --user-attributes Name="email",Value="<email>" Name="name",Value="<name>" --region <region>
~~~

Confirm the signup with the code received on the email:

~~~shell
aws cognito-idp confirm-sign-up --client-id <client id> --username <username> --confirmation-code <confirmation code> --region <region>
~~~


Get an Identity from an identity pool (step 3.1):

~~~shell
aws cognito-identity get-id --identity-pool-id <identity pool id> --logins "{ \"<access token iss claim content without https://>\": \"<id token>\" }" --region <region>
~~~

Get temporary AWS credentials (step 3.2):

~~~shell
aws cognito-identity get-credentials-for-identity --identity-id <identity id> --logins "{ \"<access token iss claim content without https://>\": \"<id token>\" }" --region <region>
~~~

### Meta Data

When dumping API keys from metadata, set also the `api_session_token` in the AWS CLI config.
#### EC2

Running EC2 instance metadata (Instance Metadata Version - IMS) base location:

~~~
# IPv4
http://169.254.169.254/latest/meta-data/

# IPv6
http://[fd00:ec2::254]/latest/meta-data/
~~~

Get instance's IAM role:

~~~
http://169.254.169.254/latest/meta-data/iam/info
~~~

where, depending on the response:

- **404 Not Found:** no IAM role associated with the EC2 instance
- **200 OK with empty body:** IAM role has been revoked
- **200 OK with body:** IAM role associated with EC2 instance

IAM credentials are located at:

~~~
http://169.254.169.254/latest/meta-data/iam/security-credentials/<IAM role name>
~~~

From IMVSv2, an SSRF protection has been introduced requiring the user to create a token and pass it in the `X-aws-ec2-metadata-token` header. The token can the requested at:

~~~
http://169.254.169.254/latest/api/token
~~~

#### ECS

Running ECS task metadata location, including a list of the container IDs and names for all of the containers associated with the task.:

~~~
# Deprecated
http://169.254.170.2/v2/metadata

# v4
http://169.254.170.2/v4/metadata
~~~

Running ECS container metadata location:

~~~
# v2 - Deprecated
http://169.254.170.2/v2/metadata/<container id>

# v4
http://169.254.170.2/v4/<container id>
~~~

Running ECS container credentials location:

~~~
http://169.254.170.2/v2/credentials/<guid>
~~~

Note: `<guid>` can be found in environment variable `AWS_CONTAINER_CREDENTIALS_RELATIVE_URI` on the running container (RCE, LFI or other methods are needed to access it)

### Automated Scanner

#### Prowler

Launch all checks within [prowler](https://github.com/prowler-cloud/prowler):

~~~shell
prowler aws [--profile <profile>]
~~~

List available checks within:

~~~shell
prowler aws --list-checks
~~~

List available categories:

~~~shell
prowler aws --list-categories
~~~

List available services:

~~~shell
prowler aws --list-categories
~~~

Perform specific checks:

~~~shell
prowler aws --checks <checks list>
~~~

Perform checks from specific categories:

~~~shell
prowler aws --categories <categories list>
~~~

Perform checks for specific services:

~~~shell
prowler aws --services <services list>
~~~

**Note**: previous three command can be combined.


#### PACU

Set up keys for current session:

~~~pacu
> set_keys
~~~

List available modules:

~~~pacu
> ls
~~~

Run module:

~~~pacu
> run <module name> 
~~~

Show enumerated data:

~~~pacu
> data
~~~

Query data with `jq`:

~~~pacu
> jq <query> <service>
~~~

List of useful queries:

~~~pacu
# Get enumerated EC2 instances' names
> jq .Instances.[]|{KeyName:.KeyName,InstanceId:.InstanceId,ImageId:.ImageId,Region:.Region,Tags:.Tags,PrivateIpAddress:.PrivateIpAddress,PublicIpAddress:.PublicI  
pAddress} EC2

~~~
