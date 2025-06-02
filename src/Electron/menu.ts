import { app, Menu } from "electron";

export function createMenu() {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ])
  );
}
