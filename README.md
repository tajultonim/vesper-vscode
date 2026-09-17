# Vesper Language Support

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

This extension includes a built-in formatting provider powered by `vspfmt.exe`.
Formatting uses the current editor content, so unsaved changes are supported.

1. Enable Format on Save
   To automatically format your code when saving a .vsp file, add the following to your VS Code settings.json:

```JSON
"[vesper]": {
"editor.defaultFormatter": "tajultonim.vesper-vscode",
"editor.formatOnSave": true
}
```

2. Custom Formatter Executable Location (Optional)
   By default, the extension uses the bundled executable located inside the extension directory. If you have compiled a custom version of vspfmt.exe, specify its file path in your settings:

```JSON
{
"vesper.formatterPath": "C:/path/to/your/vspfmt.exe"
}
```

3. Interpreter Location (Optional)
    The extension looks for `vesper.exe` in the workspace `build` directory. To use another interpreter, configure:

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
