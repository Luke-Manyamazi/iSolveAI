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
document.body.appendChild(tooltip);

chrome.runtime.onMessage.addListener(async (request) => {
  if (!request.errorText) return;

  tooltip.textContent = "Analyzing...";
  tooltip.style.display = "block";

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0).getBoundingClientRect();
    tooltip.style.top = `${range.bottom + window.scrollY + 5}px`;
    tooltip.style.left = `${range.left + window.scrollX}px`;
  }

  let explanation = "No explanation available.";
  try {
    if (chrome.ai && chrome.ai.generate) {
      const response = await chrome.ai.generate({
        model: "writer",
        prompt: `You are an expert IT technician. Explain this error and suggest troubleshooting steps:\n${request.errorText}`,
        max_tokens: 200,
      });
      explanation = response.output_text || explanation;
    } else {
      const res = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorText: request.errorText }),
      });
      const data = await res.json();
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        explanation = data.choices[0].message.content;
      } else if (data.error) {
        explanation = "Error from backend: " + data.error;
      }
    }
  } catch (err) {
    explanation = "Error: " + err.message;
  }

  tooltip.textContent = explanation;

  document.addEventListener(
    "click",
    () => {
      tooltip.style.display = "none";
    },
    { once: true }
  );
});
