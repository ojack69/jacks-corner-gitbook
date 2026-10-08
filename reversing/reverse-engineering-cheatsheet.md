# Reverse Engineering Cheatsheet

## Reverse Engineering Common Strategies

- **Patching Assembly**: Patching assembly involves modifying an executable file's binary code at runtime, typically by injecting malicious or benign code into the original program. This can be achieved through various techniques such as buffer overflows, return-oriented programming (ROP), and jump tables. The goal of patching assembly is to evade detection by security software that relies on static analysis or dynamic analysis of the executable's binary code.
- **Tampering Registers**:  Tampering with registers involves modifying their values at runtime, which can be used to bypass security controls such as access control lists (ACLs) and data execution prevention (DEP). This technique is often employed in attacks like buffer overflows and return-oriented programming (ROP). By manipulating register values, attackers can inject malicious code into the program's memory space.
- **Replace instructions with** `nop`: This strategy involves deleting specific instructions from an executable file and replacing them with a series of `nop` (no operation) instructions, each equal in size to the original instruction. The deleted instructions are typically used to perform malicious actions such as data corruption or unauthorized access.

## Fundamentals

## Data sizes

**In x86 terminology/documentation, a "word" is 16 bits** because x86 evolved out of 16-bit 8086.

| Term   | x86 Bytes | x86 Bits | x64 Bytes | x64 Bits |
| ------ | --------- | -------- | --------- | -------- |
| byte   | 1         | 8        | 1         | 8        |
| word   | 2         | 16       | 4         | 32       |
| dword* | 4         | 32       | 8         | 64       |
| qword* | 8         | 64       | 16        | 128      |

\*The effective size depends on the architecture using the *word* as reference. A *dword* is then the double of a *word* whilst a qword is the quadruple of a *word*.

### Bitwise Operations

| Operation   | Operator |
| ----------- | -------- |
| Complement  | ~        |
| AND         | &        |
| OR          | \|       |
| XOR         | ^        |
| Left Shift  | <<       |
| Right Shift | >>       |
#### Complement
| Value | Result |
| ----- | ------ |
| ~ 1   | 0      |
| ~0    | 1      |

Example:

```
~12 = -13
~12 = ~00001100 = 11110011 = -13
13 = 00001101
~13 = 11110010
-13 = ~13 + 1 = 11110011
```

#### Bitwise AND
| V1  | V2  | Reults |
| --- | --- | ------ |
| 1   | 1   | 1      |
| 1   | 0   | 0      |
| 0   | 1   | 0      |
| 0   | 0   | 0      |

Example:

```
12 & 13 = 12
00001100 & 00001101 = 00001100
```

#### Bitwise OR
| V1  | V2  | Reults |
| --- | --- | ------ |
| 1   | 1   | 1      |
| 1   | 0   | 1      |
| 0   | 1   | 1      |
| 0   | 0   | 0      |

Example:

```
12 | 13 = 13
00001100 & 00001101 = 00001101
```

#### Bitwise XOR
| V1  | V2  | Reults |
| --- | --- | ------ |
| 1   | 1   | 0      |
| 1   | 0   | 1      |
| 0   | 1   | 1      |
| 0   | 0   | 0      |

Example:

```
12 ^ 13 = 1
00001100 ^ 00001101 = 00000001
```

#### Left Shift

Example:

```
10 << 2 = 40
00001010 << 2 = 00101000
```

#### Left Shift

Example:

```
10 >> 2 = 2
00000010 >> 2 = 2
```


### Bitwise Algorithms

#### Bit rotation 
Unlike shift operations where the left-most (left shift) or right-most (right shift) bits are lost, with a bit rotation a circular shift is applied so that the left-most bits became the right-most (left rotation) and vice versa (right rotation).

If `n` is the input sequence of bit and `d` is the number of bit to rotate:

```
Left Rotation(n,d) = n << d |  n >> (TOTAL_BYTES - d)
```

```
Right Rotation(n,d) =   n >>  d |  n << (TOTAL_BYTES - d)
```


## Assembly

### Registers

