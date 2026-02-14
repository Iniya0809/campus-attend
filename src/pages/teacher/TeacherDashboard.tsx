import { useState } from "react";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/StatCard";
import ClassFilter from "@/components/ClassFilter";
import { getAttendanceStats, getWeeklyData, classes, getTodayAttendance } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const assignedClasses = user?.assignedClasses || classes.slice(0, 2).map((c) => c.id);
  const [selectedClass, setSelectedClass] = useState(assignedClasses[0] || "all");

  const classId = selectedClass === "all" ? undefined : selectedClass;
  const stats = getAttendanceStats({ classId });
  const weeklyData = getWeeklyData(classId);
  const todayStudents = getTodayAttendance(classId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
        </div>
        <ClassFilter value={selectedClass} onChange={setSelectedClass} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={todayStudents.length} icon={Users} />
        <StatCard title="Present Rate" value={`${stats.presentPercent}%`} icon={UserCheck} variant="success" />
        <StatCard title="Absent Rate" value={`${stats.absentPercent}%`} icon={UserX} variant="destructive" />
        <StatCard title="Late Rate" value={`${stats.latePercent}%`} icon={Clock} variant="warning" />
      </div>

      <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">This Week's Attendance</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklyData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
            <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
            <Bar dataKey="present" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} name="Present" />
            <Bar dataKey="absent" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} name="Absent" />
            <Bar dataKey="late" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} name="Late" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">My Assigned Classes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {assignedClasses.map((cId) => {
            const cls = classes.find((c) => c.id === cId);
            const clsStats = getAttendanceStats({ classId: cId });
            return (
              <div key={cId} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{cls?.name || cId}</p>
                  <p className="text-xs text-muted-foreground">{cls?.studentCount || 0} students</p>
                </div>
                <span className="text-lg font-bold text-success">{clsStats.presentPercent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
