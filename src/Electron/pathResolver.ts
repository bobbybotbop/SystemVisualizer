import path from "path";
import { app } from "electron";
import { isDev } from "./util.js";

export function getPreloadPath() {
  //the file path would be outside of the packaged scripts this file is contained in
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "dist-electron/preload.cjs"
  );
}

export function getUIPath() {
  return path.join(app.getAppPath(), "/dist-react/index.html");
}

export function getAssetPath() {
  //the file path would be outside of the packaged scripts this file is contained in
  return path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets");
}
