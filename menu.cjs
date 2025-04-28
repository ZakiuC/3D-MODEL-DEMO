const createMenu = require("./createMenu.cjs");
const roles = {
    show(item, menuItem){
        const win = nw.Window.get();
        if(menuItem.label === "显示")
        {
            win.show(),
            menuItem.label = "隐藏";
            process.emit("show");
        } else {
            win.hide();
            menuItem.label = "显示";
            process.emit("hide");
        }
    },
    setVolume: (item) => process.emit("setVolume", item.value),
    quit: () => nw.App.quit(),
};
const contextmenu = createMenu(
    [
        { id: "show", label: "隐藏", role: "show" },
        { type: "separator" },
        {
            label: "音量",
            submenu: [
                { label: "静音", type: "radio", value: 0, role: "setVolume" },
                { label: "10%", type: "radio", value: 0.1, role: "setVolume" },
                { label: "30%", type: "radio", value: 0.3, role: "setVolume" },
                { label: "50%", type: "radio", value: 0.5, role: "setVolume" },
                { label: "100%", type: "radio", value: 1, checked: true, role: "setVolume" },
            ]
        },
        { type: "separator" },
        { label: "退出", role: "quit" }
    ],
    { type: "contextmenu", roles }
)

module.exports = contextmenu;