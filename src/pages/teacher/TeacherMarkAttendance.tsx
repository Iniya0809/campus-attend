import { useState } from "react";
import { Check, X, Clock, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import ClassFilter from "@/components/ClassFilter";
import { getTodayAttendance, classes } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type Status = "present" | "absent" | "late";

const statusConfig: Record<Status, { icon: typeof Check; label: string; className: string }> = {
  present: { icon: Check, label: "Present", className: "bg-success text-success-foreground" },
  absent: { icon: X, label: "Absent", className: "bg-destructive text-destructive-foreground" },
  late: { icon: Clock, label: "Late", className: "bg-warning text-warning-foreground" },
};

export default function TeacherMarkAttendance() {
  const { user } = useAuth();
  const assignedClasses = user?.assignedClasses || classes.slice(0, 2).map((c) => c.id);
  const [selectedClass, setSelectedClass] = useState(assignedClasses[0] || "all");

  const classId = selectedClass === "all" ? undefined : selectedClass;
  const todayStudents = getTodayAttendance(classId);
  const [attendance, setAttendance] = useState<Record<string, Status>>(() =>
    Object.fromEntries(todayStudents.map((s) => [s.id, s.status]))
  );

  const setStatus = (id: string, status: Status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const handleSave = () => {
    const cls = classes.find((c) => c.id === selectedClass);
    toast({ title: "Attendance Saved", description: `Attendance marked for ${todayStudents.length} students in ${cls?.name || "all classes"}.` });
  };

  const counts = {
    present: Object.values(attendance).filter((s) => s === "present").length,
    absent: Object.values(attendance).filter((s) => s === "absent").length,
    late: Object.values(attendance).filter((s) => s === "late").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ClassFilter value={selectedClass} onChange={setSelectedClass} />
          <Button onClick={handleSave} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Save className="w-4 h-4" />Save
          </Button>
        </div>
      </div>

      {/* Quick summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-success/10 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-success">{counts.present}</p>
          <p className="text-xs text-success/80">Present</p>
        </div>
        <div className="bg-destructive/10 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-destructive">{counts.absent}</p>
          <p className="text-xs text-destructive/80">Absent</p>
        </div>
        <div className="bg-warning/10 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-warning">{counts.late}</p>
          <p className="text-xs text-warning/80">Late</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden stat-card-shadow">
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="hidden sm:block">Roll No.</span>
          <span>Student</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-border">
          {todayStudents.map((student, i) => {
            const current = attendance[student.id] || "present";
            return (
              <div key={student.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3 animate-fade-in" style={{ animationDelay: `${i * 20}ms` }}>
                <span className="hidden sm:block text-sm font-mono text-muted-foreground">{student.rollNumber}</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{student.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{student.rollNumber}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {(Object.keys(statusConfig) as Status[]).map((status) => {
                    const config = statusConfig[status];
                    const Icon = config.icon;
                    const active = current === status;
                    return (
                      <button key={status} onClick={() => setStatus(student.id, status)} className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150", active ? config.className : "bg-muted text-muted-foreground hover:bg-muted/80")} title={config.label}>
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
