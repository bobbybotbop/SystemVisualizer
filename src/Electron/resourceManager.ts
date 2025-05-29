import osUtils from "os-utils";
import os from "os";
import fs from "fs";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "./util.js";

const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();

    ipcWebContentsSend("statistics", mainWindow.webContents, {
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage,
    });
  }, POLLING_INTERVAL);
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  //total mems is in mb
  const totalMemGB = Math.floor(osUtils.totalmem() / 1024);

  return {
    totalStorage,
    cpuModel,
    totalMemGB,
  };
}

function getCpuUsage(): Promise<number> {
  return new Promise((percent) => osUtils.cpuUsage(percent));
}

//.osUtils.freemempercentage() is a sychronious function so you dont need a promise
function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  //gives synchronous data so we dont need a promise
  const s = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const tot = s.bsize * s.blocks;
  const free = s.bsize * s.bfree;

  return {
    total: Math.floor(tot / 1_000_000_000),
    usage: 1 - free / tot,
  };
}
