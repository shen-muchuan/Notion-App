/*const customTitleBarHTML = `
<div id="custom-titlebar" style="user-select: none; position: fixed; top: 0; left: 0; right: 0; height: 30px; display: flex; align-items: center; -webkit-app-region: drag; background-color: #333; color: white; z-index: 1000;">
  <div id="title" style="-webkit-app-region: no-drag; margin-left: 10px;">Notion</div>
  <div id="window-controls" style="margin-left: auto; margin-right: 10px; -webkit-app-region: no-drag;">
    <button id="min-button" style="background: none; border: none; color: white; font-size: 16px; margin-right: 5px;">_</button>
    <button id="max-button" style="background: none; border: none; color: white; font-size: 16px; margin-right: 5px;">[]</button>
    <button id="close-button" style="background: none; border: none; color: white; font-size: 16px;">X</button>
  </div>
</div>
<script>
  const { ipcRenderer } = require('electron');

  document.getElementById('min-button').addEventListener('click', () => {
    ipcRenderer.send('minimize-app');
  });

  document.getElementById('max-button').addEventListener('click', () => {
    ipcRenderer.send('maximize-app');
  });

  document.getElementById('close-button').addEventListener('click', () => {
    ipcRenderer.send('close-app');
  });
</script>
`;

document.body.insertAdjacentHTML('afterbegin', customTitleBarHTML);*/