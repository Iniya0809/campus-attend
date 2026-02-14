import { useAuth } from "@/contexts/AuthContext";
import { getStudentAttendancePercent, attendanceRecords, students } from "@/lib/data";
import { UserCheck, UserX, Clock, AlertTriangle, CalendarDays, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import StatCard from "@/components/StatCard";

const PIE_COLORS = ["hsl(152, 60%, 42%)", "hsl(0, 72%, 55%)", "hsl(38, 92%, 55%)"];

export default function StudentDashboard() {
  const { user } = useAuth();
  const studentId = user?.id || "STU001";
  const student = students.find((s) => s.id === studentId) || students[0];
  const records = attendanceRecords.filter((r) => r.studentId === student.id);
  const totalDays = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const percent = getStudentAttendancePercent(student.id);
  const isLow = percent < 75;

  const pieData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Late", value: late },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome, {student.name} · {student.rollNumber}</p>
      </div>

      {isLow && (
        <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">Low Attendance Warning</p>
            <p className="text-xs text-destructive/80">Your attendance is below 75%. Please improve your attendance to avoid academic penalties.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Attendance" value={`${percent}%`} icon={TrendingUp} variant={isLow ? "destructive" : "success"} subtitle={`${totalDays} working days`} />
        <StatCard title="Days Present" value={present} icon={UserCheck} variant="success" subtitle={`${totalDays ? Math.round((present / totalDays) * 100) : 0}%`} />
        <StatCard title="Days Absent" value={absent} icon={UserX} variant="destructive" subtitle={`${totalDays ? Math.round((absent / totalDays) * 100) : 0}%`} />
        <StatCard title="Days Late" value={late} icon={Clock} variant="warning" subtitle={`${totalDays ? Math.round((late / totalDays) * 100) : 0}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Attendance Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Student Details</h3>
          <div className="space-y-3">
            {[
              { label: "Name", value: student.name },
              { label: "Roll Number", value: student.rollNumber },
              { label: "Department", value: student.department },
              { label: "Section", value: student.section },
              { label: "Semester", value: String(student.semester) },
              { label: "Email", value: student.email },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-card-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
