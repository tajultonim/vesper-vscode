const vscode = require("vscode");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

function activate(context) {
  const provider = vscode.languages.registerDocumentFormattingEditProvider(
    "vesper",
    {
      async provideDocumentFormattingEdits(document) {
        const config = vscode.workspace.getConfiguration("vesper");
        const customPath = config.get("formatterPath");

        // 1. Determine executable path (Custom setting OR default inside bin/)
        let exePath =
          customPath && customPath.trim() !== ""
            ? customPath.trim()
            : path.join(context.extensionPath, "bin", "vspfmt.exe");

        // 2. Check if the binary exists
        if (!fs.existsSync(exePath)) {
          vscode.window.showErrorMessage(
            `Vesper Formatter executable not found at: ${exePath}`,
          );
          return [];
        }

        // 3. Ensure document is saved so the file on disk is fresh
        if (document.isDirty) {
          await document.save();
        }

        const filePath = document.fileName;

        // 4. Run: vspfmt.exe <filename.vsp> -w
        return new Promise((resolve) => {
          execFile(exePath, [filePath, "-w"], (error, stdout, stderr) => {
            if (error) {
              vscode.window.showErrorMessage(
                `Vesper Formatter Error: ${stderr || error.message}`,
              );
            }
            // Since '-w' writes directly to disk, returning [] lets VS Code refresh the file
            resolve([]);
          });
        });
      },
    },
  );

  context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
