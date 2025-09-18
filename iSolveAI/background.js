chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeError",
    title: "Analyze Error with iSolveAI",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyzeError") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (selectedText) => {
        chrome.runtime.sendMessage({ errorText: selectedText });
      },
      args: [info.selectionText],
    });
  }
});
