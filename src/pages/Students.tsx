import { useState } from "react";
import { Search, Mail } from "lucide-react";
import { students, attendanceRecords } from "@/lib/data";
import CourseFilter from "@/components/CourseFilter";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function Students() {
  const [course, setCourse] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) => {
    const matchesCourse = course === "all" || s.course === course;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const getStudentAttendance = (id: string) => {
    const records = attendanceRecords.filter((r) => r.studentId === id);
    const present = records.filter((r) => r.status === "present").length;
    return records.length ? Math.round((present / records.length) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} students enrolled</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-[200px] bg-card" />
          </div>
          <CourseFilter value={course} onChange={setCourse} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((student, i) => {
          const percent = getStudentAttendance(student.id);
          return (
            <div
              key={student.id}
              className="bg-card rounded-xl border border-border p-5 stat-card-shadow animate-fade-in hover:border-accent/40 transition-colors"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {student.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-card-foreground truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{student.rollNumber}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{student.email}</span>
                </div>
                <p className="text-muted-foreground">{student.course}</p>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-semibold text-card-foreground">{percent}%</span>
                </div>
                <Progress value={percent} className="h-1.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
