# iSolveAI

![iSolveAI](https://img.shields.io/badge/iSolveAI-IT%20Support%20Assistant-blue)

iSolveAI is a Chrome Extension that helps IT technicians quickly troubleshoot error messages and system issues. Powered by **Google Gemini API** or a backend AI fallback, it provides clear explanations and step-by-step troubleshooting instructions instantly.

---

## 🚀 Features

- Analyze error messages from Windows, macOS, Linux, and web apps.
- Provides simple explanations and expert troubleshooting steps.
- Copy analysis results to clipboard.
- Clean, modern popup UI with close button and scrollable result card.
- Works with Chrome built-in AI (if available) or a backend API.
- Context menu support for right-click analysis.
- Press Enter to analyze, Shift+Enter adds newline.

---

## 💡 Inspiration

As a second-year Software Engineering student and IT Support Technician, I wanted a tool that could quickly summarize complex error messages without searching multiple forums, logs, or documentation. iSolveAI saves time and reduces frustration when diagnosing technical issues.

---

## 📦 Project Structure

iSolveAI/
├── backend/ # Node.js server using Gemini/OpenAI API
├── popup.html # Extension popup
├── popup.js # Extension frontend logic
├── popup.css # Extension styling
├── manifest.json # Chrome extension manifest
├── .env # API keys (not committed)
└── README.md # Project documentation

yaml
Copy code

---

## ⚙️ Installation & Setup

### Frontend (Chrome Extension)
1. Clone the repository:
```bash
git clone https://github.com/yourusername/iSolveAI.git
Open Chrome and go to chrome://extensions/.

Enable Developer mode.

Click Load unpacked and select the iSolveAI folder.

Backend (Node.js)
Navigate to the backend folder:

bash
Copy code
cd iSolveAI/backend
Install dependencies:

bash
Copy code
npm install
Create a .env file:

ini
Copy code
OPENAI_API_KEY=your_api_key_here
Start the backend server:

bash
Copy code
node index.js
Ensure the URL in popup.js matches your backend (http://localhost:3000/analyze).
```
## 🛠 How It Works
User types or selects an error message.

Clicks Analyze (or presses Enter).

The extension sends the error to Gemini API (or backend fallback).

AI returns a clear explanation + step-by-step troubleshooting.

Result is displayed in a styled card in the popup.

## 🎨 UI Features
Modern popup with header and close button.

Result card with scrollable, readable output.

Copy to clipboard button.

Enter key triggers analysis (Shift+Enter for new line).

## ⚡ Future Improvements
Dark mode toggle.

Categorize errors by system type (Windows, Linux, Web).

Rate limiting / caching repeated analyses.

Deploy backend to a free cloud service (Vercel, Render, Railway).

Add more AI models for advanced troubleshooting.

## 📜 License
This project is open source under the MIT License.

## 👨‍💻 Author
Luke Manyamazi
IT Support Technician | Software Engineering Student
GitHub | Portfolio
