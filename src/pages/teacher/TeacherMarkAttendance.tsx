import { useState, useMemo } from "react";
import { Check, X, Clock, Save, ClipboardCheck, CheckCircle2, Users, Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTodayAttendance, classes, departments, sections, students as allStudents } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Search } from "lucide-react";

type Status = "present" | "absent" | "late";

const statusConfig: Record<Status, { icon: typeof Check; label: string; activeClass: string; badgeBg: string }> = {
  present: { icon: Check, label: "Present", activeClass: "bg-success text-success-foreground shadow-sm shadow-success/30", badgeBg: "bg-success/10 text-success" },
  absent: { icon: X, label: "Absent", activeClass: "bg-destructive text-destructive-foreground shadow-sm shadow-destructive/30", badgeBg: "bg-destructive/10 text-destructive" },
  late: { icon: Clock, label: "Late", activeClass: "bg-warning text-warning-foreground shadow-sm shadow-warning/30", badgeBg: "bg-warning/10 text-warning" },
};

const subjects = ["Data Structures", "Operating Systems", "Database Systems", "Computer Networks", "Software Engineering", "Web Development", "Machine Learning", "Digital Electronics"];

export default function TeacherMarkAttendance() {
  const { user } = useAuth();
  const [selectedDept, setSelectedDept] = useState(departments[0]);
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Derive class ID from dept + section
  const classId = `${selectedDept.substring(0, 2).toUpperCase()}-${selectedSection}`;

  const todayStudents = useMemo(() => getTodayAttendance(classId), [classId]);

  const [attendance, setAttendance] = useState<Record<string, Status>>(() =>
    Object.fromEntries(todayStudents.map((s) => [s.id, s.status]))
  );

  // Reset attendance when class changes
  const handleClassChange = (dept: string, section: string) => {
    setSelectedDept(dept);
    setSelectedSection(section);
    setSubmitted(false);
    const newClassId = `${dept.substring(0, 2).toUpperCase()}-${section}`;
    const students = getTodayAttendance(newClassId);
    setAttendance(Object.fromEntries(students.map((s) => [s.id, s.status])));
  };

  const filteredStudents = todayStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  const setStatus = (id: string, status: Status) => {
    if (submitted) return;
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const markAll = (status: Status) => {
    if (submitted) return;
    setAttendance(Object.fromEntries(todayStudents.map((s) => [s.id, status])));
  };

  const counts = {
    present: Object.values(attendance).filter((s) => s === "present").length,
    absent: Object.values(attendance).filter((s) => s === "absent").length,
    late: Object.values(attendance).filter((s) => s === "late").length,
    total: todayStudents.length,
  };

  const handleSubmit = () => {
    setConfirmOpen(false);
    setSubmitted(true);
    const cls = classes.find((c) => c.id === classId);
    toast({
      title: "✅ Attendance Submitted Successfully",
      description: `${counts.present} present, ${counts.absent} absent, ${counts.late} late — ${cls?.name || classId} · ${selectedSubject}`,
    });
  };

  const handleEdit = () => {
    setSubmitted(false);
    toast({ title: "Edit Mode", description: "You can now modify the attendance before resubmitting." });
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <ClipboardCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1>Mark Attendance</h1>
              <p>{todayFormatted}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {submitted ? (
            <Button onClick={handleEdit} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" /> Edit Attendance
            </Button>
          ) : (
            <Button
              onClick={() => setConfirmOpen(true)}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md shadow-accent/20"
            >
              <Save className="w-4 h-4" /> Submit Attendance
            </Button>
          )}
        </div>
      </div>

      {/* Submitted banner */}
      {submitted && (
        <div className="flex items-center gap-3 bg-success/10 border border-success/20 rounded-xl p-4 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-success">Attendance submitted successfully</p>
            <p className="text-xs text-success/70">Click "Edit Attendance" to make changes before final lock.</p>
          </div>
        </div>
      )}

      {/* Filters Row */}
      <div className="chart-container">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-bold text-card-foreground">Class Selection</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Department</label>
            <Select value={selectedDept} onValueChange={(v) => handleClassChange(v, selectedSection)}>
              <SelectTrigger className="bg-background h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Section</label>
            <Select value={selectedSection} onValueChange={(v) => handleClassChange(selectedDept, v)}>
              <SelectTrigger className="bg-background h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {sections.map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Subject (Optional)</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="bg-background h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Search Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <Input placeholder="Name or roll no..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-background h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary + Bulk Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid grid-cols-3 gap-3">
          {(["present", "absent", "late"] as Status[]).map((status) => {
            const config = statusConfig[status];
            return (
              <div key={status} className={cn("rounded-xl p-4 text-center", config.badgeBg)}>
                <p className="text-2xl font-extrabold">{counts[status]}</p>
                <p className="text-[11px] font-medium mt-0.5 opacity-70">{config.label}</p>
              </div>
            );
          })}
        </div>
        <div className="flex items-end gap-2">
          <p className="text-[11px] text-muted-foreground mr-auto self-center">Quick actions:</p>
          <Button variant="outline" size="sm" onClick={() => markAll("present")} disabled={submitted} className="text-success border-success/30 hover:bg-success/10 gap-1.5">
            <Check className="w-3.5 h-3.5" /> All Present
          </Button>
          <Button variant="outline" size="sm" onClick={() => markAll("absent")} disabled={submitted} className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1.5">
            <X className="w-3.5 h-3.5" /> All Absent
          </Button>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden stat-card-shadow">
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[60px_1fr_auto] items-center gap-4 px-5 py-3.5 bg-muted/40 border-b border-border">
          <span className="hidden sm:block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Roll No.</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Student</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</span>
        </div>
        <div className="divide-y divide-border/60">
          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Users className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No students found</p>
              <p className="text-xs mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            filteredStudents.map((student, i) => {
              const current = attendance[student.id] || "present";
              return (
                <div
                  key={student.id}
                  className={cn(
                    "grid grid-cols-[1fr_auto] sm:grid-cols-[60px_1fr_auto] items-center gap-4 px-5 py-3 animate-fade-in transition-colors",
                    submitted ? "opacity-80" : "hover:bg-muted/20"
                  )}
                  style={{ animationDelay: `${i * 15}ms` }}
                >
                  <span className="hidden sm:block text-xs font-mono text-muted-foreground">{student.rollNumber}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent ring-1 ring-accent/20">
                      {student.avatar}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-card-foreground">{student.name}</p>
                      <p className="text-[11px] text-muted-foreground sm:hidden">{student.rollNumber}</p>
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
                          disabled={submitted}
                          className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150",
                            active ? config.activeClass : "bg-muted text-muted-foreground hover:bg-muted/80",
                            submitted && "cursor-not-allowed"
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
            })
          )}
        </div>

        {/* Bottom bar */}
        {filteredStudents.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-bold text-card-foreground">{filteredStudents.length}</span> of {counts.total} students
            </p>
            {!submitted && (
              <Button
                onClick={() => setConfirmOpen(true)}
                size="sm"
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm shadow-accent/20"
              >
                <Save className="w-3.5 h-3.5" /> Submit
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-accent" />
              Confirm Attendance Submission
            </DialogTitle>
            <DialogDescription>
              Please review the summary below before submitting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Department</p>
                <p className="font-semibold text-card-foreground mt-0.5">{selectedDept}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Section</p>
                <p className="font-semibold text-card-foreground mt-0.5">Section {selectedSection}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Subject</p>
                <p className="font-semibold text-card-foreground mt-0.5">{selectedSubject}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</p>
                <p className="font-semibold text-card-foreground mt-0.5">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-success/10 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-success">{counts.present}</p>
                <p className="text-[10px] text-success/70 font-medium">Present</p>
              </div>
              <div className="bg-destructive/10 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-destructive">{counts.absent}</p>
                <p className="text-[10px] text-destructive/70 font-medium">Absent</p>
              </div>
              <div className="bg-warning/10 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-warning">{counts.late}</p>
                <p className="text-[10px] text-warning/70 font-medium">Late</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <CheckCircle2 className="w-4 h-4" /> Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
