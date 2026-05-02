import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload as UploadIcon, FileText, Loader2, Sparkles } from "lucide-react";
import { analyze, SUPPORTED_ROLE_LIST } from "@/lib/analysis";
import { useAnalysis } from "@/store/analysis";

async function extractPdfText(file: File): Promise<string> {
  // @ts-ignore - vite worker import
  const pdfjs = await import("pdfjs-dist");
  // @ts-ignore
  const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it: any) => it.str).join(" ") + "\n";
  }
  return text;
}

export default function UploadPage() {
  const navigate = useNavigate();
  const setResult = useAnalysis((s) => s.setResult);
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("Frontend Developer");
  const [busy, setBusy] = useState(false);
  const [parsing, setParsing] = useState(false);

  async function handleFile(f: File) {
    setFile(f);
    try {
      setParsing(true);
      let text = "";
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        text = await extractPdfText(f);
      } else {
        text = await f.text();
      }
      setResumeText(text);
      toast.success(`Parsed ${text.length.toLocaleString()} characters from ${f.name}`);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to parse file: " + (e?.message ?? "unknown"));
    } finally {
      setParsing(false);
    }
  }

  async function handleAnalyze() {
    if (!resumeText.trim()) {
      toast.error("Please upload a resume or paste text first.");
      return;
    }
    if (!jobRole.trim()) {
      toast.error("Please enter a target job role.");
      return;
    }
    setBusy(true);
    try {
      // Mirrors POST /analyze. Same payload shape as the Express backend.
      const res = analyze(resumeText, jobRole);
      setResult(res);
      toast.success(`Analysis complete · score ${res.score}%`);
      navigate("/score");
    } catch (e: any) {
      toast.error(e?.message ?? "Analysis failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Resume</h1>
        <p className="text-muted-foreground mt-1">Drop a PDF (or paste text), pick a role, and get instant analysis.</p>
      </div>

      <Card className="glass-card p-6 space-y-6">
        <div>
          <Label className="text-sm">Resume file (PDF or .txt)</Label>
          <label
            htmlFor="file"
            className="mt-2 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border hover:border-primary/60 transition-colors p-10 cursor-pointer bg-muted/20"
          >
            {parsing ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <UploadIcon className="h-8 w-8 text-primary" />
            )}
            <div className="text-center">
              <div className="font-medium">{file?.name ?? "Click to upload or drop a file"}</div>
              <div className="text-xs text-muted-foreground mt-1">PDF, TXT — parsed in your browser</div>
            </div>
            <input
              id="file"
              type="file"
              accept=".pdf,.txt,application/pdf,text/plain"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        </div>

        <div>
          <Label htmlFor="text" className="text-sm">Or paste resume text</Label>
          <Textarea
            id="text"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={8}
            placeholder="Paste your resume here (skills, projects, experience)..."
            className="mt-2 font-mono text-xs"
          />
          {resumeText && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <FileText className="h-3 w-3" /> {resumeText.length.toLocaleString()} characters loaded
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="role" className="text-sm">Target job role</Label>
          <Input
            id="role"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            list="roles"
            placeholder="e.g. Frontend Developer"
            className="mt-2"
          />
          <datalist id="roles">
            {SUPPORTED_ROLE_LIST.map((r) => (
              <option key={r} value={r.replace(/\b\w/g, (c) => c.toUpperCase())} />
            ))}
          </datalist>
          <p className="text-xs text-muted-foreground mt-1">
            Supported: {SUPPORTED_ROLE_LIST.map((r) => r.replace(/\b\w/g, (c) => c.toUpperCase())).join(" · ")}
          </p>
        </div>

        <Button
          size="lg"
          disabled={busy || parsing}
          onClick={handleAnalyze}
          className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-glow"
        >
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Get Analysis
        </Button>
      </Card>
    </div>
  );
}
