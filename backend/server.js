// Express backend that mirrors the client-side analyzer.
// Run: cd backend && npm install && node server.js
// Endpoint: POST http://localhost:5000/analyze  { resumeText, jobRole }

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ---------- Skill DB ----------
const ROLE_SKILLS = {
  "frontend developer": ["html","css","javascript","typescript","react","redux","tailwind","next.js","vite","webpack","git","rest api","responsive design","accessibility","testing","jest","figma"],
  "backend developer": ["node.js","express","python","java","sql","postgresql","mongodb","rest api","graphql","docker","redis","git","microservices","authentication","testing","linux"],
  "full stack developer": ["html","css","javascript","typescript","react","node.js","express","sql","mongodb","rest api","git","docker","tailwind","next.js","authentication","testing"],
  "data scientist": ["python","pandas","numpy","scikit-learn","tensorflow","pytorch","sql","statistics","machine learning","deep learning","data visualization","matplotlib","jupyter","nlp","git"],
  "data analyst": ["sql","excel","python","pandas","tableau","power bi","statistics","data visualization","etl","numpy","git"],
  "devops engineer": ["linux","docker","kubernetes","aws","terraform","ansible","ci/cd","jenkins","git","bash","python","monitoring","prometheus","grafana","nginx"],
  "machine learning engineer": ["python","tensorflow","pytorch","scikit-learn","mlops","docker","kubernetes","sql","machine learning","deep learning","nlp","git","aws"],
  "android developer": ["kotlin","java","android studio","jetpack compose","xml","rest api","sqlite","firebase","git","mvvm"],
  "ui/ux designer": ["figma","sketch","adobe xd","wireframing","prototyping","user research","design systems","accessibility","html","css"],
};
const ALL_SKILLS = Array.from(new Set(Object.values(ROLE_SKILLS).flat().concat([
  "vue","angular","svelte","sass","less","bootstrap","material ui","rust","go","c++","c#",".net","php","ruby","rails","spring","kafka","rabbitmq","elasticsearch","azure","gcp","firebase","websocket","oauth","jwt","agile","scrum",
])));
const SUPPORTED = Object.keys(ROLE_SKILLS);

function extractSkills(text) {
  const t = String(text).toLowerCase();
  const found = new Set();
  for (const s of ALL_SKILLS) {
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`, "i").test(t)) found.add(s);
  }
  return [...found];
}
function resolveRole(role) {
  const r = String(role).trim().toLowerCase();
  if (ROLE_SKILLS[r]) return r;
  for (const k of SUPPORTED) if (r.includes(k) || k.includes(r)) return k;
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

// ---------- Roadmap (only w3schools, freeCodeCamp, MDN) ----------
const ROADMAP = {
  html: [{ title: "HTML Tutorial", link: "https://www.w3schools.com/html/" }],
  css: [{ title: "CSS Tutorial", link: "https://www.w3schools.com/css/" }],
  javascript: [
    { title: "JavaScript Guide", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    { title: "JS Algorithms", link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
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
  tailwind: [{ title: "Tailwind", link: "https://www.freecodecamp.org/news/learn-tailwind-css/" }],
  "next.js": [{ title: "Next.js", link: "https://www.freecodecamp.org/news/the-next-js-handbook/" }],
  testing: [{ title: "Testing JS", link: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing" }],
  jest: [{ title: "Jest", link: "https://www.freecodecamp.org/news/testing-react-with-jest-and-react-testing-library/" }],
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
  authentication: [{ title: "Web Security", link: "https://developer.mozilla.org/en-US/docs/Web/Security" }],
  accessibility: [{ title: "Accessibility", link: "https://developer.mozilla.org/en-US/docs/Web/Accessibility" }],
  "responsive design": [{ title: "Responsive Web", link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" }],
  figma: [{ title: "UI Design", link: "https://www.freecodecamp.org/news/learn-figma/" }],
  kotlin: [{ title: "Kotlin", link: "https://www.w3schools.com/kotlin/" }],
  java: [{ title: "Java", link: "https://www.w3schools.com/java/" }],
};
function roadmapFor(missing) {
  const out = [], seen = new Set();
  for (const m of missing) {
    const arr = ROADMAP[m] || [{ title: `Learn ${m}`, link: `https://www.w3schools.com/${m.replace(/[^a-z0-9]/g, "")}/` }];
    for (const it of arr) if (!seen.has(it.link)) { seen.add(it.link); out.push(it); }
  }
  return out.slice(0, 12);
}

const JOB_RECS = {
  "frontend developer": ["Frontend Engineer","React Developer","UI Engineer","Web Developer","JavaScript Engineer"],
  "backend developer": ["Backend Engineer","API Developer","Node.js Engineer","Platform Engineer","Java Backend Developer"],
  "full stack developer": ["Full Stack Engineer","MERN Developer","Software Engineer","Product Engineer","Web Application Developer"],
  "data scientist": ["Data Scientist","ML Researcher","Applied Scientist","Quantitative Analyst","AI Engineer"],
  "data analyst": ["Data Analyst","Business Analyst","BI Analyst","Reporting Analyst","Analytics Consultant"],
  "devops engineer": ["DevOps Engineer","Site Reliability Engineer","Cloud Engineer","Platform Engineer","Infrastructure Engineer"],
  "machine learning engineer": ["ML Engineer","AI Engineer","MLOps Engineer","Computer Vision Engineer","NLP Engineer"],
  "android developer": ["Android Developer","Mobile Engineer","Kotlin Developer","Android SDK Engineer","App Developer"],
  "ui/ux designer": ["UX Designer","Product Designer","UI Designer","Interaction Designer","Design Systems Engineer"],
};

