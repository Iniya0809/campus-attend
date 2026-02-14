import { getAttendanceStats, getWeeklyData, getLowAttendanceStudents, classes } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import ClassFilter from "@/components/ClassFilter";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function TeacherReports() {
  const { user } = useAuth();
  const assignedClasses = user?.assignedClasses || classes.slice(0, 2).map((c) => c.id);
  const [selectedClass, setSelectedClass] = useState(assignedClasses[0] || "all");
  const classId = selectedClass === "all" ? undefined : selectedClass;
  const weeklyData = getWeeklyData(classId);
  const lowAttendance = getLowAttendanceStudents();
  const classLow = classId
    ? lowAttendance.filter((s) => `${s.department.substring(0, 2).toUpperCase()}-${s.section}` === classId)
    : lowAttendance;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Class Reports</h1>
          <p className="text-sm text-muted-foreground">View and export attendance reports</p>
        </div>
        <div className="flex items-center gap-3">
          <ClassFilter value={selectedClass} onChange={setSelectedClass} />
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => toast({ title: "Report Downloaded" })}>
            <Download className="w-4 h-4" />Export
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Weekly Attendance</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklyData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
            <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
            <Bar dataKey="present" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="late" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Low Attendance Students ({classLow.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Student</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Roll No.</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {classLow.map((s) => (
                <tr key={s.id} className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-card-foreground">{s.name}</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{s.rollNumber}</td>
                  <td className="py-3 px-4 text-center font-bold text-destructive">{s.percent}%</td>
                </tr>
              ))}
              {classLow.length === 0 && (
                <tr><td colSpan={3} className="py-8 text-center text-muted-foreground">No students below threshold</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
