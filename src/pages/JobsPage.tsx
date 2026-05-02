import { useAnalysis } from "@/store/analysis";
import EmptyState from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function JobsPage() {
  const r = useAnalysis((s) => s.result);
  if (!r) return <EmptyState />;
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Recommendations</h1>
        <p className="text-muted-foreground mt-1">Roles matching your profile.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {r.jobRecommendations.map((j, i) => (
          <Card key={j} className="glass-card p-5 hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{j}</h3>
                <p className="text-xs text-muted-foreground mt-1">Match rank #{i + 1} · aligned with your skill profile</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
