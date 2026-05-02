# AI Resume Analyzer & Job Recommender

A complete, fully working AI-powered resume analyzer with:
- PDF parsing (in-browser via `pdfjs-dist`)
- Skill extraction & match scoring
- Bar / Pie / Radar charts (Recharts)
- Job recommendations, salary insights (INR)
- Learning roadmap (W3Schools, freeCodeCamp, MDN only)
- Modified resume suggestions
- Conversational mock interview
- Rule-based chatbot grounded in your analysis

## Architecture

```
/                      → React + Vite frontend (this repo root)
/backend/server.js     → Node.js + Express drop-in backend (same logic)
```

The frontend ships with the **same analysis logic** (`src/lib/analysis.ts`) so it
works fully offline in the browser. The Express backend (`/backend/server.js`)
exposes the identical contract for environments that require a real API.

---

## Run the frontend

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## Run the backend (optional)

```bash
cd backend
npm install
node server.js
# → http://localhost:5000
```

### To make the frontend hit the Express backend

In `src/pages/UploadPage.tsx`, replace the `analyze(...)` call with:

```ts
const res = await fetch("http://localhost:5000/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ resumeText, jobRole }),
}).then(r => r.json());
```

### API contract

`POST /analyze`

Body:
```json
{ "resumeText": "string", "jobRole": "string" }
```

Response:
```json
{
  "score": 72,
  "matchedSkills": ["react", "typescript"],
  "missingSkills": ["next.js", "testing"],
  "suggestions": ["..."],
  "jobRecommendations": ["..."],
  "salaryInsights": "Estimated annual package for ...: ₹...",
  "learningRoadmap": [{ "title": "...", "link": "https://www.w3schools.com/..." }],
  "modifiedResume": "...",
  "mockInterviewQuestions": ["..."],
  "chatbotResponse": "..."
}
```

## Deploy backend on Render

1. Push `/backend` to a GitHub repo (or this whole repo).
2. On Render → **New Web Service** → connect repo.
3. Set **Root Directory** to `backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Free instance is fine. Render assigns a public URL — use that instead of `http://localhost:5000` in the frontend.
