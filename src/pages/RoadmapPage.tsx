import { useAnalysis } from "@/store/analysis";
import EmptyState from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { ExternalLink, BookOpen } from "lucide-react";

export default function RoadmapPage() {
  const r = useAnalysis((s) => s.result);
  if (!r) return <EmptyState />;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Roadmap</h1>
        <p className="text-muted-foreground mt-1">Curated resources from W3Schools, freeCodeCamp, and MDN.</p>
      </div>
      {r.learningRoadmap.length === 0 ? (
        <Card className="glass-card p-8 text-center text-muted-foreground">No gaps to fill — you're set for {r.jobRole}!</Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {r.learningRoadmap.map((it, i) => (
            <a key={it.link} href={it.link} target="_blank" rel="noreferrer">
              <Card className="glass-card p-5 hover:border-primary/40 hover:shadow-elegant transition-all group">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold truncate">{it.title}</h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{it.link}</p>
                    <span className="text-[10px] text-primary mt-2 inline-block">Step {i + 1}</span>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
