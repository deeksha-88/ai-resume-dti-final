import { useState, useRef, useEffect } from "react";
import { useAnalysis } from "@/store/analysis";
import EmptyState from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, RotateCcw, CheckCircle2 } from "lucide-react";

type Turn = { role: "interviewer" | "you"; text: string };

export default function InterviewPage() {
  const r = useAnalysis((s) => s.result);
  const [idx, setIdx] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [answer, setAnswer] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (r && turns.length === 0) {
      setTurns([
        { role: "interviewer", text: `Hi! I'm your interviewer for the ${r.jobRole} role. Let's begin.` },
        { role: "interviewer", text: r.mockInterviewQuestions[0] },
      ]);
    }
  }, [r]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  if (!r) return <EmptyState />;

  const total = r.mockInterviewQuestions.length;
  const done = idx >= total - 1 && turns.at(-1)?.role === "you";

  function submit() {
    if (!answer.trim()) return;
    const next: Turn[] = [...turns, { role: "you", text: answer.trim() }];
    const ni = idx + 1;
    if (ni < total) {
      next.push({ role: "interviewer", text: r!.mockInterviewQuestions[ni] });
      setIdx(ni);
    } else {
      next.push({ role: "interviewer", text: "That's all the questions. Great job — review your answers and keep practicing!" });
      setIdx(ni);
    }
    setTurns(next);
    setAnswer("");
  }

  function reset() {
    setIdx(0);
    setAnswer("");
    setTurns([
      { role: "interviewer", text: `Hi! I'm your interviewer for the ${r!.jobRole} role. Let's begin.` },
      { role: "interviewer", text: r!.mockInterviewQuestions[0] },
    ]);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mock Interview</h1>
          <p className="text-muted-foreground mt-1">Question {Math.min(idx + 1, total)} of {total}</p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-4 w-4 mr-1" /> Restart</Button>
      </div>

      <Card className="glass-card flex flex-col h-[65vh]">
        <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-3">
          {turns.map((t, i) => (
            <div key={i} className={`flex ${t.role === "you" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                t.role === "you"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border"
              }`}>
                <div className="text-[10px] opacity-70 mb-0.5 uppercase tracking-wide">
                  {t.role === "you" ? "You" : "Interviewer"}
                </div>
                {t.text}
              </div>
            </div>
          ))}
          {done && (
            <div className="flex items-center gap-2 text-success text-sm justify-center pt-4">
              <CheckCircle2 className="h-4 w-4" /> Interview complete
            </div>
          )}
        </div>
        <div className="border-t border-border p-3 flex gap-2">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={done ? "Interview finished — restart to try again" : "Type your answer..."}
            disabled={done}
          />
          <Button onClick={submit} disabled={done || !answer.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
