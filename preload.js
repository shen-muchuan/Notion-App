const { Titlebar, TitlebarColor } = require("custom-electron-titlebar");

const options = {
  backgroundColor: TitlebarColor.TRANSPARENT // 设置titlebar背景颜色为透明
};

window.addEventListener('DOMContentLoaded', () => {
  // Title bar implementation


  new Titlebar(options);
});
