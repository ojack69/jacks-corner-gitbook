Title: IDA Cheatsheet
Slug: reversing/ida-cheatsheet
Date: 1957-01-01 00:00
Category: Cheatsheet

| **Shortcut**     | **Description**                                           |
| ---------------- | --------------------------------------------------------- |
|                  |                                                           |
| **Navigating**   |                                                           |
| space            | Toggle between graph view and linear view                 |
| enter (or click) | Enter a function                                          |
| esc              | Return from function, or, back back in navigation history |
| ctrl + enter     | Go forwards in navigation history                         |
| x                | Find x-reference                                          |
| shift + f12      | Open string window                                        |
| g                | Go to address                                             |
| 1                | Restore zooming (in graph view)                           |
|                  |                                                           |
| **Exploring**    |                                                           |
| a                | Convert to string                                         |
| u                | Undefine data                                             |
| d                | Group bytes to word to dword to qword                     |
| h                | Convert to hex                                            |
| b                | Convert to binary                                         |
| r                | Convert to character                                      |
| c                | Convert to code                                           |
| p                | Make function                                             |
| ins              | Create struct in structures view                          |
| d                | Add Field to struct in structures view                    |
| t                | Use struct in linear or graph view                        |
| y                | Use struct in decompiler view                             |
|                  |                                                           |
| **Commenting**   |                                                           |
| n                | Rename label/function                                     |
| y                | Re-type variable in pseudocode view                       |
| ins              | Insert anterior comment                                   |
| shift + ins      | Insert posterior comment                                  |
| :                | Insert inline comment                                     |
| ;                | Insert repeatable comment                                 |
|                  |                                                           |
| **Searching**    |                                                           |
| alt+b            | Byte search or “string” search                            |
| alt+t            | Text search                                               |
| alt+i            | Operand search                                            |
|                  |                                                           |
| **Debugging**    |                                                           |
| F2               | Set and Unset Breakpoint                                  |
| F9               | Run                                                       |
| F8               | Step Over an Instruction/Function                         |
| F7               | Step Into a Function                                      |
| ctrl + F7        | Run until Return                                          |
|                  |                                                           |
| Decompiling      |                                                           |
| F5               | Decompile to C source code                                |

Based on the template provided by [https://crackinglessons.com](https://crackinglessons.com/)

Other available actions:

- In graph view:
	- **Green Arrows**: indicates the code flow after a jump condition when ZF=1 
	- **RedArrows**: indicates the code flow after a jump condition when ZF
	- **Blue arrow**: indicates the code flow after an unconditional jmp instruction
- To view opcodes (hex bytes): 
	- Options > General > Number of opcodes bytes (non-graph) - generally set to 6 or 8
- Patch program: 
	- select line > Edit > Patch Program > Assemble Instruction
- Make permanents the patching: 
	- Edit > Patch Program > Apply Patches to input file
- Double click on a register to tamper its value
- Replace instruction: 
	- select line > Edit > Patch Program > Change byte (show opcodes to see what to replace)
- Sync pseudocode view with assembly linear or graph view (when side-docked): 
	- right click > Syncronize With