// Create context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeError",
    title: "Analyze Error with iSolveAI",
    contexts: ["selection"]
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyzeError") {
    // Send selected text to content script
    chrome.tabs.sendMessage(tab.id, { errorText: info.selectionText });
  }
});
