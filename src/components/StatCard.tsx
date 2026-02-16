import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "destructive" | "warning" | "accent";
  className?: string;
  trend?: string;
}

const variantStyles = {
  default: {
    icon: "bg-primary/10 text-primary",
    border: "border-l-primary",
  },
  success: {
    icon: "bg-success/10 text-success",
    border: "border-l-success",
  },
  destructive: {
    icon: "bg-destructive/10 text-destructive",
    border: "border-l-destructive",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    border: "border-l-warning",
  },
  accent: {
    icon: "bg-accent/10 text-accent",
    border: "border-l-accent",
  },
};

export default function StatCard({ title, value, subtitle, icon: Icon, variant = "default", className, trend }: StatCardProps) {
  const styles = variantStyles[variant];
  return (
    <div className={cn(
      "bg-card rounded-xl border border-border border-l-[3px] p-5 stat-card-shadow card-hover animate-fade-in",
      styles.border,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{title}</p>
          <p className="text-[28px] font-extrabold text-card-foreground leading-none">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && <p className="text-xs font-semibold text-success mt-1">↑ {trend}</p>}
        </div>
        <div className={cn("p-3 rounded-xl", styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