function salaryFor(role, score) {
  const base = {
    "frontend developer": [4,22], "backend developer": [5,26], "full stack developer": [5,28],
    "data scientist": [7,35], "data analyst": [4,18], "devops engineer": [6,30],
    "machine learning engineer": [8,38], "android developer": [4,22], "ui/ux designer": [4,20],
  }[role] || [4,20];
  const f = 0.55 + (score/100)*0.85;
  const lo = Math.round(base[0]*f), hi = Math.round(base[1]*f);
  const mLo = Math.round((lo*100000)/12).toLocaleString("en-IN");
  const mHi = Math.round((hi*100000)/12).toLocaleString("en-IN");
  return `Estimated annual package for ${role}: ₹${lo} LPA – ₹${hi} LPA (₹${mLo} – ₹${mHi} / month). Based on your match score of ${score}%.`;
}

function suggestionsFor(missing, score) {
  const out = [];
  if (score < 50) out.push("Focus on the fundamentals before applying — your match is below half of what's expected for this role.");
  else if (score < 75) out.push("Solid foundation. Close the listed skill gaps to become a strong candidate.");
  else out.push("Excellent match — polish your resume and start applying to senior listings.");
  if (missing.length) {
    out.push(`Add hands-on projects covering: ${missing.slice(0,5).join(", ")}.`);
    out.push("Quantify achievements with metrics (%, users, latency, revenue).");
  }
  out.push("Use action verbs (Built, Shipped, Optimized) at the start of each bullet.");
  out.push("Tailor the resume keywords to the job description for ATS friendliness.");
  return out;
}

function modifiedResumeFor(text, missing, role) {
  const top = missing.slice(0,8);
  const additions = top.length
    ? `\n\n--- SUGGESTED ADDITIONS ---\n\nTECHNICAL SKILLS (add):\n${top.map(s=>`• ${s}`).join("\n")}\n\nPROJECT IDEAS:\n${top.slice(0,3).map((s,i)=>`${i+1}. Build a ${role} project featuring ${s}, ship it on GitHub with README and demo.`).join("\n")}\n\nBETTER PHRASING:\n• "Worked on X" → "Designed and shipped X, reducing Y by Z%."\n• "Helped with API" → "Built REST endpoints handling 10k+ requests/day."`
    : `\n\n--- SUGGESTED ADDITIONS ---\nYour resume already covers the core skills for ${role}. Strengthen impact with metrics.`;
  return String(text).trim().slice(0,4000) + additions;
}

function interviewQuestionsFor(role, missing) {
  const generic = [
    `Walk me through a project where you acted as a ${role}.`,
    "Tell me about a time you had to debug a difficult production issue.",
    "How do you decide between speed and 'right' architecture?",
    "Describe a technical disagreement and how it was resolved.",
  ];
  const skill = missing.slice(0,5).map(s=>`You listed limited experience with ${s}. How would you ramp up?`);
  const role_q = {
    "frontend developer": ["Explain the browser rendering pipeline.","How would you optimize Largest Contentful Paint?"],
    "backend developer": ["Design a rate limiter for a public API.","Explain database indexing trade-offs."],
    "full stack developer": ["Design a multi-tenant SaaS schema.","How do you handle auth across frontend and backend?"],
    "data scientist": ["Explain bias-variance tradeoff.","Handling severe class imbalance?"],
    "data analyst": ["How do you validate dashboard numbers?","Design an A/B test."],
    "devops engineer": ["Design a zero-downtime pipeline.","How do you secure a Kubernetes cluster?"],
    "machine learning engineer": ["Serve a model with <100ms latency?","Explain feature stores."],
    "android developer": ["Explain Android activity lifecycle.","Background work on modern Android?"],
    "ui/ux designer": ["How do you validate a design hypothesis?","Design system process?"],
  }[role] || [];
  return [...generic, ...role_q, ...skill].slice(0,10);
}

function chatbotIntro(score, missing, matched) {
  return `Hi! I've analyzed your resume. You scored ${score}%. You're strong in ${matched.slice(0,3).join(", ") || "general fundamentals"}. Biggest gaps: ${missing.slice(0,3).join(", ") || "—"}.`;
}

app.post("/analyze", (req, res) => {
  try {
    const { resumeText, jobRole } = req.body || {};
    if (!resumeText || !jobRole) return res.status(400).json({ error: "resumeText and jobRole are required" });

    const role = resolveRole(jobRole);
    const required = ROLE_SKILLS[role];
    const resumeSkills = extractSkills(resumeText);
    const matched = required.filter(s => resumeSkills.includes(s));
    const missing = required.filter(s => !resumeSkills.includes(s));
    const score = Math.round((matched.length / required.length) * 100);

    res.json({
      score,
      matchedSkills: matched,
      missingSkills: missing,
      suggestions: suggestionsFor(missing, score),
      jobRecommendations: JOB_RECS[role] || [],
      salaryInsights: salaryFor(role, score),
      learningRoadmap: roadmapFor(missing),
      modifiedResume: modifiedResumeFor(resumeText, missing, role),
      mockInterviewQuestions: interviewQuestionsFor(role, missing),
      chatbotResponse: chatbotIntro(score, missing, matched),
      jobRole: role,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (_req, res) => res.json({ ok: true, service: "ai-resume-analyzer", endpoint: "POST /analyze" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✓ Backend listening on http://localhost:${PORT}`));
