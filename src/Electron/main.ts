import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { pollResources } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";

type test = string;

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
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  pollResources();
});
