import { useAnalysis } from "@/store/analysis";
import EmptyState from "@/components/EmptyState";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const COLORS = ["hsl(180 95% 55%)", "hsl(260 80% 65%)", "hsl(35 95% 60%)", "hsl(150 80% 50%)", "hsl(0 84% 60%)", "hsl(195 100% 60%)"];

export default function SkillGapPage() {
  const r = useAnalysis((s) => s.result);
  if (!r) return <EmptyState />;

  const barData = [
    { name: "Matched", value: r.matchedSkills.length },
    { name: "Missing", value: r.missingSkills.length },
  ];
  const pieData = barData;
  const radarData = [
    ...r.matchedSkills.slice(0, 6).map((s) => ({ skill: s, You: 90, Required: 100 })),
    ...r.missingSkills.slice(0, 4).map((s) => ({ skill: s, You: 20, Required: 100 })),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
        <p className="text-muted-foreground mt-1">How your skills stack up for {r.jobRole}.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card p-6">
          <h2 className="font-semibold mb-4">Bar — Matched vs Missing</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                <Cell fill="hsl(150 80% 50%)" />
                <Cell fill="hsl(0 84% 60%)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-card p-6">
          <h2 className="font-semibold mb-4">Pie — Skill Composition</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                {pieData.map((_, i) => <Cell key={i} fill={i === 0 ? "hsl(150 80% 50%)" : "hsl(0 84% 60%)"} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-card p-6 lg:col-span-2">
          <h2 className="font-semibold mb-4">Radar — You vs Role Requirement</h2>
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Radar name="Required" dataKey="Required" stroke="hsl(260 80% 65%)" fill="hsl(260 80% 65%)" fillOpacity={0.25} />
              <Radar name="You" dataKey="You" stroke="hsl(180 95% 55%)" fill="hsl(180 95% 55%)" fillOpacity={0.45} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card p-6">
          <h2 className="font-semibold mb-3 text-success">Matched Skills ({r.matchedSkills.length})</h2>
          <div className="flex flex-wrap gap-2">
            {r.matchedSkills.length ? r.matchedSkills.map((s) => (
              <Badge key={s} className="bg-success/15 text-success border-success/30 hover:bg-success/25">{s}</Badge>
            )) : <p className="text-sm text-muted-foreground">None detected.</p>}
          </div>
        </Card>
        <Card className="glass-card p-6">
          <h2 className="font-semibold mb-3 text-destructive">Missing Skills ({r.missingSkills.length})</h2>
          <div className="flex flex-wrap gap-2">
            {r.missingSkills.length ? r.missingSkills.map((s) => (
              <Badge key={s} className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/25">{s}</Badge>
            )) : <p className="text-sm text-muted-foreground">All required skills covered!</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
