"use client";

import { useState } from "react";
import Header from "@/components/header";
import ContractInput from "@/components/contactInput";
import ResultsModal from "@/components/results-modal";
import Navbar from "@/components/navbar"; // ⬅️ import your Navbar
import { analyzeContract } from "@/utils/ai-promt";
import { FooterCentered } from "@/components/ui/FooterCentered";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const analyze = async () => {
    setIsModalOpen(true);
    await analyzeContract(contract, setResults, setLoading);
  };

  const fixIssues = async () => {
    // const suggestions = results.find(
    //   (r) => r.section === "Suggestions for Improvement"
    // ).details;
    // await fixIssues(contract, suggestions, setContract, setLoading);
  };

 return (
    <div className="relative min-h-screen w-full bg-black">
      {/* 🔹 Navbar fixed at the top, always above the wave */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center">
        <div className="max-w-5xl w-full px-4 flex justify-center">
          <Navbar />
        </div>
      </header>

      {/* 🔹 Main content pushed down so it doesn't sit under the navbar */}
      <main className="pt-10 flex w-full flex-col items-center px-4 pb-16">
        <Header />

        <section id="analyze" className="w-full max-w-5xl mt-12">
          <ContractInput
            contract={contract}
            setContract={setContract}
            analyze={analyze}
          />
        </section>

        <ResultsModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          loading={loading}
          results={results}
          fixIssues={fixIssues}
        />
      </main>

       <FooterCentered />
    </div>
  );
}
