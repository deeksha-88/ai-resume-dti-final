import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Brain, Briefcase, Bot, ArrowRight, Sparkles } from "lucide-react";
import { useAnalysis } from "@/store/analysis";

const features = [
  { icon: Upload, title: "Upload Resume", desc: "PDF or text — parsed locally in seconds." },
  { icon: Brain, title: "AI Analysis", desc: "Score, skill gaps, and tailored suggestions." },
  { icon: Briefcase, title: "Job Matches", desc: "Roles aligned with your profile + salary in INR." },
  { icon: Bot, title: "AI Chatbot", desc: "Ask anything about your resume and roadmap." },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const result = useAnalysis((s) => s.result);

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 glass-card p-8 sm:p-14">
        <div className="absolute inset-0 -z-10 opacity-60"
             style={{ background: "var(--gradient-hero)" }} />
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
          <Sparkles className="h-3 w-3" /> Smart resume intelligence
        </div>
        <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight">
          <span className="gradient-text glow-text">AI Resume Analyzer</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground">
          Upload your resume, set your target role, and get AI-powered insights including
          skill gaps, job matches, salary insights, and a personalized roadmap.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={() => navigate("/upload")}
            className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:opacity-90 shadow-glow">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {result && (
            <Button size="lg" variant="outline" onClick={() => navigate("/score")}>
              View last analysis
            </Button>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Card key={f.title}
            className="glass-card p-6 hover:border-primary/40 hover:shadow-elegant transition-all group cursor-default"
            style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 group-hover:scale-110 transition-transform">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
