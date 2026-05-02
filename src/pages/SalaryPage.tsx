import { useAnalysis } from "@/store/analysis";
import EmptyState from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";

export default function SalaryPage() {
  const r = useAnalysis((s) => s.result);
  if (!r) return <EmptyState />;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Salary Insights</h1>
        <p className="text-muted-foreground mt-1">Estimated package in INR for your match level.</p>
      </div>
      <Card className="glass-card p-8 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-glow">
            <IndianRupee className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{r.jobRole}</h2>
            <p className="text-sm text-muted-foreground">Match score: {r.score}%</p>
          </div>
        </div>
        <p className="mt-6 text-base leading-relaxed">{r.salaryInsights}</p>
      </Card>
    </div>
  );
}
