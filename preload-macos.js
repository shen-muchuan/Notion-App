/*window.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations, obs) => {
        const topbar = document.querySelector('.notion-topbar-action-buttons');
        if (topbar) {
            // 创建新的 div 元素作为 TOC 按钮的容器
            const tocButton = document.createElement('div');
            tocButton.className = 'toc-button';

            // 创建下拉选择菜单
            const tocSelect = document.createElement('select');
            tocSelect.className = 'notion-ai-button';

            // 将select元素添加到新的 div 中
            tocButton.appendChild(tocSelect);

            // 将新的 div 添加到顶部工具栏按钮组的开头
            topbar.prepend(tocButton);

            // 添加点击事件监听器到 select 元素
            // 使用事件捕获而不是冒泡来避免下拉菜单立即关闭
            tocSelect.addEventListener('click', (event) => {
                // 确保下拉列表在被填充前是空的
                tocSelect.innerHTML = '';

                // 填充下拉列表
                document.querySelectorAll('h1, h2, h3, h4').forEach(header => {
                    const option = new Option(header.textContent, header.offsetTop);
                    tocSelect.add(option);
                });

                // 阻止事件进一步传播
                event.stopPropagation();
            }, true); // true 表示事件处理器在捕获阶段执行

            // 停止观察
            obs.disconnect();
        }
    });

    // 配置观察器选项
    const config = { childList: true, subtree: true };

    // 选择目标节点
    const targetNode = document.body;

    // 开始观察目标节点
    observer.observe(targetNode, config);
});*/
