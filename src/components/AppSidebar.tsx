import { LayoutDashboard, Users, ClipboardCheck, CalendarDays, GraduationCap } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Mark Attendance", icon: ClipboardCheck, path: "/attendance" },
  { label: "Students", icon: Users, path: "/students" },
  { label: "History", icon: CalendarDays, path: "/history" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen sidebar-gradient border-r border-sidebar-border">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary">
          <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-primary-foreground tracking-wide">AttendTrack</h1>
          <p className="text-[11px] text-sidebar-foreground/60">Management System</p>
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

      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-primary">
            AP
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-primary-foreground">Admin Panel</p>
            <p className="text-[11px] text-sidebar-foreground/50">admin@college.edu</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
