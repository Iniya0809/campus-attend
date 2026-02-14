import { useState } from "react";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatCard from "@/components/StatCard";
import CourseFilter from "@/components/CourseFilter";
import { getAttendanceStats, getWeeklyData, students } from "@/lib/data";

const PIE_COLORS = [
  "hsl(152, 60%, 42%)",
  "hsl(0, 72%, 55%)",
  "hsl(38, 92%, 55%)",
];

export default function Dashboard() {
  const [course, setCourse] = useState("all");
  const selected = course === "all" ? undefined : course;
  const stats = getAttendanceStats(selected);
  const weeklyData = getWeeklyData(selected);
  const totalStudents = selected ? students.filter((s) => s.course === selected).length : students.length;

  const pieData = [
    { name: "Present", value: stats.presentPercent },
    { name: "Absent", value: stats.absentPercent },
    { name: "Late", value: stats.latePercent },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Attendance overview for the last 30 days</p>
        </div>
        <CourseFilter value={course} onChange={setCourse} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={totalStudents} icon={Users} subtitle="Enrolled" />
        <StatCard title="Present" value={`${stats.presentPercent}%`} icon={UserCheck} variant="success" subtitle={`${stats.present} records`} />
        <StatCard title="Absent" value={`${stats.absentPercent}%`} icon={UserX} variant="destructive" subtitle={`${stats.absent} records`} />
        <StatCard title="Late" value={`${stats.latePercent}%`} icon={Clock} variant="warning" subtitle={`${stats.late} records`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 stat-card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(214, 20%, 90%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="present" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
