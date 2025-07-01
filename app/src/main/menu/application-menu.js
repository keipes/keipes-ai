const { Menu, dialog, app } = require("electron");
const { getMainWindow } = require("../windows/main-window");

function createApplicationMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            const mainWindow = getMainWindow();
            if (mainWindow) {
              mainWindow.webContents.send("menu-new");
            }
          },
        },
        {
          label: "Open",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const mainWindow = getMainWindow();
            if (!mainWindow) return;
            
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ["openFile"],
              filters: [
                { name: "Text Files", extensions: ["txt", "md"] },
                { name: "All Files", extensions: ["*"] },
              ],
            });

            if (!result.canceled) {
              mainWindow.webContents.send("menu-open", result.filePaths[0]);
            }
          },
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectall" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "AI",
      submenu: [
        {
          label: "Generate Image",
          accelerator: "CmdOrCtrl+I",
          click: () => {
            const mainWindow = getMainWindow();
            if (mainWindow) {
              mainWindow.webContents.send("menu-generate-image");
            }
          },
        },
        {
          label: "Chat",
          accelerator: "CmdOrCtrl+T",
          click: () => {
            const mainWindow = getMainWindow();
            if (mainWindow) {
              mainWindow.webContents.send("menu-chat");
            }
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => {
            const mainWindow = getMainWindow();
            if (mainWindow) {
              dialog.showMessageBox(mainWindow, {
                type: "info",
                title: "About Keipes AI",
                message: "Keipes AI Desktop Application",
                detail: "A powerful AI assistant built with Electron",
              });
            }
          },
        },
      ],
    },
  ];

  // macOS specific menu adjustments
  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services", submenu: [] },
        { type: "separator" },
        { role: "hide" },
        { role: "hideothers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    });

    // Window menu
    template[4].submenu = [
      { role: "close" },
      { role: "minimize" },
      { role: "zoom" },
      { type: "separator" },
      { role: "front" },
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = {
  createApplicationMenu
};
