nw.Window.open("index.html", {
    width: 500,
    height: 400,
    resizable: false,
    frame: false,
    transparent: true,
    always_on_top: true,
    show_in_taskbar: false,
});

// 托盘图标
const contextmenu = require("./menu.cjs");
const tray = new nw.Tray({
    icon: "./assets/icon.png",
    tooltip: "是亚托克斯哦！",
    menu: contextmenu,
});
tray.on("click", () => {
    contextmenu.itemsMap["show"].click();
});