import three from "./three.js";
import voice from "./voice.js";

// 移动窗口到右下角显示
const win = nw.Window.get();
const x = screen.availWidth - win.width;
const y = screen.availHeight - win.height;
win.moveTo(x, y);

// 窗口拖动
let pos = { x: 0, y: 0 };
document.addEventListener("mousedown", onMouseDown);

function onMouseDown(e) {
    pos = { x: e.clientX, y: e.clientY };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e) {
    win.moveTo(e.screenX - pos.x, e.screenY - pos.y);
}

function onMouseUp(e) {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}

// 右键菜单
const contextmenu = require("./menu.cjs");
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    contextmenu.popup(e.screenX, e.screenY);
})

process.on("setVolume", (value) => voice.audio.setVolume(value));
process.on("hide", () => {
    three.stopRender();
    voice.audio.stop();
});
process.on("show", () => {
    three.render();
    voice.randomVoice();
});