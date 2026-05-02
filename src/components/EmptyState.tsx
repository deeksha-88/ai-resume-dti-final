import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

export default function EmptyState({ msg = "No analysis yet." }: { msg?: string }) {
  const nav = useNavigate();
  return (
    <Card className="glass-card p-12 text-center max-w-xl mx-auto">
      <Upload className="h-10 w-10 mx-auto text-primary" />
      <h2 className="mt-4 text-xl font-semibold">{msg}</h2>
      <p className="text-muted-foreground mt-2 text-sm">Upload a resume and pick a target role to populate this section.</p>
      <Button className="mt-6" onClick={() => nav("/upload")}>Go to Upload</Button>
    </Card>
  );
}
