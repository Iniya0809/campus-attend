import { useState } from "react";
import { attendanceRecords, students } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, Check, X, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusIcons = {
  present: { icon: Check, className: "bg-success text-success-foreground" },
  absent: { icon: X, className: "bg-destructive text-destructive-foreground" },
  late: { icon: Clock, className: "bg-warning text-warning-foreground" },
};

export default function StudentHistory() {
  const { user } = useAuth();
  const studentId = user?.id || "STU001";
  const student = students.find((s) => s.id === studentId) || students[0];
  const records = attendanceRecords
    .filter((r) => r.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [filter, setFilter] = useState<"all" | "present" | "absent" | "late">("all");
  const filtered = filter === "all" ? records : records.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance History</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} records found</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => toast({ title: "Report Downloaded", description: "Attendance summary saved." })}>
          <Download className="w-4 h-4" />Download Summary
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "present", "absent", "late"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-semibold transition-colors capitalize",
              filter === f ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f === "all" ? "All" : f} {f !== "all" && `(${records.filter((r) => r.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden stat-card-shadow">
        <div className="divide-y divide-border">
          {filtered.map((record, i) => {
            const config = statusIcons[record.status];
            const Icon = config.icon;
            const dateObj = new Date(record.date);
            return (
              <div key={`${record.date}-${record.classId}`} className="flex items-center justify-between px-5 py-4 animate-fade-in hover:bg-muted/20 transition-colors" style={{ animationDelay: `${i * 15}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center min-w-[50px]">
                    <span className="text-lg font-bold text-card-foreground">{dateObj.getDate()}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {dateObj.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
                    </p>
                    <p className="text-xs text-muted-foreground">Class: {record.classId}</p>
                  </div>
                </div>
                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold capitalize", config.className)}>
                  <Icon className="w-3.5 h-3.5" />
                  {record.status}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
