import { useState } from "react";
import { Check, X, Clock, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import CourseFilter from "@/components/CourseFilter";
import { getTodayAttendance } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Status = "present" | "absent" | "late";

const statusConfig: Record<Status, { icon: typeof Check; label: string; className: string }> = {
  present: { icon: Check, label: "Present", className: "bg-success text-success-foreground" },
  absent: { icon: X, label: "Absent", className: "bg-destructive text-destructive-foreground" },
  late: { icon: Clock, label: "Late", className: "bg-warning text-warning-foreground" },
};

export default function MarkAttendance() {
  const [course, setCourse] = useState("all");
  const selected = course === "all" ? undefined : course;
  const initial = getTodayAttendance(selected);
  const [attendance, setAttendance] = useState<Record<string, Status>>(() =>
    Object.fromEntries(initial.map((s) => [s.id, s.status]))
  );

  const todayStudents = getTodayAttendance(selected);

  const setStatus = (id: string, status: Status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const handleSave = () => {
    toast({ title: "Attendance Saved", description: `Marked attendance for ${todayStudents.length} students.` });
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
          <CourseFilter value={course} onChange={setCourse} />
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
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
              <div
                key={student.id}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3 animate-fade-in"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <span className="hidden sm:block text-sm font-mono text-muted-foreground">{student.rollNumber}</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {student.avatar}
                  </div>
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
                      <button
                        key={status}
                        onClick={() => setStatus(student.id, status)}
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150",
                          active ? config.className : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                        title={config.label}
                      >
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
