const vscode = require("vscode");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

function getFormatterPath(context) {
  const config = vscode.workspace.getConfiguration("vesper");
  const customPath = config.get("formatterPath");

  return customPath && customPath.trim() !== ""
    ? customPath.trim()
    : path.join(context.extensionPath, "bin", "vspfmt.exe");
}

function getInterpreterPath(context) {
  const config = vscode.workspace.getConfiguration("vesper");
  const configuredPath = config.get("interpreterPath");

  if (configuredPath && configuredPath.trim() !== "") {
    return configuredPath.trim();
  }

  const candidates = [
    path.join(context.extensionPath, "bin", "vesper.exe"),
  ];

  for (const folder of vscode.workspace.workspaceFolders || []) {
    candidates.push(path.join(folder.uri.fsPath, "build", "vesper.exe"));
    candidates.push(path.join(folder.uri.fsPath, "vesper.exe"));
  }

  return candidates.find((candidate) => fs.existsSync(candidate));
}

function runDocument(context, document) {
  const interpreterPath = getInterpreterPath(context);

  if (!interpreterPath) {
    vscode.window.showErrorMessage(
      "Vesper interpreter not found. Set vesper.interpreterPath or build vesper.exe in your workspace.",
    );
    return;
  }

  if (document.isUntitled) {
    vscode.window.showInformationMessage(
      "Save the Vesper file before running it.",
    );
    return;
  }

  const terminal = vscode.window.createTerminal({
    name: "Vesper",
    cwd: path.dirname(document.uri.fsPath),
  });
  const quote = (value) => `"${value.replace(/"/g, '\\"')}"`;
  const command = process.platform === "win32"
    ? `& ${quote(interpreterPath)} ${quote(document.uri.fsPath)}`
    : `${quote(interpreterPath)} ${quote(document.uri.fsPath)}`;

  terminal.show(true);
  terminal.sendText(command);
}

function createCompletionProvider() {
  const keywords = [
    "let", "mut", "fn", "return", "if", "else", "while", "break",
    "import", "as", "export", "extern",
  ];
  const types = ["int", "float", "bool", "string", "void"];
  const builtins = ["print", "input"];

  return vscode.languages.registerCompletionItemProvider(
    "vesper",
    {
      provideCompletionItems(document) {
        const items = [];

        for (const keyword of keywords) {
          const item = new vscode.CompletionItem(
            keyword,
            vscode.CompletionItemKind.Keyword,
          );
          items.push(item);
        }

        for (const type of types) {
          const item = new vscode.CompletionItem(
            type,
            vscode.CompletionItemKind.TypeParameter,
          );
          items.push(item);
        }

        for (const builtin of builtins) {
          const item = new vscode.CompletionItem(
            builtin,
            vscode.CompletionItemKind.Function,
          );
          item.insertText = new vscode.SnippetString(`${builtin}($0)`);
          items.push(item);
        }

        const source = document.getText();
        const declarations = [
          ...source.matchAll(/\bfn\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g),
          ...source.matchAll(/\b(?:let|mut)\s+([A-Za-z_][A-Za-z0-9_]*)\b/g),
        ];

        for (const declaration of declarations) {
          const name = declaration[1];
          const isFunction = declaration[0].startsWith("fn");
          const item = new vscode.CompletionItem(
            name,
            isFunction
              ? vscode.CompletionItemKind.Function
              : vscode.CompletionItemKind.Variable,
          );
          if (isFunction) {
            item.insertText = new vscode.SnippetString(`${name}($0)`);
          }
          items.push(item);
        }

        return items;
      },
    },
    ".",
  );
}

function formatDocument(context, document) {
  const exePath = getFormatterPath(context);

  if (!fs.existsSync(exePath)) {
    vscode.window.showErrorMessage(
      `Vesper Formatter executable not found at: ${exePath}`,
    );
    return Promise.resolve([]);
  }

  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "vesper-"));
  const tempFile = path.join(tempDirectory, "document.vsp");

  fs.writeFileSync(tempFile, document.getText(), "utf8");

  return new Promise((resolve) => {
    execFile(exePath, [tempFile, "-w"], (error, stdout, stderr) => {
      try {
        if (error) {
          vscode.window.showErrorMessage(
            `Vesper Formatter Error: ${stderr || error.message}`,
          );
          resolve([]);
          return;
        }

        const formatted = fs.readFileSync(tempFile, "utf8");
        const fullDocument = new vscode.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length),
        );

        resolve([vscode.TextEdit.replace(fullDocument, formatted)]);
      } finally {
        fs.rmSync(tempDirectory, { recursive: true, force: true });
      }
    });
  });
}

function activate(context) {
  const provider = vscode.languages.registerDocumentFormattingEditProvider(
    "vesper",
    {
      async provideDocumentFormattingEdits(document) {
        return formatDocument(context, document);
      },
    },
  );

  const formatCommand = vscode.commands.registerCommand(
    "vesper.formatDocument",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor || editor.document.languageId !== "vesper") {
        vscode.window.showInformationMessage(
          "Open a Vesper document before formatting.",
        );
        return;
      }

      const edits = await formatDocument(context, editor.document);
      await editor.edit((editBuilder) => {
        for (const edit of edits) {
          editBuilder.replace(edit.range, edit.newText);
        }
      });
    },
  );

  const runCommand = vscode.commands.registerCommand(
    "vesper.runFile",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor || editor.document.languageId !== "vesper") {
        vscode.window.showInformationMessage(
          "Open a Vesper document before running it.",
        );
        return;
      }

      runDocument(context, editor.document);
    },
  );

  const completionProvider = createCompletionProvider();

  context.subscriptions.push(
    provider,
    formatCommand,
    runCommand,
    completionProvider,
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
