import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Upload, Gauge, Target, Briefcase,
  IndianRupee, Map, FileEdit, MessagesSquare, Bot, Sparkles,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Upload Resume", url: "/upload", icon: Upload },
  { title: "Analysis Score", url: "/score", icon: Gauge },
  { title: "Skill Gap", url: "/skill-gap", icon: Target },
  { title: "Job Recommendations", url: "/jobs", icon: Briefcase },
  { title: "Salary Insights", url: "/salary", icon: IndianRupee },
  { title: "Learning Roadmap", url: "/roadmap", icon: Map },
  { title: "Modified Resume", url: "/resume", icon: FileEdit },
  { title: "Mock Interview", url: "/interview", icon: MessagesSquare },
  { title: "Chatbot", url: "/chatbot", icon: Bot },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-glow animate-pulse-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold gradient-text">ResumeAI</span>
              <span className="text-[10px] text-muted-foreground">v1.0 · Analyzer</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <NavLink to={item.url} end className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
