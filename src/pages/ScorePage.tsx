import { useAnalysis } from "@/store/analysis";
import EmptyState from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Target as TargetIcon } from "lucide-react";

export default function ScorePage() {
  const r = useAnalysis((s) => s.result);
  if (!r) return <EmptyState />;

  const tier =
    r.score >= 80 ? { label: "Excellent", color: "text-success", bg: "from-success/20 to-primary/10" } :
    r.score >= 60 ? { label: "Strong", color: "text-primary", bg: "from-primary/20 to-secondary/10" } :
    r.score >= 40 ? { label: "Developing", color: "text-warning", bg: "from-warning/20 to-secondary/10" } :
    { label: "Early Stage", color: "text-destructive", bg: "from-destructive/20 to-warning/10" };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analysis Score</h1>
        <p className="text-muted-foreground mt-1">For target role: <span className="text-foreground font-medium">{r.jobRole}</span></p>
      </div>

      <Card className={`glass-card p-8 bg-gradient-to-br ${tier.bg}`}>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="78" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" />
              <circle
                cx="90" cy="90" r="78" fill="none"
                stroke="url(#g)" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={`${(r.score / 100) * 490} 490`}
                transform="rotate(-90 90 90)"
              />
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold gradient-text glow-text">{r.score}%</div>
              <div className={`text-sm font-medium ${tier.color}`}>{tier.label}</div>
            </div>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <Stat icon={Award} label="Matched Skills" value={r.matchedSkills.length} max={r.matchedSkills.length + r.missingSkills.length} color="success" />
            <Stat icon={TargetIcon} label="Skill Gaps" value={r.missingSkills.length} max={r.matchedSkills.length + r.missingSkills.length} color="warning" />
            <Stat icon={TrendingUp} label="Job Recommendations" value={r.jobRecommendations.length} max={5} color="primary" />
          </div>
        </div>
      </Card>

      <Card className="glass-card p-6">
        <h2 className="font-semibold mb-3">AI Suggestions</h2>
        <ul className="space-y-2">
          {r.suggestions.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-primary mt-0.5">▸</span>
              <span className="text-muted-foreground">{s}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value, max, color }: any) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Icon className={`h-4 w-4 text-${color}`} /> {label}
        </span>
        <span className="font-semibold">{value}</span>
      </div>
      <Progress value={(value / Math.max(max, 1)) * 100} className="h-2" />
    </div>
  );
}
