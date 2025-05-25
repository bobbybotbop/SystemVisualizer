import osUtils from "os-utils";

const POLLING_INTERVAL = 500;

export function pollResources() {
  setInterval(() => {
    getCpuUsage();
  }, POLLING_INTERVAL);
}
function getCpuUsage() {
  osUtils.cpuUsage((percent) => console.log(percent));
}
