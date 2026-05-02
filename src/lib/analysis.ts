// Client-side "API" — mirrors POST /analyze. Pure deterministic logic.
// The same logic is duplicated in /backend/server.js for Node deployment.

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

// Skill DB per role. Keep keys lowercased.
export const ROLE_SKILLS: Record<string, string[]> = {
  "frontend developer": [
    "html", "css", "javascript", "typescript", "react", "redux", "tailwind",
    "next.js", "vite", "webpack", "git", "rest api", "responsive design",
    "accessibility", "testing", "jest", "figma",
  ],
  "backend developer": [
    "node.js", "express", "python", "java", "sql", "postgresql", "mongodb",
    "rest api", "graphql", "docker", "redis", "git", "microservices",
    "authentication", "testing", "linux",
  ],
  "full stack developer": [
    "html", "css", "javascript", "typescript", "react", "node.js", "express",
    "sql", "mongodb", "rest api", "git", "docker", "tailwind", "next.js",
    "authentication", "testing",
  ],
  "data scientist": [
    "python", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "sql", "statistics", "machine learning", "deep learning", "data visualization",
    "matplotlib", "jupyter", "nlp", "git",
  ],
  "data analyst": [
    "sql", "excel", "python", "pandas", "tableau", "power bi", "statistics",
    "data visualization", "etl", "numpy", "git",
  ],
  "devops engineer": [
    "linux", "docker", "kubernetes", "aws", "terraform", "ansible", "ci/cd",
    "jenkins", "git", "bash", "python", "monitoring", "prometheus", "grafana", "nginx",
  ],
  "machine learning engineer": [
    "python", "tensorflow", "pytorch", "scikit-learn", "mlops", "docker",
    "kubernetes", "sql", "machine learning", "deep learning", "nlp", "git", "aws",
  ],
  "android developer": [
    "kotlin", "java", "android studio", "jetpack compose", "xml", "rest api",
    "sqlite", "firebase", "git", "mvvm",
  ],
  "ui/ux designer": [
    "figma", "sketch", "adobe xd", "wireframing", "prototyping", "user research",
    "design systems", "accessibility", "html", "css",
  ],
};

// Comprehensive skill vocabulary for extraction
const ALL_SKILLS = Array.from(
  new Set(Object.values(ROLE_SKILLS).flat().concat([
    "vue", "angular", "svelte", "sass", "less", "bootstrap", "material ui",
    "rust", "go", "c++", "c#", ".net", "php", "ruby", "rails", "spring",
    "kafka", "rabbitmq", "elasticsearch", "azure", "gcp", "firebase",
    "websocket", "oauth", "jwt", "agile", "scrum",
  ]))
);

const SUPPORTED_ROLES = Object.keys(ROLE_SKILLS);

function normalize(text: string): string {
  return text.toLowerCase().replace(/[\u2018\u2019\u201C\u201D]/g, "'");
}

export function extractSkills(resumeText: string): string[] {
  const text = normalize(resumeText);
  const found = new Set<string>();
  for (const skill of ALL_SKILLS) {
    // word boundary-ish match (skills can have ., +, /, spaces)
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
    if (re.test(text)) found.add(skill);
  }
  return Array.from(found);
}

function resolveRole(jobRole: string): string {
  const r = jobRole.trim().toLowerCase();
  if (ROLE_SKILLS[r]) return r;
  // fuzzy: contains
  for (const role of SUPPORTED_ROLES) {
    if (r.includes(role) || role.includes(r)) return role;
  }
  // keyword fallback
  if (r.includes("front")) return "frontend developer";
  if (r.includes("back")) return "backend developer";
  if (r.includes("full")) return "full stack developer";
  if (r.includes("data") && r.includes("scien")) return "data scientist";
  if (r.includes("data")) return "data analyst";
  if (r.includes("devops") || r.includes("sre")) return "devops engineer";
  if (r.includes("ml") || r.includes("machine")) return "machine learning engineer";
  if (r.includes("android") || r.includes("mobile")) return "android developer";
  if (r.includes("ux") || r.includes("ui") || r.includes("design")) return "ui/ux designer";
  return "full stack developer";
}

