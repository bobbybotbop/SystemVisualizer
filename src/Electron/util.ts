import { ipcMain, WebContents, WebFrameMain } from "electron";
import { pathToFileURL } from "url";
import { getUIPath } from "./pathResolver.js";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event) => {
    if (!event.senderFrame) throw new Error("No sender frame");
    validateEventFrame(event.senderFrame);
    return handler();
  });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webcontents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webcontents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  console.log(frame.url);
  if (isDev() && new URL(frame.url).host === "localhost:5101") {
    return;
  }
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("malicious event!!! please dont do that");
  }
}
