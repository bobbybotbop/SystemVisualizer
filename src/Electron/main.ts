import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev, ipcMainHandle } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      //path to a file
      preload: getPreloadPath(),
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
});
