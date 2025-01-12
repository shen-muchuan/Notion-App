const sidebarInitObserver = new MutationObserver((mutationsList, observer) => {
    const targetElement = document.querySelector(".notion-sidebar");
    if (targetElement) {
      observer.disconnect();
      const expandedObserver = new MutationObserver(expandedObserverCallback);
      expandedObserver.observe(targetElement, {
        subtree: true,
        childList: true,
        attributes: false,
      });
    }
  });
  
  let previousExpanded = null;
  
  function expandedObserverCallback(mutationsList, observer) {
    const targetElement = document.querySelector(".notion-sidebar");
    const sidebarData = JSON.parse(
      localStorage.getItem("LRU:KeyValueStore2:sidebar")
    );
    const expanded = sidebarData["value"]["expanded"];
    if (expanded !== previousExpanded) {
      targetElement.style.display = expanded ? "block" : "none";
    }
  }
  
  sidebarInitObserver.observe(document.body, { subtree: true, childList: true });