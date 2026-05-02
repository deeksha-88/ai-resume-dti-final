import { useAnalysis } from "@/store/analysis";
import EmptyState from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

export default function ResumePage() {
  const r = useAnalysis((s) => s.result);
  if (!r) return <EmptyState />;

  const copy = () => {
    navigator.clipboard.writeText(r.modifiedResume);
    toast.success("Copied to clipboard");
  };
  const download = () => {
    const blob = new Blob([r.modifiedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modified-resume.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Modified Resume</h1>
          <p className="text-muted-foreground mt-1">Your resume with suggested additions and phrasing improvements.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
          <Button size="sm" onClick={download}><Download className="h-4 w-4 mr-1" /> Download</Button>
        </div>
      </div>
      <Card className="glass-card p-6">
        <pre className="whitespace-pre-wrap text-xs font-mono text-foreground leading-relaxed max-h-[70vh] overflow-auto">
{r.modifiedResume}
        </pre>
      </Card>
    </div>
  );
}