const ROADMAP_DB: Record<string, RoadmapItem[]> = {
  html: [{ title: "HTML Tutorial", link: "https://www.w3schools.com/html/" }],
  css: [{ title: "CSS Tutorial", link: "https://www.w3schools.com/css/" }],
  javascript: [
    { title: "JavaScript Guide", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    { title: "JavaScript Algorithms", link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
  ],
  typescript: [{ title: "TypeScript", link: "https://www.w3schools.com/typescript/" }],
  react: [{ title: "React Tutorial", link: "https://www.w3schools.com/react/" }],
  "node.js": [{ title: "Node.js", link: "https://www.w3schools.com/nodejs/" }],
  express: [{ title: "Back End Dev with APIs", link: "https://www.freecodecamp.org/learn/back-end-development-and-apis/" }],
  python: [{ title: "Python Tutorial", link: "https://www.w3schools.com/python/" }],
  sql: [{ title: "SQL Tutorial", link: "https://www.w3schools.com/sql/" }],
  mongodb: [{ title: "MongoDB", link: "https://www.w3schools.com/mongodb/" }],
  postgresql: [{ title: "PostgreSQL", link: "https://www.w3schools.com/postgresql/" }],
  docker: [{ title: "Docker", link: "https://www.freecodecamp.org/news/the-docker-handbook/" }],
  kubernetes: [{ title: "Kubernetes", link: "https://www.freecodecamp.org/news/the-kubernetes-handbook/" }],
  git: [{ title: "Git Tutorial", link: "https://www.w3schools.com/git/" }],
  "rest api": [{ title: "REST APIs", link: "https://developer.mozilla.org/en-US/docs/Glossary/REST" }],
  graphql: [{ title: "GraphQL", link: "https://www.freecodecamp.org/news/a-complete-guide-to-graphql/" }],
  tailwind: [{ title: "Tailwind via FCC", link: "https://www.freecodecamp.org/news/learn-tailwind-css/" }],
  "next.js": [{ title: "Next.js Guide", link: "https://www.freecodecamp.org/news/the-next-js-handbook/" }],
  testing: [{ title: "Testing JS", link: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing" }],
  jest: [{ title: "Jest Testing", link: "https://www.freecodecamp.org/news/testing-react-with-jest-and-react-testing-library/" }],
  redux: [{ title: "Redux", link: "https://www.freecodecamp.org/news/redux-tutorial/" }],
  "machine learning": [{ title: "ML Curriculum", link: "https://www.freecodecamp.org/learn/machine-learning-with-python/" }],
  "deep learning": [{ title: "Deep Learning", link: "https://www.freecodecamp.org/news/deep-learning-fundamentals/" }],
  pandas: [{ title: "Pandas", link: "https://www.w3schools.com/python/pandas/" }],
  numpy: [{ title: "NumPy", link: "https://www.w3schools.com/python/numpy/" }],
  "scikit-learn": [{ title: "Scikit-learn", link: "https://www.freecodecamp.org/news/scikit-learn-machine-learning-tutorial/" }],
  tensorflow: [{ title: "TensorFlow", link: "https://www.freecodecamp.org/news/the-tensorflow-handbook/" }],
  pytorch: [{ title: "PyTorch", link: "https://www.freecodecamp.org/news/pytorch-tutorial/" }],
  nlp: [{ title: "NLP", link: "https://www.freecodecamp.org/news/learn-natural-language-processing-no-experience-required/" }],
  statistics: [{ title: "Statistics", link: "https://www.w3schools.com/statistics/" }],
  "data visualization": [{ title: "Data Viz", link: "https://www.freecodecamp.org/learn/data-visualization/" }],
  excel: [{ title: "Excel", link: "https://www.w3schools.com/excel/" }],
  linux: [{ title: "Linux Cmds", link: "https://www.freecodecamp.org/news/the-linux-commands-handbook/" }],
  bash: [{ title: "Bash", link: "https://www.freecodecamp.org/news/bash-scripting-tutorial-linux-shell-script-and-command-line-for-beginners/" }],
  aws: [{ title: "AWS Basics", link: "https://www.freecodecamp.org/news/aws-cloud-practitioner-study-course-pass-the-exam-with-this-free-12-hour-course/" }],
  "ci/cd": [{ title: "CI/CD", link: "https://www.freecodecamp.org/news/what-is-ci-cd/" }],
  authentication: [{ title: "Web Auth", link: "https://developer.mozilla.org/en-US/docs/Web/Security" }],
  accessibility: [{ title: "Accessibility", link: "https://developer.mozilla.org/en-US/docs/Web/Accessibility" }],
  "responsive design": [{ title: "Responsive Web", link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" }],
  figma: [{ title: "UI Design", link: "https://www.freecodecamp.org/news/learn-figma/" }],
  kotlin: [{ title: "Kotlin", link: "https://www.w3schools.com/kotlin/" }],
  java: [{ title: "Java", link: "https://www.w3schools.com/java/" }],
};

function roadmapFor(missing: string[]): RoadmapItem[] {
  const items: RoadmapItem[] = [];
  const seen = new Set<string>();
  for (const m of missing) {
    const arr = ROADMAP_DB[m];
    if (arr) {
      for (const it of arr) {
        if (!seen.has(it.link)) { seen.add(it.link); items.push(it); }
      }
    } else {
      // fallback: w3schools search-style stable link
      const slug = m.replace(/[^a-z0-9]/g, "");
      const link = `https://www.w3schools.com/${slug}/`;
      if (!seen.has(link)) { seen.add(link); items.push({ title: `Learn ${m}`, link }); }
    }
  }
  return items.slice(0, 12);
}

const JOB_RECS: Record<string, string[]> = {
  "frontend developer": ["Frontend Engineer", "React Developer", "UI Engineer", "Web Developer", "JavaScript Engineer"],
  "backend developer": ["Backend Engineer", "API Developer", "Node.js Engineer", "Platform Engineer", "Java Backend Developer"],
  "full stack developer": ["Full Stack Engineer", "MERN Developer", "Software Engineer", "Product Engineer", "Web Application Developer"],
  "data scientist": ["Data Scientist", "ML Researcher", "Applied Scientist", "Quantitative Analyst", "AI Engineer"],
  "data analyst": ["Data Analyst", "Business Analyst", "BI Analyst", "Reporting Analyst", "Analytics Consultant"],
  "devops engineer": ["DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer", "Platform Engineer", "Infrastructure Engineer"],
  "machine learning engineer": ["ML Engineer", "AI Engineer", "MLOps Engineer", "Computer Vision Engineer", "NLP Engineer"],
  "android developer": ["Android Developer", "Mobile Engineer", "Kotlin Developer", "Android SDK Engineer", "App Developer"],
  "ui/ux designer": ["UX Designer", "Product Designer", "UI Designer", "Interaction Designer", "Design Systems Engineer"],
};

function salaryFor(role: string, score: number): string {
  // Indian INR base ranges (LPA), modulated by score
  const base: Record<string, [number, number]> = {
    "frontend developer": [4, 22],
    "backend developer": [5, 26],
    "full stack developer": [5, 28],
    "data scientist": [7, 35],
    "data analyst": [4, 18],
    "devops engineer": [6, 30],
    "machine learning engineer": [8, 38],
    "android developer": [4, 22],
    "ui/ux designer": [4, 20],
  };
  const [lo, hi] = base[role] ?? [4, 20];
  const factor = 0.55 + (score / 100) * 0.85; // 0.55 .. 1.4
  const low = Math.round(lo * factor);
  const high = Math.round(hi * factor);
  const monthly = `₹${Math.round((low * 100000) / 12).toLocaleString("en-IN")} – ₹${Math.round((high * 100000) / 12).toLocaleString("en-IN")} / month`;
  return `Estimated annual package for ${role}: ₹${low} LPA – ₹${high} LPA (${monthly}). Based on your match score of ${score}%.`;
}

function suggestionsFor(missing: string[], score: number): string[] {
  const out: string[] = [];
  if (score < 50) out.push("Focus on the fundamentals before applying — your match is below half of what's expected for this role.");
  else if (score < 75) out.push("Solid foundation. Close the listed skill gaps to become a strong candidate.");
  else out.push("Excellent match — polish your resume and start applying to senior listings.");

  if (missing.length) {
    out.push(`Add hands-on projects covering: ${missing.slice(0, 5).join(", ")}.`);
    out.push("Quantify achievements with metrics (%, users, latency, revenue).");
  }
  out.push("Use action verbs (Built, Shipped, Optimized) at the start of each bullet.");
  out.push("Tailor the resume keywords to the job description for ATS friendliness.");
  return out;
}

function modifiedResumeFor(resumeText: string, missing: string[], role: string): string {
  const top = missing.slice(0, 8);
  const additions = top.length
    ? `\n\n--- SUGGESTED ADDITIONS ---\n\nTECHNICAL SKILLS (add):\n${top.map((s) => `• ${s}`).join("\n")}\n\nPROJECT IDEAS to demonstrate them:\n${top
        .slice(0, 3)
        .map((s, i) => `${i + 1}. Build a small ${role} project featuring ${s}, document it on GitHub with a README, screenshots, and a live demo link.`)
        .join("\n")}\n\nBETTER PHRASING EXAMPLES:\n• Replace "Worked on X" → "Designed and shipped X, reducing Y by Z%."\n• Replace "Helped with API" → "Built REST endpoints handling 10k+ requests/day."\n• Replace "Used React" → "Architected a React + TypeScript SPA serving N users."`
    : `\n\n--- SUGGESTED ADDITIONS ---\nYour resume already covers the core skills for ${role}. Strengthen impact statements with metrics and lead with outcomes.`;
  const trimmed = resumeText.trim().slice(0, 4000);
  return trimmed + additions;
}

function interviewQuestionsFor(role: string, missing: string[]): string[] {
  const generic = [
    `Walk me through a project where you acted as a ${role}. What was your specific contribution?`,
    "Tell me about a time you had to debug a difficult production issue. How did you approach it?",
    "How do you decide between getting something done quickly vs. building it the 'right' way?",
    "Describe a disagreement with a teammate over a technical decision and how it was resolved.",
  ];
  const skillQs = missing.slice(0, 5).map(
    (s) => `You listed limited experience with ${s}. How would you ramp up, and what would your first project using ${s} look like?`
  );
  const roleSpecific: Record<string, string[]> = {
    "frontend developer": ["Explain the browser rendering pipeline.", "How would you optimize Largest Contentful Paint?"],
    "backend developer": ["Design a rate limiter for a public API.", "Explain database indexing trade-offs."],
    "full stack developer": ["Design the schema for a multi-tenant SaaS app.", "How do you handle auth across frontend and backend?"],
    "data scientist": ["Explain bias-variance tradeoff with an example.", "How would you handle severe class imbalance?"],
    "data analyst": ["How do you validate that a dashboard's numbers are correct?", "Walk through an A/B test you would design."],
    "devops engineer": ["Design a zero-downtime deployment pipeline.", "How do you secure a Kubernetes cluster?"],
    "machine learning engineer": ["How would you serve a model with <100ms latency?", "Explain feature stores."],
    "android developer": ["Explain Android's activity lifecycle.", "How do you handle background work on modern Android?"],
    "ui/ux designer": ["How do you validate a design hypothesis?", "Walk through your design system process."],
  };
  return [...generic, ...(roleSpecific[role] ?? []), ...skillQs].slice(0, 10);
}

function chatbotIntro(score: number, missing: string[], matched: string[]): string {
  return `Hi! I've analyzed your resume. You scored ${score}%. You're strong in ${matched.slice(0, 3).join(", ") || "general fundamentals"}. The biggest gaps are ${missing.slice(0, 3).join(", ") || "—"}. Ask me "how can I improve?", "what skills am I missing?", "salary?", or "suggest projects".`;
}

export function chatbotReply(message: string, ctx: AnalysisResult): string {
  const m = message.toLowerCase();
  if (/missing|gap|lack/.test(m)) {
    return ctx.missingSkills.length
      ? `You're missing: ${ctx.missingSkills.join(", ")}.`
      : "You're not missing any major skills for this role — nice work!";
  }
  if (/improve|better|suggest|advice|tip/.test(m)) return ctx.suggestions.join("\n• ");
  if (/salary|pay|compensation|ctc|package/.test(m)) return ctx.salaryInsights;
  if (/score|match|rating/.test(m)) return `Your match score for ${ctx.jobRole} is ${ctx.score}%.`;
  if (/job|role|position|opportunit/.test(m)) return `Based on your profile: ${ctx.jobRecommendations.join(", ")}.`;
  if (/learn|roadmap|course|study|resource/.test(m))
    return "Top resources for you:\n" + ctx.learningRoadmap.slice(0, 5).map((r) => `• ${r.title} → ${r.link}`).join("\n");
  if (/project|build|portfolio/.test(m))
    return ctx.missingSkills.length
      ? `Build small projects around: ${ctx.missingSkills.slice(0, 4).join(", ")}. Ship them on GitHub with live demos.`
      : "Build one big capstone project that showcases the full role's skill set end-to-end.";
  if (/interview|question/.test(m))
    return "Sample interview prompts:\n" + ctx.mockInterviewQuestions.slice(0, 3).map((q) => `• ${q}`).join("\n");
  if (/hi|hello|hey/.test(m)) return chatbotIntro(ctx.score, ctx.missingSkills, ctx.matchedSkills);
  return `I can answer about: missing skills, how to improve, salary, score, job recommendations, learning roadmap, project ideas, or interview prep. (You asked: "${message}")`;
}

export function analyze(resumeText: string, jobRole: string): AnalysisResult {
  if (!resumeText || !resumeText.trim()) throw new Error("resumeText is required");
  if (!jobRole || !jobRole.trim()) throw new Error("jobRole is required");

  const role = resolveRole(jobRole);
  const required = ROLE_SKILLS[role];
  const resumeSkills = extractSkills(resumeText);

  const matched = required.filter((s) => resumeSkills.includes(s));
  const missing = required.filter((s) => !resumeSkills.includes(s));
  const score = Math.round((matched.length / required.length) * 100);

  const result: AnalysisResult = {
    score,
    matchedSkills: matched,
    missingSkills: missing,
    suggestions: suggestionsFor(missing, score),
    jobRecommendations: JOB_RECS[role] ?? [],
    salaryInsights: salaryFor(role, score),
    learningRoadmap: roadmapFor(missing),
    modifiedResume: modifiedResumeFor(resumeText, missing, role),
    mockInterviewQuestions: interviewQuestionsFor(role, missing),
    chatbotResponse: chatbotIntro(score, missing, matched),
    jobRole: role,
    resumeText,
  };
  return result;
}

export const SUPPORTED_ROLE_LIST = SUPPORTED_ROLES;