Useful resources: [http://www.eecg.toronto.edu/~amza/www.mindsec.com/files/x86regs.html](http://www.eecg.toronto.edu/~amza/www.mindsec.com/files/x86regs.html)

**General Registers:**

| x32 Register | x64 Register | Purpose                                                                                                                                                       |
| ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EAX          | RAX          | Accumulator. It’s also used for I/O port access, arithmetic operations, and interrupt calls.                                                                  |
| EBX          | RBX          | Base index. It’s used to get interrupt return values, but generally represents the base of the input you’re saving to memory.                                 |
| ECX          | RCX          | Counter. It’s used as a loop/string counter and to count shifts.                                                                                              |
| EDX          | RDX          | Extends the precision of the accumulator (also called the data register). EAX and EDX are often combined in 64-bit operations using 32-bit code.              |
| ESI          | RSI          | Source index for string operations. Essentially, this stores the start of the string that you’re saving to memory and is also used for string/memory copying. |
| EDI          | RDI          | Destination index for string operations. This is used for string and memory array copying.                                                                    |
| EBP          | RBP          | Base Pointer. The base pointer for the current stack frame.                                                                                                   |
| ESP          | RSP          | Stack Pointer. the top pointer of the current stack frame.                                                                                                    |
| EIP          | RIP          | Instruction Pointer. Pointer to the next instruction to be executed.                                                                                          |
|              | R8-R15       | General purpose registers.                                                                                                                                    |

**Segment Registers:**
The segment registers are used specifically for referencing memory locations. There are three different methods of accessing system memory of which we will focus on the flat memory model which is relevant for our purposes.

| Register | Purpose                                                                                            |
| -------- | -------------------------------------------------------------------------------------------------- |
| SS       | Holds the Stack segment the running program uses.                                                  |
| CS       | Holds the Code segment the program runs.                                                           |
| DS       | Holds the Data segment that the program accesses.                                                  |
| ES       | These are extra segment registers available for far pointer addressing like video memory and such. |
| FS       | These are extra segment registers available for far pointer addressing like video memory and such. |
| GS       | These are extra segment registers available for far pointer addressing like video memory and such. |

**EFLAGS register**
The EFLAGS register hold the state of the processor. It is modified by many intructions and is used for comparing some parameters, conditional loops and conditionnal jumps. Each bit holds the state of specific parameter of the last instruction.

Note: these flags are referred to 8086 microprocessor.

| Bit   | Label/Flag | Purpose                                                                                         |
| ----- | ---------- | ----------------------------------------------------------------------------------------------- |
| 0     | CF         | Carry Flag - Set when the result of an operation is too large for the destination operand       |
| 2     | PF         | Parity Flag - Indicates if the number of bits resulting from the last operation are even or odd |
| 4     | AZ         | Auxiliary Carry Flag                                                                            |
| 6     | ZF         | Zero Flag - Set when the result of an operation is equal to zero                                |
| 7     | SF         | Sign Flag - Set if the result of an operation is negative                                       |
| 8     | TF         | Trap Flag - Set if step by step debugging                                                       |
| 9     | IF         | Interrupt Enable Flag                                                                           |
| 10    | DF         | Direction Flag                                                                                  |
| 11    | OF         | Overflow Flag                                                                                   |
| 12-13 | IOPL       | I/O Priviledged Level                                                                           |
| 14    | NT         | Nested Task Flag                                                                                |
| 16    | RF         | Resume Flag                                                                                     |
| 17    | VM         | Virtual 8086 mode flag                                                                          |
| 18    | AC         | Alignment check flag (486+)                                                                     |
| 19    | VIF        | Virutal interrupt flag                                                                          |
| 20    | VIP        | Virtual interrupt pending flag                                                                  |
| 21    | ID         | ID flag                                                                                         |

### Common Assembly Instructions


| Instruction | Category               | Purpose                                                                          | Format                |
| ----------- | ---------------------- | -------------------------------------------------------------------------------- | --------------------- |
| mov         | Data Transfer          | Move data                                                                        | *mov dest, src*       |
| movzx       | Data Transfer          | Movx Move-Zero-Extendend - move source to destination and pad with 0 destination | *movzx dest, src*     |
| lea         | Data Transfer          | Load Effective Address                                                           | *lea dest, src*       |
| xchg        | Data Transfer          | Exchange - Swap destination and source values                                    | *xchg dest, src*      |
| call        | Control Flow           | Execute Function                                                                 | *call function*       |
| push        | Control Flow           | Push value to the stack - move `rsp`/`esp` backward                              | *push value*          |
| pop         | Control Flow           | Pop value off the stack into the specified register  - move `rsp`/`esp` forward  | *pop register*        |
| ret         | Control Flow           | Return from function                                                             | *ret*                 |
| jmp         | Control Flow           | Unconditional Jump                                                               | *jmp address*         |
| je          | Control Flow           | Jump if Equal - Jump to address if ZF = 1                                        | *je address*          |
| jnz         | Control Flow           | Jump if Not Zero - Jump to address if ZF = 0                                     | *jnz address*         |
| jnb         | Control Flow           | Jump if Not Below - Jump to address if CF = 0                                    | *jnb address*         |
| add         | Arithmetic Instruction | Add source to destination                                                        | *add dest, src*       |
| sub         | Arithmetic Instruction | Subtract source from destination                                                 | *sub dest, src*       |
| imul        | Arithmetic Instruction | Multiply source by a value and store the result into the destination             | *imul dest, src, val* |
| inc         | Arithmetic Instruction | Increment register by 1                                                          | *inc register*        |

\*Notes: 

- Each jump instruction is preceded by either a `test` or a `cmp` instructions. However, `jmp` is an unconditional jump and not preceded by anything `test` or `cmp`.
- `jz`/`jnz` and `je`/`jne` are equivalent but `jz`/`jnz` are more appropriate when you are explicitly testing for something being equal to zero; `je`/ `jne` are more appropriate after a `cmp` instruction:


### Calling Conventions and Registers Usage

`EAX`/`RAX` register is used by convention to hold the return value of a function call, if it exists and is no more than 64 bits long. 
Larger return types like structs are returned using the stack.

Generally, before any function call, the assembly prepares the parameters:

- In 32 bit programs, the stack is used to pass parameters to function by `push` instructions.
- In 64 bit programs, the "parameter preparation" is done with `mov` instructions to specific registers (following some "Calling Conventions") when the size of the parameter is not too big – For this reason, these calls are called **fastcalls**. Otherwise the stack is used by mean of `push` instructions.

In x64 architectures, `RDI`, `RSI`, `RDX`, `RCX`, `R8`, and `R9` are used to pass the first six integer or pointer parameters to called functions. Additional parameters or large parameters such as structs passed by value are passed on the stack.


### Misc Notes

- In x86 assembly language, "short" is used to indicate a short (relative) jump instruction. This instruction typically allows for a smaller jump range compared to the non-short version. It's used when the destination label is within a limited range from the current instruction.
- The "short" keyword is not a part of the condition evaluation. It just indicates the type of jump instruction to use.


## Reverse Engineering Utils

Extract data from binary:

```
binwalk -e binary // extract default known file types
binwalk --dd=".*" file_name // extract any file types or specified one
```

Emulate devices in user-space:

```
file firmware.bin // Check firmware architecture
cp $(which qemu-ARCH-static) ./to_emulate_root_dir
chroot ./to_emulate_root_dir ./qemu-ARCH-static command // run command in emulated environment
```
