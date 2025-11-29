// utils/ai-promt.ts
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

const cleanJson = (text: string) => {
  let t = text.trim();

  // strip ```json ... ```
  if (t.startsWith("```")) {
    t = t.replace(/^```[a-zA-Z]*\s*/, "").replace(/```$/, "").trim();
  }

  // grab between first [ and last ]
  const first = t.indexOf("[");
  const last = t.lastIndexOf("]");

  if (first === -1 || last === -1) {
    throw new Error("Gemini did not return JSON array. Raw text: " + t);
  }

  return t.slice(first, last + 1);
};

export const analyzeContract = async (
  contract: string,
  setResults: any,
  setLoading: any
) => {
  setLoading(true);

  const prompt = `Your role and goal is to be an AI Smart Contract Auditor. Your job is to perform an audit on the given smart contract. Here is the smart contract: ${contract}.

Please provide the results in the following array JSON format for easy front-end display:

[
  {
    "section": "Audit Report",
    "details": "A detailed audit report of the smart contract, covering security, performance, and any other relevant aspects."
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
    "details": "Suggestions for improving the smart contract in terms of security, performance, and any other identified weaknesses."
  }
]

Return ONLY this JSON array.`;

  try {
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

    const data = await res.json();
    console.log("RAW GEMINI DATA:", data);

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join("") || "";

    console.log("RAW GEMINI TEXT:", text);

    const cleaned = cleanJson(text);
    const auditResults = JSON.parse(cleaned);

    setResults(auditResults);
  } catch (err) {
    console.error("analyzeContract error:", err);
    setResults(null);
  } finally {
    setLoading(false);
  }
};

export const fixIssues = async (
  contract: string,
  suggestions: string,
  setContract: (contract: string) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);

  const prompt = `Here is the smart contract with the following issues: ${suggestions}.
Please provide a fixed version of the contract:

${contract}

Return ONLY the corrected Solidity code.`;

  try {
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

    const data = await res.json();
    let text =
      data.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join("") || "";

    text = text.trim();
    if (text.startsWith("```")) {
      text = text.replace(/^```[a-zA-Z]*\s*/, "").replace(/```$/, "").trim();
    }

    setContract(text);
  } catch (err) {
    console.error("fixIssues error:", err);
  } finally {
    setLoading(false);
  }
};
