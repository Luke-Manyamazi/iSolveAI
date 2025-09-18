// Create tooltip
const tooltip = document.createElement("div");
tooltip.id = "iSolveAITooltip";
tooltip.style.position = "absolute";
tooltip.style.background = "#1f2937";
tooltip.style.color = "#f9fafb";
tooltip.style.padding = "10px";
tooltip.style.borderRadius = "8px";
tooltip.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
tooltip.style.maxWidth = "300px";
tooltip.style.zIndex = "9999";
tooltip.style.display = "none";
tooltip.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
tooltip.style.fontSize = "14px";
tooltip.style.lineHeight = "1.4";
tooltip.style.transition = "opacity 0.2s ease";
tooltip.style.opacity = "0";
document.body.appendChild(tooltip);

// Receive selected text from background
chrome.runtime.onMessage.addListener(async (request) => {
  if (!request.errorText) return;

  tooltip.textContent = "Analyzing...";
  tooltip.style.display = "block";
  tooltip.style.opacity = "1";

  // Position tooltip
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0).getBoundingClientRect();
    let top = range.bottom + window.scrollY + 5;
    let left = range.left + window.scrollX;

    if (left + 300 > window.innerWidth) left = window.innerWidth - 310;
    if (top + 150 > window.innerHeight + window.scrollY)
      top = range.top + window.scrollY - 160;

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  let explanation = "No explanation available.";
  try {
    // Call backend
    const API_URL = "https://2v26rfw8ph.execute-api.eu-north-1.amazonaws.com/prod/analyze";

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ errorText })
    });
    const data = await res.json();

    if (data.explanation) {
      explanation = data.explanation;
    } else if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      explanation = data.choices[0].message.content;
    } else if (data.error) {
      explanation =
        "Error from backend: " + (data.error.message || JSON.stringify(data.error));
    }
  } catch (err) {
    explanation = "Error: " + err.message;
  }

  tooltip.textContent = explanation;

  // Close tooltip on click outside
  const hideTooltip = () => {
    tooltip.style.opacity = "0";
    setTimeout(() => (tooltip.style.display = "none"), 200);
    document.removeEventListener("click", hideTooltip);
  };
  setTimeout(() => document.addEventListener("click", hideTooltip), 50);
});
