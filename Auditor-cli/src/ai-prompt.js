// src/ai-prompt.js
// SERVER SIDE ONLY — never import this in client components.

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is missing. Add it in .env.local");
}

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

/**
 * Smart Contract Analysis (Gemini)
 */
const analyzeContract = async (contract) => {
  const prompt = `
Your role and goal is to be an AI Smart Contract Auditor. 
Your job is to perform an audit on the given smart contract.

Here is the smart contract:
${contract}

Please provide the results in the following array JSON format:

[
  {
    "section": "Audit Report",
    "details": "A detailed audit report of the smart contract."
  },
  {
    "section": "Metric Scores",
    "details": [
      { "metric": "Security", "score": 0-10 },
      { "metric": "Performance", "score": 0-10 },
      { "metric": "Other Key Areas", "score": 0-10 },
      { "metric": "Gas Efficiency", "score": 0-10 },
      { "metric": "Code Quality", "score": 0-10 },
      { "metric": "Documentation", "score": 0-10 }
    ]
  },
  {
    "section": "Suggestions for Improvement",
    "details": "Suggestions for improving the smart contract."
  }
]

Return ONLY this JSON array.
`;

  const res = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ Gemini Error (Analyze):", err);
    throw new Error("Gemini Request Failed");
  }

  const data = await res.json();

  let text =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("") || "";

  text = text.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```[a-zA-Z]*\s*/, "").replace(/```$/, "").trim();
  }

  const first = text.indexOf("[");
  const last = text.lastIndexOf("]");
  const clean = text.slice(first, last + 1);

  return JSON.parse(clean);
};

/**
 * Fix Smart Contract Issues
 */
const fixContractIssues = async (contract, suggestions) => {
  const prompt = `
Here is the smart contract with some issues:
${suggestions}

Please provide a FIXED version of this smart contract:

${contract}

Return ONLY the corrected Solidity code.
`;

  const res = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ Gemini Error (Fix Issues):", err);
    throw new Error("Gemini Request Failed");
  }

  const data = await res.json();

  let text =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("") || "";

  text = text.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```[a-zA-Z]*\s*/, "").replace(/```$/, "").trim();
  }

  return text;
};

module.exports = { analyzeContract, fixContractIssues };
