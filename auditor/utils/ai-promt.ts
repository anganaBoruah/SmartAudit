// FRONTEND ONLY – calls your own API, never Gemini directly.

export const analyzeContract = async (
  contract: string,
  setResults: (r: any | null) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);

  try {
    const res = await fetch("/api/analyze-contract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contract }),
    });

    const data = await res.json();

    if (!res.ok) {
      setResults(null);
      return;
    }

    setResults(data.auditResults);
  } catch {
    setResults(null);
  } finally {
    setLoading(false);
  }
};

export const fixIssues = async (
  contract: string,
  suggestions: string,
  setContract: (c: string) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);

  try {
    const res = await fetch("/api/fix-issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contract, suggestions }),
    });

    const data = await res.json();

    if (!res.ok) {
      return;
    }

    setContract(data.fixedContract);
  } catch {
    // ignore for now
  } finally {
    setLoading(false);
  }
};
