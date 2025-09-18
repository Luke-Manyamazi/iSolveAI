import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// POST route to analyze errors
app.post("/analyze", async (req, res) => {
  const { errorText } = req.body;
  if (!errorText) {
    return res.status(400).json({ error: "No error text provided" });
  }

  try {
    // Call Gemini API
    const response = await fetch(
      // eslint-disable-next-line no-undef
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are an expert IT technician. Explain this error in simple terms and provide troubleshooting steps:\n\n${errorText}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const explanation = data.candidates[0].content.parts[0].text;
      res.json({ explanation });
    } else {
      res
        .status(500)
        .json({ error: data.error || "No explanation generated." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("✅ Backend running on http://localhost:3000")
);
