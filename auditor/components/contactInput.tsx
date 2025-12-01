"use client";

import React, { useRef } from "react";
import Editor from "react-simple-code-editor";
import * as Prism from "prismjs";
import "prismjs/components/prism-solidity";
import "prismjs/themes/prism-tomorrow.css";
import { IconChecklist, IconPaperclip } from "@tabler/icons-react";

import { SAMPLE_CONTRACT } from "@/data/test";

interface CustomCodeEditorProps {
  contract: string;
  setContract: React.Dispatch<React.SetStateAction<string>>;
  analyze: () => Promise<void>;
}

const highlightWithPrism = (code: string) =>
  Prism.highlight(code, Prism.languages.solidity, "solidity");

const isValidSolidityContract = (code: string) => {
  const SPDXRegex = /\/\/\s*SPDX-License-Identifier:\s*[^\s]+/;
  const pragmaRegex = /pragma\s+solidity\s+[^;]+;/;
  return SPDXRegex.test(code) && pragmaRegex.test(code);
};

const CustomCodeEditor: React.FC<CustomCodeEditorProps> = ({
  contract,
  setContract,
  analyze,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAnalyze = () => {
    if (!isValidSolidityContract(contract)) {
      alert(
        "The provided code does not appear to be a valid Solidity smart contract. Make sure it starts with the SPDX license identifier and the 'pragma' directive."
      );
      return;
    }
    void analyze();
  };

  const handleUseSample = () => {
    setContract(SAMPLE_CONTRACT);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      if (typeof text === "string") {
        setContract(text);
      }
    };
    reader.onerror = () => {
      alert("Failed to read file. Please try again.");
    };
    reader.readAsText(file);

    e.target.value = "";
  };

  return (
    <div className="lg:w-4/6 w-full mx-auto">
      {/* hidden file input for attachment */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".sol,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* outer wrapper with single border + rounded corners */}
      <div className="border border-gray-300 rounded-2xl dark:border-neutral-700 overflow-hidden">
        {/* scrollable editor area */}
        <div
          className="p-6 dark:bg-neutral-900 dark:text-neutral-200"
          style={{ height: "430px", overflowY: "auto" }}
        >
          <Editor
            value={contract}
            onValueChange={setContract}
            highlight={highlightWithPrism}
            padding={15}
            textareaId="code-editor"
            className="textarea-editor"
            placeholder="Paste your Solidity smart contract code here..."
            textareaClassName="outline-none"
            style={{
              fontFamily: '"Fira Mono", monospace',
              fontSize: 17,
              minHeight: "100%",
              background: "transparent",
              color: "#d4d4d4",
            }}
          />
        </div>
        <div className="h-[1px] bg-white/20 dark:bg-white/10"></div>

        {/* bottom action bar (inside same border) */}
        <div className="px-4 py-4 bg-[#1a1a1a] text-neutral-200 shadow-inner ">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <button
                type="button"
                onClick={handleAttachmentClick}
                className="inline-flex justify-center items-center size-8 rounded-lg text-gray-500 hover:text-blue-600 
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:text-blue-500"
              >
                <IconPaperclip />
              </button>

              <button
                type="button"
                onClick={handleUseSample}
                className="text-xs px-3 py-1.5 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] text-neutral-300 
                           hover:bg-[#333] hover:border-[#555] hover:text-white transition"
              >
                Use sample
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              type="button"
              className="flex flex-row items-center space-x-2 px-6 py-1.5 rounded-full text-white bg-blue-600 hover:bg-blue-500 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>Audit</span>
              <IconChecklist size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCodeEditor;
