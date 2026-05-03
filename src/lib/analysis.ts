// Thin API client. All analysis logic lives in the Express backend (/backend/server.js).
// No mock, no fallback data — if the backend is unreachable, errors propagate to the UI.

export type RoadmapItem = { title: string; link: string };

export type AnalysisResult = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  jobRecommendations: string[];
  salaryInsights: string;
  learningRoadmap: RoadmapItem[];
  modifiedResume: string;
  mockInterviewQuestions: string[];
  chatbotResponse: string;
  jobRole: string;
  resumeText: string;
};

export const SUPPORTED_ROLE_LIST: string[] = [
  "frontend developer",
  "backend developer",
  "full stack developer",
  "data scientist",
  "data analyst",
  "devops engineer",
  "machine learning engineer",
  "android developer",
  "ui/ux designer",
];

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:5000";

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e: any) {
    throw new Error(
      `Cannot reach backend at ${API_URL}. Make sure the Express server is running (cd backend && node server.js).`
    );
  }
  if (!res.ok) {
    let msg = `Backend error ${res.status}`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export async function analyze(resumeText: string, jobRole: string): Promise<AnalysisResult> {
  if (!resumeText?.trim()) throw new Error("resumeText is required");
  if (!jobRole?.trim()) throw new Error("jobRole is required");
  const data = await postJSON<Omit<AnalysisResult, "resumeText">>("/analyze", {
    resumeText,
    jobRole,
  });
  return { ...data, resumeText };
}

export async function chatbotReply(message: string, ctx: AnalysisResult): Promise<string> {
  const { reply } = await postJSON<{ reply: string }>("/chat", {
    message,
    context: {
      score: ctx.score,
      matchedSkills: ctx.matchedSkills,
      missingSkills: ctx.missingSkills,
      suggestions: ctx.suggestions,
      jobRecommendations: ctx.jobRecommendations,
      salaryInsights: ctx.salaryInsights,
      learningRoadmap: ctx.learningRoadmap,
      mockInterviewQuestions: ctx.mockInterviewQuestions,
      jobRole: ctx.jobRole,
    },
  });
  return reply;
}
