import { NextResponse } from "next/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const { contract, suggestions } = await req.json();

    const prompt = `Here is the smart contract with the following issues: ${suggestions}.
Please provide a fixed version of the contract:

${contract}

Return ONLY the corrected Solidity code.`;

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
        { error: "Gemini fix-issues error", detail: errText },
        { status: 500 }
      );
    }

    const data = await res.json();

    let text =
      data.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text || "")
        .join("") || "";

    text = text.trim();
    if (text.startsWith("```")) {
      text = text.replace(/^```[a-zA-Z]*\s*/, "").replace(/```$/, "").trim();
    }

    return NextResponse.json({ fixedContract: text }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
