import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { getAssetPath } from "./pathResolver.js";

export function createTray(mainWindow: BrowserWindow) {
  const tray = new Tray(path.join(getAssetPath(), "icon16.png"));
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show",
        click: () => mainWindow.show(),
      },
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ])
  );

  return tray;
}
