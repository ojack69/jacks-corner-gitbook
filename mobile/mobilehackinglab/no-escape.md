Title: MobileHackingLab - No Escape
Slug: mobile/mobilehackinglab/no-escape
Date: 2025-10-05 18:00
Category: Mobile

This is an iOS mobile challenge from [MobileHackingLabs](https://www.mobilehackinglab.com/course/lab-no-escape).

The challenge centers around a fictitious app called No Escape, designed with robust jailbreak detection mechanisms. Your mission is to bypass these mechanisms and gain full access to the app's functionalities using Frida.

**Objective**: Evade the jailbreak detection implemented in the No Escape app to get a flag.

When opening the application with a Jailbroken device, the following error message is returned:

![[no-escape-app-1.jpg]]

## Static Analysis

After decompiling the application, the method `isJailbroken` is easily identified:


~~~c
/* No_Escape.isJailbroken() -> Swift.Bool */

bool No_Escape::isJailbroken(void)

{
  ulong in_x0;
  uint uStack_1c;
  uint uStack_18;
  uint uStack_14;
  
  $$No_Escape.(checkForJailbreakFiles_in__BCE8F13474E5A52C60853EA803F80A81)()_->_Swift.Bool();
  uStack_14 = (uint)in_x0;
  if ((in_x0 & 1) == 0) {
    $$No_Escape.(checkForWritableSystemDirectories_in__BCE8F13474E5A52C60853EA803F80A81)()_->_Swift. Bool
              ();
  }
  else {
    uStack_14 = 1;
  }
  if ((uStack_14 & 1) == 0) {
    $$No_Escape.(canOpenCydia_in__BCE8F13474E5A52C60853EA803F80A81)()_->_Swift.Bool();
    uStack_18 = uStack_14;
  }
  else {
    uStack_18 = 1;
  }
  if ((uStack_18 & 1) == 0) {
    $$No_Escape.(checkSandboxViolation_in__BCE8F13474E5A52C60853EA803F80A81)()_->_Swift.Bool();
    uStack_1c = uStack_18;
  }
  else {
    uStack_1c = 1;
  }
  return (uStack_1c & 1) != 0;
}
~~~

![[no-escape-static-1.png]]

This method implements 4 different checks:

- `checkForJailbreakFiles`: This check looks for common jailbreak files such as `/Application/Cydia.app`, `/bin/bash`, etc.

~~~c

undefined4
$$No_Escape.(checkForJailbreakFiles_in__BCE8F13474E5A52C60853EA803F80A81)()_->_Swift.Bool(void)

{
  long lVar1;
  undefined8 uVar2;
  char *pcVar3;
  undefined *puVar4;
  undefined *puVar5;
  undefined8 *puVar6;
  undefined8 uVar7;
  undefined8 uStack_50;
  long lStack_48;
  undefined8 uStack_40;
  undefined8 uStack_38;
  undefined8 uStack_30;
  undefined8 uStack_28;
  
  puVar4 = PTR__$sSSN_1001646a8;
  uStack_28 = 0;
  uStack_38 = 0;
  uStack_30 = 0;
  uVar2 = 6;
  puVar6 = (undefined8 *)PTR__$sSSN_1001646a8;
  _$ss27_allocateUninitializedArrayySayxG_BptBwlF();
  pcVar3 = "/Applications/Cydia.app";
  uVar7 = 0x17;
  _$sSS21_builtinStringLiteral17utf8CodeUnitCount7isASCIISSBp_BwBi1_tcfC
            ("/Applications/Cydia.app",0x17,1);
  *puVar6 = pcVar3;
  puVar6[1] = uVar7;
  pcVar3 = "/Library/MobileSubstrate/MobileSubstrate.dylib";
  uVar7 = 0x2e;
  _$sSS21_builtinStringLiteral17utf8CodeUnitCount7isASCIISSBp_BwBi1_tcfC
            ("/Library/MobileSubstrate/MobileSubstrate.dylib",0x2e,1);
  puVar6[2] = pcVar3;
  puVar6[3] = uVar7;
  pcVar3 = "/bin/bash";
  uVar7 = 9;
  _$sSS21_builtinStringLiteral17utf8CodeUnitCount7isASCIISSBp_BwBi1_tcfC("/bin/bash",9,1);
  puVar6[4] = pcVar3;
  puVar6[5] = uVar7;
  pcVar3 = "/usr/sbin/sshd";
  uVar7 = 0xe;
  _$sSS21_builtinStringLiteral17utf8CodeUnitCount7isASCIISSBp_BwBi1_tcfC("/usr/sbin/sshd",0xe,1);
  puVar6[6] = pcVar3;
  puVar6[7] = uVar7;
  pcVar3 = "/etc/apt";
  uVar7 = 8;
  _$sSS21_builtinStringLiteral17utf8CodeUnitCount7isASCIISSBp_BwBi1_tcfC("/etc/apt",8,1);
  puVar6[8] = pcVar3;
  puVar6[9] = uVar7;
  pcVar3 = "/bin";
  uVar7 = 4;
  _$sSS21_builtinStringLiteral17utf8CodeUnitCount7isASCIISSBp_BwBi1_tcfC("/bin",4,1);
  puVar6[10] = pcVar3;
  puVar6[0xb] = uVar7;
  Swift::$_finalizeUninitializedArray(uVar2,puVar4);
  uStack_28 = uVar2;
  _swift_bridgeObjectRetain();
  puVar4 = &_$sSaySSGMD;
  uStack_40 = uVar2;
  ___swift_instantiateConcreteTypeFromMangledName();
  puVar5 = puVar4;
  Swift::Array<String>::$lazy_protocol_witness_table_accessor();
  _$sSlss16IndexingIteratorVyxG0B0RtzrlE04makeB0ACyF(&uStack_38,puVar4,puVar5);
  while( true ) {
    ___swift_instantiateConcreteTypeFromMangledName(&_$ss16IndexingIteratorVySaySSGGMD);
    _$ss16IndexingIteratorV4next7ElementQzSgyF(&uStack_50);
    lVar1 = lStack_48;
    uVar7 = uStack_50;
    if (lStack_48 == 0) {
      $$outlined_destroy_of_Swift.IndexingIterator<>(&uStack_38);
      _swift_bridgeObjectRelease(uVar2);
      return 0;
    }
    puVar5 = &_OBJC_CLASS_$_NSFileManager;
    _objc_opt_self();
    _objc_msgSend();
    _objc_retainAutoreleasedReturnValue();
    _swift_bridgeObjectRetain(lVar1);
    _$sSS10FoundationE19_bridgeToObjectiveCSo8NSStringCyF(uVar7,lVar1);
    _swift_bridgeObjectRelease(lVar1);
    puVar4 = puVar5;
    _objc_msgSend(puVar5,"fileExistsAtPath:",uVar7);
    _objc_release(uVar7);
    _objc_release(puVar5);
    if (((ulong)puVar4 & 1) != 0) break;
    _swift_bridgeObjectRelease(lVar1);
  }
  _swift_bridgeObjectRelease(lVar1);
  $$outlined_destroy_of_Swift.IndexingIterator<>(&uStack_38);
  _swift_bridgeObjectRelease(uVar2);
  return 1;
}


~~~


![[no-escape-static-2.png]]


- `checkForWritableSystemDirectories`: This check tries performing write operation on the file system `/private` which is supposed to be read-only on non-jailbroken systems.

~~~c
/* WARNING: Removing unreachable block (ram,0x00010000a690) */

uint $$No_Escape.(checkForWritableSystemDirectories_in__BCE8F13474E5A52C60853EA803F80A81)()_->_Swift .Bool
               (void)

{
  bool bVar1;
  Encoding EVar2;
  undefined *puVar3;
  undefined8 uVar4;
  undefined1 local_120 [8];
  undefined8 local_118;
  undefined8 local_110;
  undefined8 local_100;
  undefined8 local_f8;
  uint local_f0;
  uint local_ec;
  undefined8 local_e8;
  NSString *local_e0;
  undefined *local_d8;
  uint local_cc;
  undefined *local_c8;
  long local_c0;
  ulong local_b8;
  String local_b0;
  uint local_9c;
  undefined1 *local_98;
  undefined **local_90;
  undefined8 local_88;
  undefined8 local_80;
  undefined8 local_78;
  undefined *local_70;
  void *local_68;
  String local_60;
  String local_50;
  undefined8 local_40;
  long local_38;
  
  local_38 = *(long *)PTR____stack_chk_guard_1001642c8;
  local_50 = (String)ZEXT816(0);
  local_78 = 0;
  local_c8 = (undefined *)Encoding::$typeMetadataAccessor();
  local_c0 = *(long *)(local_c8 + -8);
  local_b8 = *(long *)(local_c0 + 0x40) + 0xfU & 0xfffffffffffffff0;
  (*(code *)PTR____chkstk_darwin_100164268)();
  local_98 = local_120 + -local_b8;
  local_9c = 1;
  local_b0 = Swift::String::init("/private/jailbreak_test.txt",0x1b,1);
  local_50 = local_b0;
  local_60 = Swift::String::init("This is a test.",0xf,(byte)local_9c & 1);
  local_90 = &local_70;
  local_70 = local_b0.str;
  local_68 = local_b0.bridgeObject;
  EVar2 = Encoding::$get_utf8((Encoding)local_b0.str);
  Swift::String::$lazy_protocol_witness_table_accessor();
  (extension_Foundation)::Swift::StringProtocol::$write
            (local_90,local_9c & 1,local_98,PTR_$$type_metadata_for_Swift.String_1001646a8,
             PTR_$$type_metadata_for_Swift.String_1001646a8,EVar2.unknown);
  local_88 = 0;
  (**(code **)(local_c0 + 8))(local_98,local_c8);
  $$outlined_destroy_of_Swift.String(&local_60);
  local_40 = 0;
  puVar3 = &_OBJC_CLASS_$_NSFileManager;
  _objc_opt_self();
  _objc_msgSend();
  _objc_retainAutoreleasedReturnValue();
  local_d8 = puVar3;
  _swift_bridgeObjectRetain(local_b0.bridgeObject);
  local_e0 = (extension_Foundation)::Swift::String::_bridgeToObjectiveC();
  _swift_bridgeObjectRelease(local_b0.bridgeObject);
  local_80 = local_40;
  puVar3 = local_d8;
  _objc_msgSend(local_d8,"removeItemAtPath:error:",local_e0,&local_80);
  local_cc = (uint)puVar3;
  local_e8 = local_80;
  _objc_retain();
  uVar4 = local_40;
  local_40 = local_e8;
  _objc_release(uVar4);
  _objc_release(local_e0);
  _objc_release(local_d8);
  bVar1 = (local_cc & 1) != 0;
  if (bVar1) {
    _swift_bridgeObjectRelease(local_b0.bridgeObject);
  }
  else {
    local_118 = local_40;
    uVar4 = local_40;
    Foundation::$_convertNSErrorToError();
    local_110 = uVar4;
    _objc_release(local_118);
    _swift_willThrow();
    local_100 = local_110;
    local_f8 = local_100;
    _swift_errorRetain();
    local_78 = local_f8;
    _swift_errorRelease();
    _swift_errorRelease(local_f8);
    _swift_bridgeObjectRelease(local_b0.bridgeObject);
  }
  local_ec = (uint)bVar1;
  local_f0 = local_ec;
  if (*(long *)PTR____stack_chk_guard_1001642c8 == local_38) {
    return local_ec;
  }
                    /* WARNING: Subroutine does not return */
  ___stack_chk_fail();
}


~~~

![[no-escape-static-3.png]]

- `canOpenCydia`: This check tries to open Cydia with a deeplink to a fake package. 

~~~c

undefined4 $$No_Escape.(canOpenCydia_in__BCE8F13474E5A52C60853EA803F80A81)()_->_Swift.Bool(void)

{
  long lVar1;
  undefined1 *puVar2;
  undefined *puVar3;
  URL UVar4;
  long extraout_x8;
  String SVar5;
  undefined1 auStack_a0 [8];
  code *local_98;
  NSURL *local_90;
  undefined *local_88;
  uint local_7c;
  ulong local_78;
  ulong local_70;
  undefined1 *local_68;
  ulong local_60;
  long local_58;
  void *local_50;
  long local_48;
  undefined1 *local_40;
  undefined4 local_34;
  undefined *local_30;
  long local_28;
  
  local_28 = 0;
  puVar3 = &$$demangling_cache_variable_for_type_metadata_for_Foundation.URL?;
  ___swift_instantiateConcreteTypeFromMangledName();
  local_78 = *(long *)(*(long *)(puVar3 + -8) + 0x40) + 0xfU & 0xfffffffffffffff0;
  (*(code *)PTR____chkstk_darwin_100164268)();
  puVar2 = auStack_a0 + -local_78;
  local_40 = puVar2;
  local_30 = (undefined *)Foundation::URL::typeMetadataAccessor();
  local_48 = *(long *)(local_30 + -8);
  local_70 = *(long *)(local_48 + 0x40) + 0xfU & 0xfffffffffffffff0;
  (*(code *)PTR____chkstk_darwin_100164268)();
  lVar1 = -local_70;
  local_60 = extraout_x8 + 0xfU & 0xfffffffffffffff0;
  local_68 = puVar2 + lVar1;
  (*(code *)PTR____chkstk_darwin_100164268)();
  local_58 = (long)(puVar2 + lVar1) - local_60;
  local_34 = 1;
  local_28 = local_58;
  SVar5 = Swift::String::init("cydia://package/com.example.package",0x23,1);
  local_50 = SVar5.bridgeObject;
  Foundation::URL::$init();
  _swift_bridgeObjectRelease(local_50);
  puVar2 = local_40;
  (**(code **)(local_48 + 0x30))(local_40,local_34,local_30);
  UVar4.unknown = local_68;
  if ((int)puVar2 == 1) {
    $$outlined_destroy_of_Foundation.URL?(local_40);
  }
  else {
    (**(code **)(local_48 + 0x20))(local_58,local_40,local_30);
    puVar3 = &_OBJC_CLASS_$_UIApplication;
    _objc_opt_self();
    _objc_msgSend();
    _objc_retainAutoreleasedReturnValue();
    local_88 = puVar3;
    (**(code **)(local_48 + 0x10))(UVar4.unknown,local_58,local_30);
    local_90 = Foundation::URL::_bridgeToObjectiveC(UVar4);
    local_98 = *(code **)(local_48 + 8);
    (*local_98)(local_68,local_30);
    puVar3 = local_88;
    _objc_msgSend(local_88,"canOpenURL:",local_90);
    local_7c = (uint)puVar3;
    _objc_release(local_90);
    _objc_release(local_88);
    if ((local_7c & 1) != 0) {
      (*local_98)(local_58,local_30);
      return 1;
    }
    (*local_98)(local_58,local_30);
  }
  return 0;
}


~~~

![[no-escape-static-4.png]]

- `checkSandboxViolation`: This check looks for the folder `/private/var/lib/apt/` which indicates that the device has been jailbroken.

~~~c

bool $$No_Escape.(checkSandboxViolation_in__BCE8F13474E5A52C60853EA803F80A81)()_->_Swift.Bool(void)

{
  bool bVar1;
  undefined *puVar2;
  NSString *pNVar3;
  undefined *puVar4;
  String SVar5;
  void *local_40;
  
  SVar5 = Swift::String::init("/private/var/lib/apt/",0x15,1);
  puVar2 = &_OBJC_CLASS_$_NSFileManager;
  _objc_opt_self();
  _objc_msgSend();
  _objc_retainAutoreleasedReturnValue();
  local_40 = SVar5.bridgeObject;
  _swift_bridgeObjectRetain(local_40);
  pNVar3 = (extension_Foundation)::Swift::String::_bridgeToObjectiveC();
  _swift_bridgeObjectRelease(local_40);
  puVar4 = puVar2;
  _objc_msgSend(puVar2,"fileExistsAtPath:",pNVar3);
  _objc_release(pNVar3);
  _objc_release(puVar2);
  bVar1 = ((ulong)puVar4 & 1) == 0;
  if (bVar1) {
    _swift_bridgeObjectRelease(local_40);
  }
  else {
    _swift_bridgeObjectRelease(local_40);
  }
  return !bVar1;
}


~~~

![[no-escape-static-5.png]]

## Solution

The solution is straightforward: by using `frida`, I'll hook to these methods and force the return value to `false` in order to bypass the security controls.

**Note**: a simpler solution would be to just hook the `isJailbroken` method instead of all the specific checks.

Since `checkForJailbreakFiles`, `checkForWritableSystemDirectories`, `canOpenCydia`, and `checkSandboxViolation` are not exported functions, in order to hook them, I need their offset, as shown below:

![[no-escape-ghidra-1.png]]

Please note that address in `ghidra` start from the configured **base image address** which is found at:

~~~
Window > Memory Map
~~~

![[no-escape-ghidra-2.png]]

This mean that in the `frida` script, I must subtract this base image address from the actual function offset. The final solution script is the following:

~~~javascript
const offsetsLabels = ['checkForJailbreakFiles', 'checkForWritableSystemDirectories', 'canOpenCydia', 'checkSandboxViolation'];
const offsets = [0x00000a118, 0x00000a3fc, 0x00000a6fc, 0x00000a940];
const baseAddress = Module.getBaseAddress("No Escape");

offsets.forEach((o, i) =>{
    let label = offsetsLabels[i];
    console.log("[!] Attaching to: " + label)
    Interceptor.attach(baseAddress.add(o), {
        onEnter: function(args){
            console.log("\n[>] Entered: " + label)
        },
        onLeave: function(retval){
            console.log("[>] Changing return value to false")
            retval.replace(0)
        }
    })
})
~~~

![[no-escape-solution-1.png]]

Launch `frida` **before** opening the application as follows; the `-W` option instructs `frida` to await for the **No Escape** process to spawn instead of attaching to a running process: 

~~~shell
frida -U -l bypass.js -W 'com.mobilehackinglab.No-Escape.36V2J65722' 
~~~

![[no-escape-frida-1.png]]

Having bypassed all the security checks, the flag is returned:

![[no-escape-app-2.jpg]]
