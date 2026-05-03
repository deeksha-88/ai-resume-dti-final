# AI Resume Analyzer — Backend

Express server that powers all analysis (skill match, score, suggestions, roadmap, salary, interview, chatbot). The frontend has **no** local analysis logic — it calls this server.

## Run

```bash
cd backend
npm install
node server.js
# → http://localhost:5000
```

## Configure the frontend

At the project root, create `.env`:

```
VITE_API_URL=http://localhost:5000
```

Then `npm run dev` in the project root.

## Endpoints

### `POST /analyze`
Body: `{ "resumeText": string, "jobRole": string }`

Response:
```json
{
  "score": 72,
  "matchedSkills": ["react", "typescript"],
  "missingSkills": ["next.js", "testing"],
  "suggestions": ["..."],
  "jobRecommendations": ["..."],
  "salaryInsights": "Estimated annual package ...",
  "learningRoadmap": [{ "title": "...", "link": "https://..." }],
  "modifiedResume": "...",
  "mockInterviewQuestions": ["..."],
  "chatbotResponse": "...",
  "jobRole": "frontend developer"
}
```

### `POST /chat`
Body: `{ "message": string, "context": AnalysisResult }`
Response: `{ "reply": string }`

## Deploy on Render

1. New Web Service → connect repo
2. Root Directory: `backend`
3. Build: `npm install` · Start: `node server.js`
4. Set the resulting URL as `VITE_API_URL` for the frontend build.
