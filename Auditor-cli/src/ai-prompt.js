// src/ai-prompt.js
// Uses Gemini REST API directly with fetch (SDK not needed)

const analyzeContract = async (contract, apiKey) => {
  const prompt = `
Your role and goal is to be an AI Smart Contract Auditor. 
Your job is to perform an audit on the given smart contract.

Here is the smart contract:
${contract}

Please provide the results in the following array JSON format for easy front-end display:

[
  {
    "section": "Audit Report",
    "details": "A detailed audit report of the smart contract, covering security, performance, and any other relevant aspects."
  },
  {
    "section": "Metric Scores",
    "details": [
      {
        "metric": "Security",
        "score": 0-10
      },
      {
        "metric": "Performance",
        "score": 0-10
      },
      {
        "metric": "Other Key Areas",
        "score": 0-10
      },
      {
        "metric": "Gas Efficiency",
        "score": 0-10
      },
      {
        "metric": "Code Quality",
        "score": 0-10
      },
      {
        "metric": "Documentation",
        "score": 0-10
      }
    ]
  },
  {
    "section": "Suggestions for Improvement",
    "details": "Suggestions for improving the smart contract in terms of security, performance, and any other identified weaknesses."
  }
]

Return ONLY this JSON array, with no extra commentary or text.
`;

  // Gemini REST endpoint (latest stable model)
  const url =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent" +
    `?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  // -------- CALL GEMINI REST API --------
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("❌ Gemini API error:", res.status, errText);
    throw new Error(`Gemini API error ${res.status}`);
  }

  const data = await res.json();

  // Extract plain text from the model
  let text =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("") || "";

  // -------- CLEAN JSON (remove ```json codeblocks) --------
  let cleaned = text.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, ""); // remove ```json
    cleaned = cleaned.replace(/```$/, ""); // remove final ```
    cleaned = cleaned.trim();
  }

  // Extract the JSON array
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }

  let auditResults;
  try {
    auditResults = JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Failed to parse JSON from Gemini. Raw response:");
    console.error(text);
    throw err;
  }

  // -------- PRINT OUTPUT --------
  console.log("✅ Audit Report:");
  console.log(auditResults.find((r) => r.section === "Audit Report").details);

  console.log("\n📊 Metric Scores:");
  auditResults
    .find((r) => r.section === "Metric Scores")
    .details.forEach((metric) => {
      console.log(`${metric.metric}: ${metric.score}/10`);
    });

  console.log("\n💡 Suggestions for Improvement:");
  console.log(
    auditResults.find((r) => r.section === "Suggestions for Improvement")
      .details
  );
};

module.exports = { analyzeContract };
