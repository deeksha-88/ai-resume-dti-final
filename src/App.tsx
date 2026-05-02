import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import ScorePage from "./pages/ScorePage";
import SkillGapPage from "./pages/SkillGapPage";
import JobsPage from "./pages/JobsPage";
import SalaryPage from "./pages/SalaryPage";
import RoadmapPage from "./pages/RoadmapPage";
import ResumePage from "./pages/ResumePage";
import InterviewPage from "./pages/InterviewPage";
import ChatbotPage from "./pages/ChatbotPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/score" element={<ScorePage />} />
            <Route path="/skill-gap" element={<SkillGapPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/salary" element={<SalaryPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
