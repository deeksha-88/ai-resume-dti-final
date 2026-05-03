import { useState, useRef, useEffect } from "react";
import { useAnalysis } from "@/store/analysis";
import EmptyState from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";
import { chatbotReply } from "@/lib/analysis";

type Msg = { role: "bot" | "user"; text: string };

const SUGGESTIONS = [
  "What skills am I missing?",
  "How can I improve?",
  "What's my salary range?",
  "Suggest projects",
];

export default function ChatbotPage() {
  const r = useAnalysis((s) => s.result);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (r && msgs.length === 0) setMsgs([{ role: "bot", text: r.chatbotResponse }]);
  }, [r]);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  if (!r) return <EmptyState />;

  async function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    try {
      const reply = await chatbotReply(t, r!);
      setMsgs((m) => [...m, { role: "bot", text: reply }]);
    } catch (e: any) {
      setMsgs((m) => [...m, { role: "bot", text: `⚠️ ${e?.message ?? "Chat failed"}` }]);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-3xl font-bold">AI Chatbot</h1>
        <p className="text-muted-foreground mt-1">Ask anything about your analysis.</p>
      </div>

      <Card className="glass-card flex flex-col h-[65vh]">
        <div ref={ref} className="flex-1 overflow-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "bot" && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
              }`}>
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-border p-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:border-primary/50 hover:text-primary transition-colors">
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask the AI..."
            />
            <Button onClick={() => send(input)} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
