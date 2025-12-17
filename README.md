# SmartAudit – Smart Contract Auditor

SmartAudit is an **LLM-assisted smart contract auditing tool** that analyzes Solidity contracts and generates **structured vulnerability reports, security summaries, and improvement suggestions** using **Google Gemini AI**.

It supports both a **web interface** and a **CLI tool** for developer-friendly security workflows.

🔗 **Live Demo:** https://smart-audit-lime.vercel.app/

---

##  Features

- Automated analysis of Solidity smart contracts
- AI-generated security audit summaries
- Detection of common vulnerabilities (reentrancy, access control, etc.)
- Code-level improvement suggestions
- **CLI tool** for local audits
- Web UI for interactive audit reports

---

##  AI Integration

- Integrated **Google Gemini AI**
- Used for:
  - Vulnerability reasoning and classification
  - Generating human-readable audit summaries
  - Suggesting secure coding improvements
- Designed using **LLM-assisted / agentic workflows**

---

##  Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend / Tooling:** Node.js
- **AI:** Google Gemini API
- **Interfaces:** Web app + CLI tool

---

##  Installation & Local Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/anganaBoruah/SmartAudit.git  
cd SmartAudit/Auditor-cli  
```
---

### 2️⃣ Install Dependencies
```bash
npm install  
```
---

### 3️⃣ Environment Variables

Create a `.env` file:
```bash
GEMINI_API_KEY=your_google_gemini_api_key  
```
---

### 4️⃣ Run the CLI

The CLI entry point is `index.js`.
```bash
node index.js <path-to-solidity-contract>

Example:
node index.js test.sol  
```
---

### 5️⃣ Run the Web App (optional)
```bash
npm run dev  
```
---

##  Highlights

- Backend-first, security-focused design
- CLI-based auditing for automation-friendly workflows
- Web interface for readable, interactive audit reports
- Designed to reduce manual smart contract audit effort
