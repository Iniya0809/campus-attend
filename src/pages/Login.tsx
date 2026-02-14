import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { GraduationCap, LogIn, Shield, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const roles: { role: UserRole; label: string; icon: typeof Shield; description: string; credentials: string }[] = [
  { role: "admin", label: "Admin", icon: Shield, description: "Full system access & management", credentials: "admin@college.edu" },
  { role: "teacher", label: "Teacher", icon: BookOpen, description: "Mark attendance & view reports", credentials: "teacher@college.edu" },
  { role: "student", label: "Student", icon: User, description: "View personal attendance", credentials: "student@college.edu" },
];

export default function Login() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("admin@college.edu");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const r = roles.find((r) => r.role === role);
    if (r) setEmail(r.credentials);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 800));
    const success = login(email, password, selectedRole);
    setIsLoading(false);
    if (!success) {
      toast({ title: "Login Failed", description: "Invalid credentials", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 sidebar-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(174,60%,40%,0.15),transparent_60%)]" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-sidebar-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent">
              <GraduationCap className="w-7 h-7 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-primary-foreground tracking-tight">AttendTrack</h1>
              <p className="text-sm text-sidebar-foreground/60">Smart Attendance Management</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-sidebar-primary-foreground leading-tight mb-4">
            Digital Attendance<br />Made Simple
          </h2>
          <p className="text-sidebar-foreground/70 max-w-md leading-relaxed">
            A modern, secure, and efficient attendance management system for educational institutions.
            Track, analyze, and manage student attendance with ease.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm">
            {[
              { label: "Real-time Tracking", value: "Live" },
              { label: "Accuracy Rate", value: "99.9%" },
              { label: "Time Saved", value: "80%" },
              { label: "Reports", value: "Auto" },
            ].map((stat) => (
              <div key={stat.label} className="bg-sidebar-accent/50 rounded-lg p-3">
                <p className="text-lg font-bold text-sidebar-primary">{stat.value}</p>
                <p className="text-xs text-sidebar-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent">
              <GraduationCap className="w-6 h-6 text-accent-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">AttendTrack</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Select your role and sign in to continue</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3">
            {roles.map((r) => {
              const Icon = r.icon;
              const active = selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => handleRoleSelect(r.role)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                    active
                      ? "border-accent bg-accent/5 shadow-sm"
                      : "border-border bg-card hover:border-accent/40"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn("text-xs font-semibold", active ? "text-accent" : "text-muted-foreground")}>{r.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {roles.find((r) => r.role === selectedRole)?.description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-card" placeholder="Enter your email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-card" placeholder="Enter your password" required />
            </div>
            <Button type="submit" className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Use any email above with password: <span className="font-mono text-foreground">password</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
