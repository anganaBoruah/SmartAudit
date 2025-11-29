"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  IconChecklist,
  IconCircleCheck,
  IconGauge,
  IconChevronDown,
  IconChevronUp,
  IconTool,
} from "@tabler/icons-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { marked } from "marked";

interface ResultsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  loading: boolean;
  results: any;
  fixIssues: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  closeModal,
  loading,
  results,
  fixIssues,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const auditReport =
    results && Array.isArray(results)
      ? results.find((r: any) => r.section === "Audit Report")
      : null;

  const metricScores =
    results && Array.isArray(results)
      ? results.find((r: any) => r.section === "Metric Scores")
      : null;

  const suggestionsSection =
    results && Array.isArray(results)
      ? results.find((r: any) => r.section === "Suggestions for Improvement")
      : null;

const renderMarkdown = (input: unknown) => {
  let text = "";

  if (Array.isArray(input)) {
    // Handles ["line1", "line2"] or [{ text: "..." }, ...]
    text = input
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          return (item as { text?: string }).text ?? "";
        }
        return "";
      })
      .join("\n\n"); // join with blank line for paragraphs
  } else if (typeof input === "string") {
    text = input;
  } else if (input && typeof input === "object" && "text" in (input as any)) {
    // In case it's a single { text: "..." } object
    text = (input as { text?: string }).text ?? "";
  }

  return {
    __html: marked.parse(text || ""),
  };
};

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="w-full max-w-3xl max-h-[80vh] rounded-2xl bg-[#1E1E1E] text-gray-100 shadow-2xl flex flex-col p-8">

          {loading ? (
            // LOADING UI
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8">
              <svg
                className="animate-spin h-14 w-14 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V4a8 8 0 00-8 8z"
                />
              </svg>
              <p className="text-lg text-gray-300">Analyzing smart contract...</p>
            </div>
          ) : (
            results && (
              <>
                {/* Header */}
                <div className="px-2 pt-2 pb-4 shrink-0">
                  <Dialog.Title className="text-3xl font-bold">
                    Audit Results
                  </Dialog.Title>
                </div>

                {/* Scrollable Content */}
                <div className="px-2 pb-6 pt-2 space-y-8 overflow-y-auto">

                  {/* Audit Report */}
                  <div className="text-left">
                    <h3
                      className="text-xl cursor-pointer flex items-center justify-between mb-4"
                      onClick={() => toggleSection("auditReport")}
                    >
                      <div className="flex items-center space-x-2">
                        <IconChecklist size={24} />
                        <span>Audit Report</span>
                      </div>
                      {expandedSection === "auditReport" ? (
                        <IconChevronUp size={24} />
                      ) : (
                        <IconChevronDown size={24} />
                      )}
                    </h3>

                    {expandedSection === "auditReport" && auditReport && (
                      <div
                        className=" text-gray-100 leading-relaxed"
                        dangerouslySetInnerHTML={renderMarkdown(auditReport.details)}
                      />
                    )}
                  </div>

                  {/* Metric Scores */}
                  <div className="text-left">
                    <h3
                      className="text-xl cursor-pointer flex items-center justify-between mb-4"
                      onClick={() => toggleSection("metricScores")}
                    >
                      <div className="flex items-center space-x-2">
                        <IconGauge size={24} />
                        <span>Metric Scores</span>
                      </div>
                      {expandedSection === "metricScores" ? (
                        <IconChevronUp size={24} />
                      ) : (
                        <IconChevronDown size={24} />
                      )}
                    </h3>

                    {expandedSection === "metricScores" &&
                      metricScores &&
                      Array.isArray(metricScores.details) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {metricScores.details.map(
                            (metric: any, index: number) => {
                              let color =
                                metric.score >= 8
                                  ? "#4caf50"
                                  : metric.score < 5
                                  ? "#f44336"
                                  : "#ffeb3b";

                              return (
                                <div
                                  key={index}
                                  className="flex flex-col items-center"
                                >
                                  <div className="w-24 h-24">
                                    <CircularProgressbar
                                      value={metric.score * 10}
                                      text={`${metric.score}/10`}
                                      strokeWidth={10}
                                      styles={buildStyles({
                                        textSize: "14px",
                                        pathColor: color,
                                        textColor: "#fff",
                                        trailColor: "#3a3a3a",
                                      })}
                                    />
                                  </div>
                                  <p className="text-center mt-2 text-sm text-gray-200">
                                    {metric.metric}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                  </div>

                  {/* Suggestions */}
                  <div className="text-left">
                    <h3
                      className="text-xl cursor-pointer flex items-center justify-between mb-4"
                      onClick={() => toggleSection("suggestions")}
                    >
                      <div className="flex items-center space-x-2">
                        <IconCircleCheck size={24} />
                        <span>Suggestions for Improvement</span>
                      </div>
                      {expandedSection === "suggestions" ? (
                        <IconChevronUp size={24} />
                      ) : (
                        <IconChevronDown size={24} />
                      )}
                    </h3>

                    {expandedSection === "suggestions" && suggestionsSection && (
                      <>
                        <div
                          className=" text-gray-100 leading-relaxed"
                          dangerouslySetInnerHTML={renderMarkdown(
                            suggestionsSection.details
                          )}
                        />

                        {/* Fix Button */}
                        <button
                          onClick={fixIssues}
                          className="mt-4 rounded-full inline-flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 transition"
                        >
                          <IconTool size={20} className="mr-2" />
                          Fix
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* ✅ Close Button  */}
                <div className="flex justify-center pt-4 border-t border-gray-700">
                  <button
                    onClick={closeModal}
                    className="text-blue-400 hover:text-blue-300 text-sm py-1.5"
                  >
                    Close
                  </button>
                </div>
              </>
            )
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ResultsModal;
