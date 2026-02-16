import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { GraduationCap, LogIn, Shield, BookOpen, User, Lock, Mail } from "lucide-react";
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
      <div className="hidden lg:flex lg:w-[45%] login-gradient relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(174,60%,40%,0.12),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-accent/8 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col justify-center px-14 xl:px-20 text-sidebar-foreground w-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent shadow-lg shadow-accent/30">
              <GraduationCap className="w-7 h-7 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">AttendTrack</h1>
              <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider">Smart Attendance System</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] mb-5">
            Digital<br />Attendance<br />
            <span className="text-accent">Made Simple.</span>
          </h2>
          <p className="text-white/50 max-w-sm leading-relaxed text-sm">
            A modern, secure, and efficient attendance management system for educational institutions.
          </p>

          <div className="mt-14 grid grid-cols-2 gap-3 max-w-xs">
            {[
              { label: "Real-time", value: "Live" },
              { label: "Accuracy", value: "99.9%" },
              { label: "Time Saved", value: "80%" },
              { label: "Reports", value: "Auto" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                <p className="text-xl font-bold text-accent">{stat.value}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] space-y-8 animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent shadow-md">
              <GraduationCap className="w-6 h-6 text-accent-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">AttendTrack</h1>
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
                    "flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200",
                    active
                      ? "border-accent bg-accent/5 shadow-md shadow-accent/10"
                      : "border-border bg-card hover:border-accent/30 hover:shadow-sm"
                  )}
                >
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
                    active ? "bg-accent text-accent-foreground shadow-sm" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn("text-xs font-bold", active ? "text-accent" : "text-muted-foreground")}>{r.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center bg-muted/40 py-2 rounded-lg">
            {roles.find((r) => r.role === selectedRole)?.description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-card h-11" placeholder="Enter your email" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-card h-11" placeholder="Enter your password" required />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground h-11 text-sm font-semibold shadow-md shadow-accent/20" disabled={isLoading}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="bg-muted/40 rounded-xl p-4 text-xs text-muted-foreground border border-border/50">
            <p className="font-semibold text-foreground/70 mb-1.5">Demo Credentials</p>
            <p>Use any role email above with password: <code className="font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded text-[11px]">password</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
