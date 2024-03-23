const { contextBridge, ipcRenderer } = require('electron');

// 在全局范围内暴露窗口控制方法
contextBridge.exposeInMainWorld('electronWindowControl', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
});

// 等待文档加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 创建控制按钮的容器
  const controlContainer = document.createElement('div');
  controlContainer.style.position = 'fixed';
  controlContainer.style.top = '0';
  controlContainer.style.right = '0';
  controlContainer.style.display = 'flex';
  controlContainer.style.zIndex = '1000'; // 确保按钮位于顶层

  // 创建最小化按钮
  const minimizeButton = document.createElement('button');
  minimizeButton.innerText = '-';
  minimizeButton.onclick = () => window.electronWindowControl.minimize();
  
  // 创建最大化按钮
  const maximizeButton = document.createElement('button');
  maximizeButton.innerText = '[]';
  maximizeButton.onclick = () => window.electronWindowControl.maximize();
  
  // 创建关闭按钮
  const closeButton = document.createElement('button');
  closeButton.innerText = 'X';
  closeButton.onclick = () => window.electronWindowControl.close();

  // 将按钮添加到容器中
  controlContainer.appendChild(minimizeButton);
  controlContainer.appendChild(maximizeButton);
  controlContainer.appendChild(closeButton);

  // 将容器添加到文档中
  document.body.appendChild(controlContainer);
});
