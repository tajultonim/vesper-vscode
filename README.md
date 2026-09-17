# Vesper Language Support

> 🔴 Please make sure to read [this](#formatting-setup) step for setup. 

An official Visual Studio Code extension providing syntax highlighting, language configuration, and code formatting for the **Vesper** programming language (`.vsp`).

---

## Features

- 🎨 **Syntax Highlighting:** Full colorizing support for keywords, control flow, functions, comments, numbers, and string literals.
- ✨ **Autocomplete:** Suggestions for Vesper keywords, types, builtins, local variables, and functions.
- ⚡ **Integrated Formatter:** Automatically formats your `.vsp` source code on save or via command palette using `vspfmt.exe`.
- ▶️ **Run Button:** Run the active Vesper file from the editor title bar or the command palette.
- 📁 **File Association:** Native recognition for `.vsp` files with a custom vector file icon.
- 🛠️ **Language Configuration:** Automatic bracket closing, quote pairing, and block/line comment toggles (`Ctrl + /`).

---

## Installation

### From VS Code Marketplace

1. Open **VS Code**.
2. Press `Ctrl + P` (or `Cmd + P` on macOS) and type:

   ```text
   ext install tajultonim.vesper-vscode
   ```

### Formatting Setup

This extension includes a built-in formatting provider powered by vspfmt.exe.

1. Enable Format on Save
   To automatically format your code when saving a .vsp file, add the following to your VS Code settings.json:

```JSON
"[vesper]": {
"editor.defaultFormatter": "tajultonim.vesper-vscode",
"editor.formatOnSave": true
}
```

2. **Formatter Executable Location**
The formatter binary is not shipped with the extension. The extension checks your workspace build directory and then `PATH` for `vspfmt`. You can also download a release binary or build one following the instructions [here](https://github.com/tajultonim/vesper#-building), then specify its path:

```JSON
{
"vesper.formatterPath": "C:/path/to/your/vspfmt.exe"
}
```

3. Interpreter Location (Optional)
   The Run button selects the interpreter in this order:

   1. `vesper.interpreterPath`, when configured.
   2. `bin/vesper.exe` inside the extension, if present.
   3. `build/vesper.exe` in an open workspace.
   4. `vesper.exe` in the workspace root.
   5. The `vesper` command from `PATH`.

   To use another interpreter, configure:

```JSON
{
   "vesper.interpreterPath": "C:/path/to/vesper.exe"
}
```

### Syntax Overview

Vesper uses typed declarations, functions, imports, and expression-based control flow:

```vsp
let x: int = 10;
mut total: int = 0;

if (x > 0) {
   print("Positive\n");
} else {
   print("Non-positive\n");
}

fn add(a: int, b: int): int {
   return a + b;
}

import "math" as m;
let answer = m.factorial(5);
print(answer);
```

The formatter understands imports, arrays, indexing, member calls, comments,
`export` and `extern` functions, and `void` return types.

### Extension Settings

This extension offers the following setting:

- `vesper.formatterPath`: Specify a custom path to the vspfmt.exe executable file.
- `vesper.interpreterPath`: Specify a custom path to the Vesper interpreter used by the Run button.

### License

This extension is licensed under the GPL 3 License.
