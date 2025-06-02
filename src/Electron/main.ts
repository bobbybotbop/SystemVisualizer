import { app, BrowserWindow, ipcMain, Tray, Event } from "electron";
import path from "path";
import { isDev, ipcMainHandle } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadPath, getUIPath, getAssetPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      //path to a file
      preload: getPreloadPath(),
    },
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#2f3241",
      symbolColor: "#74b1be",
    },
  });

  //quick reloading if dev
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5101/");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });

  //handle tray
  let tray: Tray = createTray(mainWindow);
  handleCloseEvents(mainWindow);
  // Add click handler to show/hide window
  tray.on("click", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  //handle menu
  createMenu();
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let isQuitting = false;
  mainWindow.on("close", (e: Event) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  //a true quit runs a "before-quit" before finishing
  app.on("before-quit", () => {
    isQuitting = true;
  });
}
