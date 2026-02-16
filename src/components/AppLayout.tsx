import { ReactNode, useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, ClipboardCheck, CalendarDays,
  GraduationCap, BookOpen, BarChart3, LogOut,
  UserCog, Building2, Menu, X, ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
      <aside className="hidden md:flex flex-col w-[260px] min-h-screen sidebar-gradient border-r border-sidebar-border flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent shadow-lg shadow-accent/20">
            <GraduationCap className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-primary-foreground tracking-wide">AttendTrack</h1>
            <p className="text-[10px] text-sidebar-foreground/50 font-medium uppercase tracking-wider">{roleLabels[user.role]}</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-widest px-3 mb-3">Menu</p>
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group animate-slide-in-left",
                  isActive
                    ? "bg-accent/15 text-accent border-l-2 border-accent ml-0"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-primary-foreground"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <item.icon className={cn("w-[18px] h-[18px] transition-colors", isActive ? "text-accent" : "text-sidebar-foreground/50 group-hover:text-sidebar-primary-foreground")} />
                {item.label}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-accent/70" />}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sidebar-accent/30">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent ring-2 ring-accent/30">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-primary-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/40 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[13px] font-medium text-sidebar-foreground/50 hover:bg-destructive/10 hover:text-destructive transition-all duration-150"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-sm">
            <GraduationCap className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground tracking-tight">AttendTrack</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="h-9 w-9">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-14 left-0 right-0 bg-card border-b border-border shadow-xl p-3 space-y-1 animate-scale-in" onClick={(e) => e.stopPropagation()}>
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
            <div className="border-t border-border pt-2 mt-2">
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-[18px] h-[18px]" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-5 md:p-8 mt-14 md:mt-0 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
