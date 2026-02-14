import { useState } from "react";
import { Users, UserCheck, UserX, Clock, AlertTriangle, TrendingUp, Building2, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import StatCard from "@/components/StatCard";
import { getAttendanceStats, getWeeklyData, getMonthlyTrend, getLowAttendanceStudents, getDepartmentStats, students, teachers, classes } from "@/lib/data";

const PIE_COLORS = ["hsl(152, 60%, 42%)", "hsl(0, 72%, 55%)", "hsl(38, 92%, 55%)"];

export default function AdminDashboard() {
  const stats = getAttendanceStats();
  const weeklyData = getWeeklyData();
  const monthlyTrend = getMonthlyTrend();
  const lowAttendance = getLowAttendanceStudents();
  const deptStats = getDepartmentStats();

  const todayStats = getAttendanceStats({ date: new Date().toISOString().split("T")[0] });
  const pieData = [
    { name: "Present", value: stats.presentPercent },
    { name: "Absent", value: stats.absentPercent },
    { name: "Late", value: stats.latePercent },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Complete overview of the attendance management system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} icon={Users} subtitle="All departments" />
        <StatCard title="Total Teachers" value={teachers.length} icon={BookOpen} variant="accent" subtitle="Active faculty" />
        <StatCard title="Total Classes" value={classes.length} icon={Building2} variant="default" subtitle="Across departments" />
        <StatCard title="Avg Attendance" value={`${stats.presentPercent}%`} icon={TrendingUp} variant="success" subtitle="Last 30 days" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Present Today" value={todayStats.present} icon={UserCheck} variant="success" subtitle={`${todayStats.presentPercent}%`} />
        <StatCard title="Absent Today" value={todayStats.absent} icon={UserX} variant="destructive" subtitle={`${todayStats.absentPercent}%`} />
        <StatCard title="Late Today" value={todayStats.late} icon={Clock} variant="warning" subtitle={`${todayStats.latePercent}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 stat-card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Weekly Attendance Overview</h3>
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
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Overall Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i]} />))}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 15%, 50%)" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="attendance" stroke="hsl(174, 60%, 40%)" strokeWidth={2} dot={{ fill: "hsl(174, 60%, 40%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-semibold text-card-foreground">Low Attendance Students ({lowAttendance.length})</h3>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {lowAttendance.slice(0, 8).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center text-[10px] font-bold text-destructive">{s.avatar}</div>
                  <div>
                    <p className="text-xs font-medium text-card-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.rollNumber} · {s.department}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-destructive">{s.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 stat-card-shadow">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Department-wise Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Department</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Students</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Present %</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Absent %</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Late %</th>
              </tr>
            </thead>
            <tbody>
              {deptStats.map((d) => (
                <tr key={d.department} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-card-foreground">{d.department}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{d.students}</td>
                  <td className="py-3 px-4 text-center"><span className="text-success font-semibold">{d.presentPercent}%</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-destructive font-semibold">{d.absentPercent}%</span></td>
                  <td className="py-3 px-4 text-center"><span className="text-warning font-semibold">{d.latePercent}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
