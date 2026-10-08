# MobileHackingLab - CyclicScanner

After starting the CyclicScanner application, the user is asked to give external file system full access. Then the following screen is presented:

![cyclic-scanner-app-1](../../images/mobile/mobilehackinglab/cyclic-scanner/cyclic-scanner-app-1.png)

By activating the switch, a toast message states that some sort of service is started and it's scanning the device regularly:

![cyclic-scanner-app-2](../../images/mobile/mobilehackinglab/cyclic-scanner/cyclic-scanner-app-2.png)
## Static Analysis

After decompiling the application APK and analyzing the class `com.mobilehackinglab.cyclicscanner.scanner.ScanService`, I discovered that the service is regularly looping, recursively iterating the external storage directory (**FilesKt.walk** - line 65):

![scan-service](../../images/mobile/mobilehackinglab/cyclic-scanner/scan-service.png)

For each file path, some checks are performed by invoking the `scanFile` method from  the class `com.mobilehackinglab.cyclicscanner.scanner.ScanEngine` (line 70). 

The method `scanFile` in the `ScanEngine` class is **unsafely** using the absolute path from the argument file in a string concatenation (line 40). The resulting string is then used to run a shell command (line 41).

![unsafe-scan-file-function](../../images/mobile/mobilehackinglab/cyclic-scanner/unsafe-scan-file-function.png)
## Exploitation

Since no sanitization or validation on the file name passed as argument to the `scanFile` function is performed, it's possible to achieve a command execution on the device by injecting shell command in the file name:

```shell
touch '/storage/emulated/0/some_file.txt;id>pwned'
```

When the service perform the checks on this file, the shell command in the file name will be executed:

![successfull-exploit](../../images/mobile/mobilehackinglab/cyclic-scanner/successfull-exploit.png)

Taking a look at the logs:

![logcat-logs](../../images/mobile/mobilehackinglab/cyclic-scanner/logcat-logs.png)
