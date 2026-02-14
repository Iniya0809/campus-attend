import { ReactNode } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, ClipboardCheck, CalendarDays,
  GraduationCap, BookOpen, BarChart3, Settings, LogOut,
  UserCog, Building2, Menu, X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Students", icon: Users, path: "/admin/students" },
    { label: "Teachers", icon: UserCog, path: "/admin/teachers" },
    { label: "Classes", icon: Building2, path: "/admin/classes" },
    { label: "Reports", icon: BarChart3, path: "/admin/reports" },
  ],
  teacher: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/teacher" },
    { label: "Mark Attendance", icon: ClipboardCheck, path: "/teacher/attendance" },
    { label: "Reports", icon: BarChart3, path: "/teacher/reports" },
  ],
  student: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
    { label: "Attendance History", icon: CalendarDays, path: "/student/history" },
  ],
};

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  teacher: "Teacher Panel",
  student: "Student Portal",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const navItems = roleNavItems[user.role];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen sidebar-gradient border-r border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary">
            <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-primary-foreground tracking-wide">AttendTrack</h1>
            <p className="text-[11px] text-sidebar-foreground/60">{roleLabels[user.role]}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-primary-foreground"
              )}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-sidebar-border space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-primary">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-primary-foreground truncate">{user.name}</p>
              <p className="text-[11px] text-sidebar-foreground/50 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-destructive transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">AttendTrack</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-14 left-0 right-0 bg-card border-b border-border shadow-lg p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-[18px] h-[18px]" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 md:pt-6 mt-14 md:mt-0 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
