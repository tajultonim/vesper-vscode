# Vesper Language Support

> 🔴 Please make sure to read [this](#formatting-setup) step for setup. 

An official Visual Studio Code extension providing syntax highlighting, language configuration, and code formatting for the **Vesper** programming language (`.vsp`).

---

## Features

- 🎨 **Syntax Highlighting:** Full colorizing support for keywords, control flow, functions, comments, numbers, and string literals.
- ⚡ **Integrated Formatter:** Automatically formats your `.vsp` source code on save or via command palette using `vspfmt.exe`.
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

This extension does not include a built-in formatting provider. **Step 2 here is necessary for it to work**.

1. Enable Format on Save
   To automatically format your code when saving a .vsp file, add the following to your VS Code settings.json:

```JSON
"[vesper]": {
"editor.defaultFormatter": "tajultonim.vesper-vscode",
"editor.formatOnSave": true
}
```

2. **Formatter Executable Location** (🔴 Required) 
Due to some issues the binary file for the formatter is not shipped with the extension. Please find a file from the [release](https://github.com/tajultonim/vesper/releases/latest) section of **Vesper** or build your own `vspfmt.exe` following the instructions [here](https://github.com/tajultonim/vesper#-building) and specify its file path in your settings:

```JSON
{
"vesper.formatterPath": "C:/path/to/your/vspfmt.exe"
}
```

### Syntax Overview

Vesper is a C-inspired language built for modern clarity:

```vsp
// Variable declaration & control flow
var x: int = 10;

if (x > 0) {
printf("Positive\n");
} else {
printf("Non-positive\n");
}

// Single-line conditional
if (x % 2 == 0) printf("Even\n");

// Functions
fn add(a: int, b: int) -> int {
return a + b;
}
```

### Extension Settings

This extension offers the following setting:

- `vesper.formatterPath`: Specify a custom path to the vspfmt.exe executable file.

### License

This extension is licensed under the GPL 3 License.
