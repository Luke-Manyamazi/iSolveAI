const analyzeBtn = document.getElementById("analyzeBtn");
const resultDiv = document.getElementById("result");
const resultCard = document.getElementById("resultCard");
const copyBtn = document.getElementById("copyBtn");
const closeBtn = document.getElementById("closeBtn");
const errorTextArea = document.getElementById("errorText");

// Guard: if essential elements are missing, don't initialize handlers
if (!analyzeBtn || !resultDiv || !errorTextArea) {
  console.warn("popup.js: missing required DOM elements");
}

// Analyze Error Function
async function analyzeError(errorText) {
  resultDiv.textContent = "🔍 Analyzing error...";
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";
  resultCard.classList.remove("hidden");

  try {
    let explanation;

    // Try Chrome built-in AI first
    if (chrome.ai && chrome.ai.generate) {
      const response = await chrome.ai.generate({
        model: "writer",
        prompt: `You are an expert IT technician. Explain this error in simple terms and suggest step-by-step troubleshooting instructions:\n\n${errorText}`,
        max_tokens: 200,
      });
      explanation = response.output_text || "⚠️ No explanation generated.";
    } else {
      // Send to backend (Gemini API)
      const API_URL = "https://2v26rfw8ph.execute-api.eu-north-1.amazonaws.com/prod/analyze";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errorText }),
        // keep default credentials/mode; backend should handle CORS
      });

      if (!res.ok) {
        throw new Error(`Backend responded with ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      if (data && data.explanation) {
        explanation = data.explanation;
      } else if (data && data.error) {
        explanation = "⚠️ Error from backend: " +
          (typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      } else {
        explanation = "⚠️ No explanation generated.";
      }
    }

    resultDiv.textContent = explanation;
  } catch (error) {
    resultDiv.textContent = "❌ Error: " + error.message;
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "🔍 Analyze";
  }
}

// Analyze button click
analyzeBtn.addEventListener("click", () => {
  const errorText = errorTextArea.value.trim();
  if (!errorText) return alert("Please enter an error message.");
  analyzeError(errorText);
});

// Pressing Enter triggers Analyze (Shift+Enter adds newline)
errorTextArea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // prevent newline
    analyzeBtn.click(); // simulate button click
  }
});

// Copy button
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(resultDiv.textContent).then(() => {
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => (copyBtn.textContent = "📋 Copy"), 1500);
  });
});

// Close button
closeBtn.addEventListener("click", () => {
  window.close();
});

// Context menu support
chrome.runtime.onMessage.addListener((request) => {
  if (request.errorText) {
    errorTextArea.value = request.errorText;
    analyzeError(request.errorText);
  }
});
