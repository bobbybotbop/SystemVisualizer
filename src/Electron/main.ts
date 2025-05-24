import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";

type test = string;

app.on("ready", () => {
  const mainWindow = new BrowserWindow({});
  //quick reloading if dev
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5101/");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});
