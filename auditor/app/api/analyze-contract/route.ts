import { NextResponse } from "next/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

const API_KEY = process.env.GEMINI_API_KEY;

function cleanJson(text: string) {
  let t = text.trim();

  if (t.startsWith("```")) {
    t = t.replace(/^```[a-zA-Z]*\s*/, "").replace(/```$/, "").trim();
  }

  const first = t.indexOf("[");
  const last = t.lastIndexOf("]");

  if (first === -1 || last === -1) {
    throw new Error("Gemini did not return JSON array. Raw text: " + t);
  }

  return t.slice(first, last + 1);
}

export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const { contract } = await req.json();

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

Return ONLY this JSON array, with no extra commentary or text.
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
      const errText = await res.text();
      return NextResponse.json(
        { error: "Gemini analyze error", detail: errText },
        { status: 500 }
      );
    }

    const data = await res.json();

    let text =
      data.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join("") || "";

    const cleaned = cleanJson(text);
    const auditResults = JSON.parse(cleaned);

    return NextResponse.json({ auditResults }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
