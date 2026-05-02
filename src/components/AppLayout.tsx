import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAnalysis } from "@/store/analysis";
import { Badge } from "@/components/ui/badge";

export default function AppLayout() {
  const result = useAnalysis((s) => s.result);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border/60 px-4 backdrop-blur-md bg-background/40 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground hidden sm:inline">
                AI Resume Analyzer & Job Recommender
              </span>
            </div>
            {result && (
              <Badge variant="outline" className="border-primary/40 text-primary">
                Analyzed: {result.jobRole} · {result.score}%
              </Badge>
            )}
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-float-up">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
